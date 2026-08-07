import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Trash2, Bot, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = ({ onClearChat, documentsCount = 0 }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isUploadPage = location.pathname === '/upload';

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                PyDoc <span className="text-sky-500 font-extrabold">RAG</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
                Python Docs Only
              </span>
            </div>
          </Link>

          {/* Center Navigation Item: Conditional Go Back button vs Assistant Title */}
          {isUploadPage ? (
            <Link
              to="/chat"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold text-xs md:text-sm border border-sky-500/30 transition-all hover:scale-[1.02] shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-sky-500" />
              <span>Go Back to Chat</span>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-3 bg-slate-100/70 dark:bg-slate-800/50 px-3.5 py-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  Python Documentation Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  RAG Active • Groq LLM • {documentsCount} Uploaded PDFs
                </p>
              </div>
            </div>
          )}

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {onClearChat && !isUploadPage && (
              <button
                onClick={onClearChat}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-slate-200/80 dark:border-slate-800"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
