from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)


class RecursiveCharacterTextSplitter:
    """Pure-Python implementation of a recursive character text splitter.
    
    This matches the behavior of LangChain's RecursiveCharacterTextSplitter
    without requiring the heavy langchain dependencies.
    """
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200, separators: list[str] = None):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = separators or ["\n\n", "\n", " ", ""]

    def split_text(self, text: str) -> list[str]:
        return self._split_text(text, self.separators)

    def _split_text(self, text: str, separators: list[str]) -> list[str]:
        final_chunks = []
        if not separators:
            # If no separators left, split by character chunk_size
            chunks = []
            for i in range(0, len(text), self.chunk_size - self.chunk_overlap):
                chunks.append(text[i:i + self.chunk_size])
            return chunks

        # Get appropriate separator
        separator = separators[-1]
        new_separators = []
        for i, s in enumerate(separators):
            if s == "":
                separator = s
                break
            if s in text:
                separator = s
                new_separators = separators[i + 1:]
                break

        # Split the text
        if separator != "":
            splits = text.split(separator)
        else:
            splits = list(text)

        # Merge splits into chunks
        good_splits = []
        separator_len = len(separator)
        for s in splits:
            if s == "":
                continue
            good_splits.append(s)

        # Re-merge splits into chunks that fit chunk_size
        current_doc = []
        total_len = 0
        for s in good_splits:
            s_len = len(s)
            # If a single split is larger than chunk_size, split it recursively
            if s_len > self.chunk_size:
                if current_doc:
                    final_chunks.append(separator.join(current_doc))
                    current_doc = []
                    total_len = 0
                recursed = self._split_text(s, new_separators)
                final_chunks.extend(recursed)
                continue

            if total_len + s_len + (separator_len if current_doc else 0) <= self.chunk_size:
                current_doc.append(s)
                total_len += s_len + (separator_len if current_doc else 0)
            else:
                if current_doc:
                    final_chunks.append(separator.join(current_doc))
                
                # Keep overlap
                overlap_doc = []
                overlap_len = 0
                for d in reversed(current_doc):
                    d_len = len(d)
                    if overlap_len + d_len + (separator_len if overlap_doc else 0) <= self.chunk_overlap:
                        overlap_doc.insert(0, d)
                        overlap_len += d_len + (separator_len if overlap_doc else 0)
                    else:
                        break
                current_doc = overlap_doc + [s]
                total_len = sum(len(d) for d in current_doc) + separator_len * (len(current_doc) - 1)

        if current_doc:
            final_chunks.append(separator.join(current_doc))

        return final_chunks


def split_text_into_chunks(
    text: str,
    chunk_size: int = settings.CHUNK_SIZE,
    chunk_overlap: int = settings.CHUNK_OVERLAP,
) -> list[str]:
    """Split clean text into semantic chunks using custom RecursiveCharacterTextSplitter."""
    if not text or not text.strip():
        return []

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", "def ", "class ", " ", ""],
    )

    chunks = text_splitter.split_text(text)
    logger.info(f"Split document into {len(chunks)} chunks (size: {chunk_size}, overlap: {chunk_overlap})")
    return chunks
