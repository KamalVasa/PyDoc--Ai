from typing import AsyncGenerator
# Topic validation is now handled purely by LLM prompts
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)


async def run_rag_pipeline(
    query: str,
    user_id: str,
    chat_history: list[dict] = None,
) -> AsyncGenerator[str, None]:
    """Execute complete RAG pipeline with strict Python topic guard and streaming output."""

    # STEP 1: (Deprecated) Strict Python Topic Guard was removed in favor of LLM-based boundary enforcement.


    # STEP 2: Vector Similarity Search (optional context enrichment)
    context_chunks = []
    try:
        from app.rag.vectordb.chromadb_client import similarity_search
        results = similarity_search(query=query, user_id=user_id, top_k=settings.TOP_K_RESULTS)
        if results and len(results) > 0:
            context_chunks = [r["content"] for r in results]
            logger.info(f"Found {len(context_chunks)} context chunks for query: '{query}'")
        else:
            logger.info(f"No context found for query: '{query}'. Proceeding with general LLM Python knowledge.")
    except Exception as e:
        logger.warning(f"Vector search failed: {e}. Proceeding with general LLM Python knowledge.")

    # STEP 3: Stream response from Groq LLM
    async for token in generate_rag_response_stream_async(query, context_chunks, chat_history):
        yield token


async def generate_rag_response_stream_async(query: str, context_chunks: list[str], chat_history: list[dict] = None) -> AsyncGenerator[str, None]:
    """Async wrapper for Groq streaming generator."""
    from app.rag.llm.groq_client import generate_rag_response_stream
    import asyncio

    # Run synchronous Groq generator in async context
    generator = generate_rag_response_stream(query, context_chunks, chat_history)
    for token in generator:
        yield token
        await asyncio.sleep(0.01)  # allow event loop yields
