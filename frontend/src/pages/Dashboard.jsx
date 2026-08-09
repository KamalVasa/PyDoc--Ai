import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../hooks/useDocuments';
import { Link } from 'react-router-dom';
import {
  User,
  FileText,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Database,
  Cpu,
  ArrowRight,
  Upload,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { documents } = useDocuments();

  const totalChunks = documents.reduce((acc, doc) => acc + (doc.chunk_count || 0), 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* User Welcome Banner */}
        <div className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -z-10" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-500/20">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-semibold text-sky-500 uppercase tracking-wider">
                Developer Profile
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Welcome back, {user?.full_name || user?.username}!
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.email} • Account Active
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/chat"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-medium text-sm shadow-md shadow-sky-500/20 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Open Chat
            </Link>
            <Link
              to="/upload"
              className="px-5 py-2.5 rounded-xl glass border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload PDF
            </Link>
          </div>
        </div>

        {/* Analytics Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Indexed PDFs
              </span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {documents.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Uploaded PDF documents</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Vector Chunks
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalChunks}
            </div>
            <p className="text-xs text-slate-500 mt-1">ChromaDB embedded chunks</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Embedding Model
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              all-MiniLM-L6-v2
            </div>
            <p className="text-xs text-slate-500 mt-1">384-dimensional vectors</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Topic Guard
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Active & Enforced
            </div>
            <p className="text-xs text-slate-500 mt-1">Python-only queries accepted</p>
          </div>
        </div>

        {/* System Architecture Details */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            System Architecture Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-semibold">Backend API</strong>
              <p className="text-slate-500 dark:text-slate-400">FastAPI + Async SQLAlchemy + JWT Authentication</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-semibold">Vector Storage</strong>
              <p className="text-slate-500 dark:text-slate-400">ChromaDB Vector Database with metadata filtering</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-semibold">LLM Inference</strong>
              <p className="text-slate-500 dark:text-slate-400">Groq API (llama-3.3-70b-versatile) with SSE streaming</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
