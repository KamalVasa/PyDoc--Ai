import sys
import os
import asyncio
sys.path.append(os.path.abspath('backend'))
from app.rag.pipeline.rag_pipeline import run_rag_pipeline
from app.config.settings import settings

async def main():
    chat_history = [
        {"role": "user", "content": "explain me about constructors"},
        {"role": "assistant", "content": "Constructors in Python are special methods used to initialize objects."}
    ]
    query = "explain it in detail"
    user_id = "test_user_id"

    print("Running RAG pipeline...")
    response_chunks = []
    async for token in run_rag_pipeline(query, user_id, chat_history):
        response_chunks.append(token)
    
    print("\nFINAL RESPONSE:\n", "".join(response_chunks))

asyncio.run(main())
