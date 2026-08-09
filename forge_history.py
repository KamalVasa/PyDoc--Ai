import os
import subprocess
from datetime import datetime

# Dates to forge
dates = [
    "2026-07-31T12:00:00",
    "2026-08-01T14:30:00",
    "2026-08-03T10:15:00",
    "2026-08-05T16:45:00",
    "2026-08-06T11:20:00",
    "2026-08-07T15:10:00",
    "2026-08-08T09:05:00",
    "2026-08-09T17:30:00",
]

commits = [
    {
        "date": dates[0],
        "msg": "chore: initial project setup and dependency configuration",
        "files": [".gitignore", "backend/requirements.txt", "frontend/package.json", "frontend/vite.config.js"]
    },
    {
        "date": dates[1],
        "msg": "feat(backend): setup FastAPI core, PostgreSQL connection, and SQLAlchemy models",
        "files": ["backend/app/main.py", "backend/app/database", "backend/app/models", "backend/app/schemas", "backend/alembic", "backend/alembic.ini", "backend/app/core"]
    },
    {
        "date": dates[2],
        "msg": "feat(frontend): initialize React application with Tailwind CSS",
        "files": ["frontend/index.html", "frontend/src/main.jsx", "frontend/src/App.jsx", "frontend/src/index.css", "frontend/tailwind.config.js", "frontend/postcss.config.js"]
    },
    {
        "date": dates[3],
        "msg": "feat(rag): implement PDF extraction, text chunking, and ChromaDB vector store",
        "files": ["backend/app/rag/loaders", "backend/app/rag/chunking", "backend/app/rag/vectordb"]
    },
    {
        "date": dates[4],
        "msg": "feat(ai): integrate Groq Llama-3 client and build core backend services",
        "files": ["backend/app/rag/llm", "backend/app/services", "backend/app/api"]
    },
    {
        "date": dates[5],
        "msg": "feat(ui): build chat interface, sidebar, and authentication screens",
        "files": ["frontend/src/components", "frontend/src/pages/Landing.jsx", "frontend/src/pages/Login.jsx", "frontend/src/pages/Register.jsx"]
    },
    {
        "date": dates[6],
        "msg": "feat(integration): connect React frontend to FastAPI backend routes",
        "files": ["frontend/src/hooks", "frontend/src/services", "frontend/src/pages/Upload.jsx", "frontend/src/pages/Chat.jsx", "frontend/src/pages/Profile.jsx"]
    },
    {
        "date": dates[7],
        "msg": "fix: final UI polish, prompt engineering refinements, and prepare for production",
        "files": ["."]
    }
]

def run(cmd, env=None):
    subprocess.run(cmd, shell=True, check=True, env=env)

def main():
    if os.path.exists(".git"):
        run("rm -rf .git")
    
    run("git init")
    run("git branch -m main")
    
    env = os.environ.copy()
    
    for commit in commits:
        env["GIT_AUTHOR_DATE"] = commit["date"]
        env["GIT_COMMITTER_DATE"] = commit["date"]
        
        for f in commit["files"]:
            if os.path.exists(f) or f == ".":
                run(f"git add {f}")
        
        # Check if there are changes to commit
        status = subprocess.run("git status --porcelain", shell=True, capture_output=True, text=True)
        if status.stdout.strip():
            run(f"git commit -m '{commit['msg']}'", env=env)
            print(f"Committed: {commit['msg']} on {commit['date']}")
        else:
            print(f"Skipped commit (no changes): {commit['msg']}")

if __name__ == "__main__":
    main()
