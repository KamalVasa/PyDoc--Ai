import uuid
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models.chat_history import ChatHistory
from app.models.user import User
from app.schemas.chat import ChatMessageResponse
import logging

logger = logging.getLogger(__name__)


async def save_chat_message(
    db: AsyncSession,
    user_id: uuid.UUID,
    session_id: str,
    role: str,
    content: str,
    is_python_related: bool = True,
    sources: list[str] | None = None,
) -> ChatHistory:
    """Save a chat message (user query or assistant response) to PostgreSQL."""
    sources_json = json.dumps(sources) if sources else None

    chat_entry = ChatHistory(
        id=uuid.uuid4(),
        user_id=user_id,
        session_id=session_id,
        role=role,
        content=content,
        is_python_related=is_python_related,
        sources=sources_json,
    )
    db.add(chat_entry)
    await db.commit()
    await db.refresh(chat_entry)
    return chat_entry


async def get_user_chat_history(
    user: User,
    db: AsyncSession,
    session_id: str | None = None,
    limit: int = 50,
) -> list[ChatMessageResponse]:
    """Retrieve chat history for a user, optionally filtered by session_id."""
    query = select(ChatHistory).where(ChatHistory.user_id == user.id)
    if session_id:
        query = query.where(ChatHistory.session_id == session_id)

    query = query.order_by(ChatHistory.created_at.asc()).limit(limit)

    result = await db.execute(query)
    messages = result.scalars().all()

    return [_to_chat_response(msg) for msg in messages]


async def delete_user_chat_history(
    user: User,
    db: AsyncSession,
    session_id: str | None = None,
) -> int:
    """Delete chat history for a user, optionally for a specific session."""
    query = delete(ChatHistory).where(ChatHistory.user_id == user.id)
    if session_id:
        query = query.where(ChatHistory.session_id == session_id)

    result = await db.execute(query)
    await db.commit()
    return result.rowcount


def _to_chat_response(msg: ChatHistory) -> ChatMessageResponse:
    sources_list = json.loads(msg.sources) if msg.sources else None
    return ChatMessageResponse(
        id=str(msg.id),
        role=msg.role,
        content=msg.content,
        session_id=msg.session_id,
        is_python_related=msg.is_python_related,
        sources=sources_list,
        created_at=msg.created_at.isoformat(),
    )
