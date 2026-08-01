from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.connection import get_db
from app.models.user import User


async def get_current_user(
    db: AsyncSession = Depends(get_db),
) -> User:
    """Retrieve default user to bypass auth entirely."""
    result = await db.execute(select(User).where(User.username == "default_user"))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(
            email="default@example.com",
            username="default_user",
            hashed_password="dummy_password",
            full_name="Default User",
            is_active=True,
            is_verified=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user



