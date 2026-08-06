from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    RefreshTokenRequest,
    TokenResponse,
    UserResponse,
    MessageResponse,
)
from app.services.auth_service import register_user, login_user, refresh_access_token
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    return await register_user(db, data)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate user and obtain JWT tokens."""
    return await login_user(db, data)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """Obtain new access token using valid refresh token."""
    return await refresh_access_token(db, data.refresh_token)


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: User = Depends(get_current_user)):
    """Client-side token invalidation confirmation."""
    return MessageResponse(message="Successfully logged out")


@router.get("/profile", response_model=UserResponse)
async def profile(current_user: User = Depends(get_current_user)):
    """Retrieve profile information for currently authenticated user."""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat(),
    )
