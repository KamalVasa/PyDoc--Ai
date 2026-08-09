import re
import logging

logger = logging.getLogger(__name__)

REJECTION_MESSAGE = "I'm a Python Documentation Assistant. I can answer only Python-related questions."

# Explicitly forbidden non-Python topics and languages
FORBIDDEN_TOPICS = {
    # Non-Python programming languages & tech
    "sql", "mysql", "postgresql", "postgres", "oracle", "mongodb", "redis", "cassandra",
    "java", "javascript", "js", "typescript", "ts", "react", "angular", "vue", "svelte", "nextjs",
    "html", "css", "tailwind", "nodejs", "express", "php", "ruby", "rust", "golang", "cpp", "c++", "csharp", "c#",
    # Non-programming general topics
    "politics", "politician", "election", "president", "minister", "government", "party",
    "sports", "football", "cricket", "basketball", "tennis", "soccer", "baseball", "hockey",
    "movies", "cinema", "bollywood", "hollywood", "actor", "actress", "film",
    "entertainment", "music", "singer", "song", "album",
    "recipe", "cooking", "food", "restaurant",
    "weather", "forecast", "temperature",
    "medical", "doctor", "medicine", "disease", "symptom",
    "legal", "law", "lawyer", "court", "judge",
    "finance", "stock", "trading", "mutual fund", "tax",
    "history", "geography", "continent", "country", "capital",
    "blockchain", "crypto", "bitcoin", "ethereum", "nft",
}

# Python-specific indicators
PYTHON_INDICATORS = {
    "python", "py", "pip", "venv", "virtualenv", "conda", "pytest", "unittest",
    "fastapi", "flask", "django", "numpy", "pandas", "matplotlib", "seaborn",
    "scikit-learn", "sklearn", "scipy", "asyncio", "multiprocessing", "threading",
    "pydantic", "sqlalchemy", "alembic", "celery", "poetry", "jinja", "sqlite3", "psycopg2",
    "list", "dict", "dictionary", "tuple", "set", "string", "int", "float", "bool",
    "lambda", "decorator", "generator", "iterator", "comprehension", "dunder",
    "self", "cls", "__init__", "__str__", "__repr__", "class", "def", "import",
    "try", "except", "finally", "raise", "with", "yield", "async", "await",
    "global", "nonlocal", "type hint", "dataclass", "argparse",
    "json", "csv", "os", "sys", "math", "datetime", "random", "re", "collections",
    "itertools", "functools", "pathlib", "subprocess", "typing", "enum",
    "pep8", "pythonic", "traceback", "syntaxerror", "typeerror", "valueerror",
    "keyerror", "indexerror", "attributeerror", "indentationerror", "nameerror",
    "docstring", "args", "kwargs", "slice", "print", "range", "enumerate",
    "zip", "map", "filter", "any", "all", "sorted", "super",
    "list comprehension", "dictionary comprehension", "f-string",
    "beautifulsoup", "selenium", "requests", "tkinter", "pygame", "pillow",
}


def is_python_topic(query: str) -> bool:
    """Check if query is related to Python programming.

    Returns True for Python questions; False for SQL, Java, JS, or non-Python questions.
    """
    if not query or not query.strip():
        return False

    q_clean = query.lower().strip()
    words = set(re.findall(r"\b[a-zA-Z0-9_+#\-.]+\b", q_clean))

    # Exception: Python database libraries mentioned with SQL/Postgres terms
    has_python_db_lib = any(lib in q_clean for lib in ["sqlite3", "sqlalchemy", "psycopg", "pyodbc", "tortoise", "peewee"])

    # If query mentions a forbidden topic (like SQL, Java, JS, etc.) AND is NOT a Python DB lib question, REJECT IT
    for forbidden in FORBIDDEN_TOPICS:
        if forbidden in words or (len(forbidden) > 3 and forbidden in q_clean):
            if has_python_db_lib or "python" in q_clean:
                continue
            logger.info(f"Query rejected by Topic Guard (Forbidden: '{forbidden}'): '{query}'")
            return False

    # Check if explicitly Python
    if "python" in q_clean or any(indicator in words for indicator in PYTHON_INDICATORS):
        return True

    # Check for general Python coding terms if no forbidden topics present
    coding_terms = ["def ", "class ", "import ", "print(", "len(", "lambda ", "decorator", "yield ", "async def"]
    if any(term in q_clean for term in coding_terms):
        return True

    # If general question asking about Python programming without forbidden keywords, allow
    if any(q_word in q_clean for q_word in ["what is", "how to", "explain", "example", "code", "difference", "function", "variable", "error"]):
        return True

    logger.info(f"Query rejected by Topic Guard (No Python context): '{query}'")
    return False
