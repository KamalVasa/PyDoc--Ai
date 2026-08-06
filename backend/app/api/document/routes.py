from fastapi import APIRouter, Depends, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.document import DocumentResponse, DocumentListResponse, DeleteDocumentResponse
from app.services.document_service import upload_document, get_user_documents, delete_document

router = APIRouter(prefix="", tags=["Documents"])


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
@router.post("/upload-pdf", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a Python documentation PDF file (max 25MB). Extract, chunk, and embed."""
    return await upload_document(file=file, user=current_user, db=db)


@router.get("/documents", response_model=DocumentListResponse)
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all documentation PDFs uploaded by the authenticated user."""
    docs = await get_user_documents(user=current_user, db=db)
    return DocumentListResponse(documents=docs, total=len(docs))


@router.delete("/documents/{id}", response_model=DeleteDocumentResponse)
async def remove_document(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete an uploaded PDF and purge its vector embeddings from ChromaDB."""
    await delete_document(document_id=id, user=current_user, db=db)
    return DeleteDocumentResponse(message="Document deleted successfully", document_id=id)
