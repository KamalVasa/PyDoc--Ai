from pydantic import BaseModel
from datetime import datetime


class DocumentResponse(BaseModel):
    id: str
    filename: str
    original_filename: str
    file_size: int
    chunk_count: int
    status: str
    description: str | None
    created_at: str

    model_config = {"from_attributes": True}


class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]
    total: int


class DeleteDocumentResponse(BaseModel):
    message: str
    document_id: str
