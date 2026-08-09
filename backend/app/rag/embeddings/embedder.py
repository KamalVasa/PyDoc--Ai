import requests
import time
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Cache for local fastembed model
_fastembed_model = None


def query_huggingface_embeddings(texts: list[str]) -> list[list[float]]:
    """Query Hugging Face Inference API for text embeddings."""
    model_id = settings.EMBEDDING_MODEL  # e.g. "sentence-transformers/all-MiniLM-L6-v2"
    api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_id}"
    
    headers = {}
    # Retrieve HF API token from settings if present
    hf_token = getattr(settings, "HF_API_KEY", None)
    if hf_token:
        headers["Authorization"] = f"Bearer {hf_token}"
        
    payload = {
        "inputs": texts,
        "options": {"wait_for_model": True}
    }
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Hugging Face Inference API request
            response = requests.post(api_url, headers=headers, json=payload, timeout=30)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Feature extraction API returns list of embeddings
                    # Sometimes HF API returns a list of floats instead of nested lists for a single input
                    if isinstance(data[0], float):
                        return [data]
                    return data
                raise ValueError(f"Unexpected response format from HF API: {data}")
            elif response.status_code == 503:
                # Model is loading, wait and retry
                err_data = response.json()
                estimated_time = err_data.get("estimated_time", 10)
                logger.warning(f"Hugging Face model is loading. Waiting {estimated_time}s (attempt {attempt+1}/{max_retries})...")
                time.sleep(min(estimated_time, 10))
            else:
                logger.error(f"Hugging Face API returned error status {response.status_code}: {response.text}")
                response.raise_for_status()
        except Exception as e:
            if attempt == max_retries - 1:
                logger.error(f"Failed to fetch embeddings from Hugging Face: {e}")
                raise e
            time.sleep(2)
            
    raise ValueError("Failed to get response from Hugging Face Inference API after retries.")


def get_local_fastembed_model():
    """Lazily load and return the fastembed TextEmbedding model."""
    global _fastembed_model
    if _fastembed_model is None:
        from fastembed import TextEmbedding
        try:
            logger.info(f"Loading local fastembed model {settings.EMBEDDING_MODEL}...")
            _fastembed_model = TextEmbedding(model_name=settings.EMBEDDING_MODEL)
        except Exception as e:
            logger.warning(f"Failed to load {settings.EMBEDDING_MODEL} via fastembed: {e}. Falling back to default BAAI/bge-small-en-v1.5")
            _fastembed_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
        logger.info("Local fastembed model loaded successfully.")
    return _fastembed_model


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """Generate dense vector embeddings for a list of text strings."""
    if not texts:
        return []
    
    # 1. Try Hugging Face Inference API first (highly recommended: 0-RAM, fast)
    try:
        return query_huggingface_embeddings(texts)
    except Exception as api_err:
        logger.warning(f"Hugging Face API failed or not configured: {api_err}. Trying local fastembed fallback...")
        
    # 2. Local fallback using fastembed (ONNX runtime, PyTorch-free)
    try:
        model = get_local_fastembed_model()
        embeddings_gen = model.embed(texts)
        return [emb.tolist() for emb in embeddings_gen]
    except ImportError:
        logger.error("fastembed is not installed. Local fallback unavailable.")
        raise api_err
    except Exception as local_err:
        logger.error(f"Local embedding generation failed: {local_err}")
        raise local_err


def generate_single_embedding(text: str) -> list[float]:
    """Generate dense vector embedding for a single query text."""
    embeddings = generate_embeddings([text])
    if embeddings and len(embeddings) > 0:
        return embeddings[0]
    raise ValueError("No embedding returned from generation backend.")
