import os
import uuid
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models.document import Document
from app.models.user import User
from app.config.settings import settings
from app.schemas.document import DocumentResponse
import logging

logger = logging.getLogger(__name__)


async def upload_document(
    file: UploadFile,
    user: User,
    db: AsyncSession,
) -> DocumentResponse:
    """Process PDF upload, extract text, chunk, embed, and store in ChromaDB and Postgres."""
    # File format validation
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )

    # File size validation
    content = await file.read()
    file_size_mb = len(content) / (1024 * 1024)
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB",
        )

    # Reset file pointer
    await file.seek(0)

    # Save to disk
    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    doc = Document(
        id=uuid.UUID(file_id),
        user_id=user.id,
        filename=safe_filename,
        original_filename=file.filename,
        file_size=len(content),
        file_path=file_path,
        chroma_collection_id=settings.CHROMA_COLLECTION_NAME,
        chunk_count=0,
        status="processing",
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    try:
        # Lazy imports for RAG operations
        from app.rag.loaders.pdf_loader import extract_text_from_pdf
        from app.rag.chunking.text_splitter import split_text_into_chunks
        from app.rag.vectordb.chromadb_client import add_document_chunks

        # Extract text
        extracted_text = extract_text_from_pdf(file_path)
        if not extracted_text.strip():
            raise ValueError("No text could be extracted from the PDF")

        # Chunk text
        chunks = split_text_into_chunks(extracted_text)

        # Store in ChromaDB with metadata
        metadata = {
            "document_id": str(doc.id),
            "user_id": str(user.id),
            "filename": doc.original_filename,
        }

        chunk_ids = [f"{doc.id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [metadata for _ in chunks]

        add_document_chunks(
            chunks=chunks,
            ids=chunk_ids,
            metadatas=metadatas,
        )

        # Update document status
        doc.chunk_count = len(chunks)
        doc.status = "ready"
        await db.commit()
        await db.refresh(doc)

        logger.info(f"Successfully processed PDF: {file.filename} with {len(chunks)} chunks for user {user.id}")

    except Exception as e:
        logger.error(f"Error processing document {file.filename}: {str(e)}")
        doc.status = "failed"
        doc.description = str(e)
        await db.commit()
        # Clean up file on disk if failed
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process PDF document: {str(e)}",
        )

    return _to_doc_response(doc)


async def get_user_documents(user: User, db: AsyncSession) -> list[DocumentResponse]:
    """Retrieve all documents uploaded by the user."""
    result = await db.execute(
        select(Document).where(Document.user_id == user.id).order_by(Document.created_at.desc())
    )
    docs = result.scalars().all()
    return [_to_doc_response(d) for d in docs]


async def delete_document(document_id: str, user: User, db: AsyncSession) -> bool:
    """Delete a document record, local PDF file, and ChromaDB vectors."""
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid document ID format")

    result = await db.execute(
        select(Document).where(Document.id == doc_uuid, Document.user_id == user.id)
    )
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    # Delete from ChromaDB
    try:
        from app.rag.vectordb.chromadb_client import delete_document_vectors
        delete_document_vectors(document_id=str(doc.id), user_id=str(user.id))
    except Exception as e:
        logger.warning(f"Failed to delete ChromaDB vectors for doc {doc.id}: {str(e)}")

    # Delete local file
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    await db.delete(doc)
    await db.commit()

    logger.info(f"Deleted document {document_id} for user {user.id}")
    return True


def _to_doc_response(doc: Document) -> DocumentResponse:
    return DocumentResponse(
        id=str(doc.id),
        filename=doc.filename,
        original_filename=doc.original_filename,
        file_size=doc.file_size,
        chunk_count=doc.chunk_count,
        status=doc.status,
        description=doc.description,
        created_at=doc.created_at.isoformat(),
    )
