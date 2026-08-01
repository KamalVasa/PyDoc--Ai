from pydantic import BaseModel, field_validator


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None

    @field_validator("message")
    @classmethod
    def message_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Message cannot be empty")
        if len(v) > 4000:
            raise ValueError("Message too long (max 4000 characters)")
        return v


class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    session_id: str
    is_python_related: bool
    sources: list[str] | None
    created_at: str

    model_config = {"from_attributes": True}


class ChatHistoryResponse(BaseModel):
    messages: list[ChatMessageResponse]
    total: int


class DeleteHistoryResponse(BaseModel):
    message: str
    deleted_count: int
