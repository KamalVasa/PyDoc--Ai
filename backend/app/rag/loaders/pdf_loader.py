import re
import logging

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_path: str) -> str:
    """Extract and clean raw text from a PDF file using PyMuPDF."""
    text_content = []

    try:
        import fitz  # PyMuPDF lazy loaded here
        doc = fitz.open(file_path)
        for page_num in range(len(doc)):
            page = doc[page_num]
            page_text = page.get_text("text")
            if page_text:
                text_content.append(page_text)
        doc.close()
    except Exception as e:
        logger.error(f"PyMuPDF extraction failed for {file_path}: {e}")
        # Fallback to pypdf if fitz encounters issues
        try:
            import pypdf

            reader = pypdf.PdfReader(file_path)
            for page in reader.pages:
                t = page.extract_text()
                if t:
                    text_content.append(t)
        except Exception as fallback_err:
            logger.error(f"pypdf fallback extraction failed for {file_path}: {fallback_err}")
            raise ValueError(f"Could not extract text from PDF: {str(e)}")

    full_text = "\n\n".join(text_content)
    cleaned_text = clean_pdf_text(full_text)
    return cleaned_text


def clean_pdf_text(text: str) -> str:
    """Clean extracted raw text: remove noise, normalize whitespaces, fix linebreaks."""
    if not text:
        return ""

    # Replace multiple null bytes or form feeds
    text = text.replace("\x00", "").replace("\f", "\n")

    # Replace consecutive blank lines with maximum two newlines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Normalize horizontal whitespaces (keep newlines)
    text = re.sub(r"[ \t]+", " ", text)

    # Strip trailing and leading whitespace
    return text.strip()
