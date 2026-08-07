import React from 'react';
import { Code2, Github, Shield, Terminal } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-sky-500" />
          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Python Documentation RAG Chatbot
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Strictly Powered by RAG + Groq API + ChromaDB. Answers ONLY from uploaded Python docs.
        </p>
        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Python Guard Active
          </span>
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-sky-500" />
            FastAPI + React
          </span>
        </div>
      </div>
    </footer>
  );
};
