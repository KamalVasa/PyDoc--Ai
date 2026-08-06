import groq
from app.config.settings import settings
from typing import AsyncGenerator
import logging

logger = logging.getLogger(__name__)


def get_groq_client() -> groq.Groq:
    """Initialize Groq API client instance."""
    if not settings.GROQ_API_KEY:
        logger.warning("GROQ_API_KEY is not set in environment variables.")
    return groq.Groq(api_key=settings.GROQ_API_KEY)


SYSTEM_PROMPT = """You are an expert Documentation Assistant.

Your task is to provide highly contextual, deep technical answers using the provided context.

CRITICAL RULES:
1. CONTEXT PRIORITY (FLEXIBLE TOPICS): If the user's question can be answered using the uploaded context, you MUST answer it, even if the context is about a non-Python topic (e.g., Java, Real Estate, Medical).
2. EXCLUSIVE PYTHON FOCUS (OUTSIDE CONTEXT): If the user asks a general question that is NOT in the context, you must only answer it if it is related to Python. If it is a non-Python question and not covered by the context, politely decline.
3. DIRECT PROBLEM SOLVING: Do NOT provide generic overviews or bulleted summaries unless explicitly asked for a broad overview. Instead, directly address the user's specific scenario, bug, or question.
4. FORMATTING: Use clean markdown. NEVER output equal signs (`=======`), long dashes (`-------`), or text underline artifacts.
"""

NO_CONTEXT_SYSTEM_PROMPT = """You are an expert Python Documentation Assistant.

Your task is to provide highly contextual, deep technical answers to Python programming questions using your general Python knowledge.

CRITICAL RULES:
1. EXCLUSIVE PYTHON FOCUS: Only answer questions related to Python programming (syntax, features, libraries, debugging, architecture, etc.). If the user asks about non-Python topics (like pure Java, JavaScript, cooking, or sports), politely decline and state you only assist with Python. However, questions comparing Python to other languages (e.g., "is Python slower than Java") ARE valid.
2. DIRECT PROBLEM SOLVING: Do NOT provide generic overviews or bulleted summaries unless explicitly asked for a broad overview. Instead, directly address the user's specific scenario, bug, or question. If the user asks why a list comprehension fails, explain the exact failure mechanism and provide the fix.
3. CODE QUALITY: Provide working, robust Python code snippets when relevant. Never generate code in SQL, Java, JS, etc. unless it is part of a direct comparison with Python.
4. FORMATTING: Use clean markdown. NEVER output equal signs (`=======`), long dashes (`-------`), or text underline artifacts.
"""


def generate_rag_response_stream(
    query: str,
    context_chunks: list[str],
    chat_history: list[dict] = None,
) -> AsyncGenerator[str, None]:
    """Stream response tokens from Groq API based on query and retrieved context."""
    client = get_groq_client()

    if context_chunks:
        context_str = "\n\n---\n\n".join(context_chunks)
        user_content = f"Context from uploaded documentation:\n{context_str}\n\nUser Question:\n{query}"
        system_prompt = SYSTEM_PROMPT
    else:
        user_content = f"User Question:\n{query}"
        system_prompt = NO_CONTEXT_SYSTEM_PROMPT

    try:
        messages = [{"role": "system", "content": system_prompt}]
        if chat_history:
            messages.extend(chat_history)
        messages.append({"role": "user", "content": user_content})

        completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=0.2,
            max_tokens=2048,
            stream=True,
        )

        for chunk in completion:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    except Exception as e:
        logger.error(f"Error streaming response from Groq API: {e}")
        yield f"\n\n[Error communicating with LLM service: {str(e)}]"
