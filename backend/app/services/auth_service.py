from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
import logging

logger = logging.getLogger(__name__)


async def register_user(db: AsyncSession, data: RegisterRequest) -> UserResponse:
    """Register a new user after validating uniqueness."""
    # Check email uniqueness
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Check username uniqueness
    result = await db.execute(select(User).where(User.username == data.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already taken",
        )

    user = User(
        email=data.email,
        username=data.username,
        full_name=data.full_name,
        hashed_password=hash_password(data.password),
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    logger.info(f"New user registered: {user.email}")
    return _to_user_response(user)


async def login_user(db: AsyncSession, data: LoginRequest) -> TokenResponse:
    """Authenticate user and return access + refresh tokens."""
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    logger.info(f"User logged in: {user.email}")
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


async def refresh_access_token(db: AsyncSession, refresh_token: str) -> TokenResponse:
    """Issue new access token using a valid refresh token."""
    from app.core.security import decode_token
    import jwt

    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        user_id = payload.get("sub")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    new_access_token = create_access_token({"sub": str(user.id)})
    new_refresh_token = create_refresh_token({"sub": str(user.id)})
    return TokenResponse(access_token=new_access_token, refresh_token=new_refresh_token)


def _to_user_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        is_active=user.is_active,
        created_at=user.created_at.isoformat(),
    )
