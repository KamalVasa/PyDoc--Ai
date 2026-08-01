import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime, func, Text, Boolean, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.connection import Base


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    session_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(20), nullable=False)  # user | assistant
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_python_related: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sources: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON string of source chunks
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="chat_histories")

    def __repr__(self) -> str:
        return f"<ChatHistory id={self.id} role={self.role} session={self.session_id}>"
