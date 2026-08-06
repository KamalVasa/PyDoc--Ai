from fastapi import APIRouter
from app.api.auth.routes import router as auth_router
from app.api.document.routes import router as document_router
from app.api.chat.routes import router as chat_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(document_router)
api_router.include_router(chat_router)

__all__ = ["api_router"]
