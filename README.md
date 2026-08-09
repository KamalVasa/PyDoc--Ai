# Python Documentation RAG Chatbot

An enterprise-grade, production-ready AI-powered RAG (Retrieval-Augmented Generation) Chatbot that answers **ONLY** Python programming related questions using uploaded Python documentation PDFs.

---

## 🎯 Primary Objective & Most Important Rule

- **Strict Python-Only Assistant**: This chatbot is NOT a general AI assistant.
- **Strict Guard Enforcement**: Before processing any query, the **Python Topic Validator** classifies the question.
- **Immediate Rejection**: If a user asks about non-Python topics (React, JavaScript, Java, SQL, Cyber Security, Politics, etc.), retrieval and LLM processing are completely bypassed, returning:
  > `"I'm a Python Documentation Assistant. I can answer only Python-related questions."`

---

## 🏗 Tech Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS + Glassmorphism Theme
- **UI & Icons**: Lucide Icons + Framer Motion
- **HTTP Client**: Axios with JWT Interceptors & Auto Refresh Token Retry
- **Markdown & Code**: React Markdown + React Syntax Highlighter (Prism)

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL with async SQLAlchemy ORM
- **Migrations**: Alembic
- **Auth**: JWT (Access + Refresh tokens) & bcrypt password hashing
- **Vector Database**: ChromaDB
- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **LLM Engine**: Groq API (`llama-3.3-70b-versatile`) with SSE Streaming
- **PDF Extraction & Chunking**: PyMuPDF (fitz) + LangChain `RecursiveCharacterTextSplitter`

---

## 📁 Project Structure

```
py-chatbot/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # /register, /login, /logout, /refresh, /profile
│   │   │   ├── document/      # /upload, /documents, /documents/{id}
│   │   │   └── chat/          # /chat (SSE stream), /history, /history (delete)
│   │   ├── config/            # Pydantic Settings & Env setup
│   │   ├── core/              # JWT Security & Route Dependencies
│   │   ├── database/          # Async SQLAlchemy engine & sessions
│   │   ├── middleware/        # Request logging & SlowAPI rate limiter
│   │   ├── models/            # SQLAlchemy ORM Models (User, Document, ChatHistory)
│   │   ├── rag/               # RAG Pipeline components
│   │   │   ├── chunking/      # Recursive text splitter
│   │   │   ├── embeddings/    # SentenceTransformers embeddings generator
│   │   │   ├── loaders/       # PyMuPDF PDF extractor
│   │   │   ├── llm/           # Groq streaming client
│   │   │   ├── pipeline/      # RAG Pipeline orchestrator
│   │   │   ├── validation/    # Strict Python Topic Guard
│   │   │   └── vectordb/      # ChromaDB client & similarity search
│   │   ├── schemas/           # Pydantic request/response validation schemas
│   │   ├── services/          # Auth, Document, and Chat business logic
│   │   └── utils/             # Logger utilities
│   ├── alembic/               # DB Migration files
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar, ChatMessage, CodeBlock, UploadZone...
│   │   ├── context/           # AuthContext & ThemeContext
│   │   ├── hooks/             # useChat, useDocuments
│   │   ├── pages/             # Landing, Login, Register, Chat, Upload, Dashboard
│   │   ├── router/            # AppRouter & ProtectedRoute
│   │   ├── services/          # Axios API client setup
│   │   └── styles/            # Tailwind globals & glassmorphism CSS
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## ⚡ Getting Started (Local Development)

### 1. Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL database
- Free Groq API Key ([Get API Key](https://console.groq.com))

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

Open `.env` and fill in your `GROQ_API_KEY` and PostgreSQL connection info:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=py_chatbot
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8002
```
Backend will run at: `http://localhost:8002` (Docs available at `http://localhost:8002/docs`).

---

### 3. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend will run at: `http://localhost:5173`.


## 🧪 RAG Pipeline Workflow

```
PDF Document Upload (Max 25MB)
            ↓
PyMuPDF Text Extraction & Cleaning
            ↓
RecursiveCharacterTextSplitter (1000 char chunks, 200 overlap)
            ↓
SentenceTransformers Embedding (all-MiniLM-L6-v2)
            ↓
ChromaDB Vector Indexing (with User ID metadata filter)
            ↓
User Question Input
            ↓
Python Topic Guard Validation
 ├── [FAIL] -> Immediate Rejection Message (NO LLM / Vector Search)
 └── [PASS] -> Similarity Search in ChromaDB
            ↓
Context Chunk Retrieval & Verification
 ├── [EMPTY] -> "I couldn't find this information in the uploaded Python documentation."
 └── [FOUND] -> Build Prompt & Stream Answer via Groq API (llama-3.3-70b-versatile)
```

---

## 🔒 Security Features

1. **JWT Authentication**: Short-lived access tokens (30 mins) with refresh token rotation.
2. **Bcrypt Password Hashing**: Passwords stored safely using bcrypt algorithm.
3. **Per-User Isolation**: Vector searches and uploaded documents are strictly scoped by `user_id`.
4. **Input & Size Limits**: Strict PDF format check and 25MB max file size.
5. **SlowAPI Rate Limiting**: Protects endpoint abuse (60 requests/minute default).

---

## 📄 License

MIT License. Developed for Production Python Applications.
