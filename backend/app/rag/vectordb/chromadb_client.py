from app.config.settings import settings
import logging
import os

logger = logging.getLogger(__name__)

_chroma_client = None


def get_chroma_client():
    """Initialize ChromaDB client (HTTP or PersistentLocal)."""
    global _chroma_client
    if _chroma_client is None:
        import chromadb
        try:
            # Try connecting to HTTP ChromaDB server (e.g. docker container)
            _chroma_client = chromadb.HttpClient(
                host=settings.CHROMA_HOST,
                port=settings.CHROMA_PORT,
            )
            _chroma_client.heartbeat()
            logger.info(f"Connected to ChromaDB HTTP server at {settings.CHROMA_HOST}:{settings.CHROMA_PORT}")
        except Exception as e:
            logger.warning(f"Could not connect to ChromaDB HTTP server: {e}. Falling back to PersistentClient.")
            chroma_dir = os.path.join(settings.UPLOAD_DIR, "chroma_db")
            os.makedirs(chroma_dir, exist_ok=True)
            _chroma_client = chromadb.PersistentClient(path=chroma_dir)
            logger.info(f"Initialized ChromaDB PersistentClient at {chroma_dir}")
    return _chroma_client


def get_or_create_collection():
    """Get or create the target ChromaDB collection."""
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=settings.CHROMA_COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def add_document_chunks(
    chunks: list[str],
    ids: list[str],
    metadatas: list[dict],
):
    """Embed chunks and insert into ChromaDB collection."""
    if not chunks:
        return

    from app.rag.embeddings.embedder import generate_embeddings

    collection = get_or_create_collection()
    embeddings = generate_embeddings(chunks)

    # Add in batches of 100 to avoid request size limits
    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        end_idx = i + batch_size
        collection.add(
            documents=chunks[i:end_idx],
            embeddings=embeddings[i:end_idx],
            metadatas=metadatas[i:end_idx],
            ids=ids[i:end_idx],
        )
    logger.info(f"Successfully added {len(chunks)} chunks to ChromaDB collection.")


def similarity_search(
    query: str,
    user_id: str,
    top_k: int = settings.TOP_K_RESULTS,
) -> list[dict]:
    """Perform similarity search for query filtered by user_id."""
    from app.rag.embeddings.embedder import generate_single_embedding

    collection = get_or_create_collection()
    query_embedding = generate_single_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={"user_id": user_id},
    )

    retrieved = []
    if results and "documents" in results and results["documents"]:
        docs = results["documents"][0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        DISTANCE_THRESHOLD = 1.2
        for doc_text, meta, dist in zip(docs, metadatas, distances):
            if dist <= DISTANCE_THRESHOLD:
                retrieved.append({
                    "content": doc_text,
                    "metadata": meta,
                    "distance": dist,
                })
            else:
                logger.info(f"Filtered out document chunk due to low relevance (distance: {dist:.3f})")

    return retrieved


def delete_document_vectors(document_id: str, user_id: str):
    """Remove vectors belonging to a specific document_id and user_id."""
    collection = get_or_create_collection()
    collection.delete(where={"document_id": document_id, "user_id": user_id})
    logger.info(f"Deleted ChromaDB vectors for document_id={document_id}")
