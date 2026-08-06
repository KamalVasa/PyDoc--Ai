import uuid
from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatHistoryResponse, DeleteHistoryResponse
from app.services.chat_service import save_chat_message, get_user_chat_history, delete_user_chat_history
from app.rag.pipeline.rag_pipeline import run_rag_pipeline
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["Chat"])


@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Chat endpoint supporting SSE token streaming."""
    session_id = request.session_id or str(uuid.uuid4())
    user_query = request.message

    # Fetch existing chat history for context
    db_history = await get_user_chat_history(user=current_user, db=db, session_id=session_id)
    chat_history = [{"role": msg.role, "content": msg.content} for msg in db_history]
    # Limit to last 10 messages to avoid context limits
    chat_history = chat_history[-10:]

    # Save user query to DB
    await save_chat_message(
        db=db,
        user_id=current_user.id,
        session_id=session_id,
        role="user",
        content=user_query,
        is_python_related=True,
    )

    async def event_generator():
        accumulated_response = []
        try:
            async for token in run_rag_pipeline(query=user_query, user_id=str(current_user.id), chat_history=chat_history):
                accumulated_response.append(token)
                import json
                yield f"data: {json.dumps(token)}\n\n"

            # Save assistant response to DB upon stream completion
            full_response = "".join(accumulated_response)
            await save_chat_message(
                db=db,
                user_id=current_user.id,
                session_id=session_id,
                role="assistant",
                content=full_response,
                is_python_related=True,
            )
            yield "data: [DONE]\n\n"

        except Exception as e:
            logger.error(f"Error in chat stream: {e}")
            yield f"data: [ERROR: {str(e)}]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Session-ID": session_id,
        },
    )


@router.get("/history", response_model=ChatHistoryResponse)
async def get_history(
    session_id: str | None = Query(None, description="Filter history by session ID"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve chat history for the authenticated user."""
    history = await get_user_chat_history(user=current_user, db=db, session_id=session_id)
    return ChatHistoryResponse(messages=history, total=len(history))


@router.delete("/history", response_model=DeleteHistoryResponse)
async def clear_history(
    session_id: str | None = Query(None, description="Specific session ID to clear"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Clear chat history for the user."""
    count = await delete_user_chat_history(user=current_user, db=db, session_id=session_id)
    return DeleteHistoryResponse(message="Chat history deleted successfully", deleted_count=count)
