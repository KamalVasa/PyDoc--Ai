import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Calendar, FileText, MessageSquare, ShieldCheck, Database, Award } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ documentsCount: 0, messagesCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [docsRes, historyRes] = await Promise.all([
          api.get('/documents'),
          api.get('/history')
        ]);
        setStats({
          documentsCount: docsRes.data.total || 0,
          messagesCount: historyRes.data.total || 0,
        });
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="pb-6 border-b border-slate-200/85 dark:border-slate-800">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Developer Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your account info and view system statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Left - Main Avatar & Profile Info */}
          <div className="md:col-span-1 glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl -z-10" />
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-sky-500/20 mb-4 hover:scale-[1.03] transition-transform">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.full_name}</h2>
            <p className="text-xs text-sky-500 font-semibold font-mono tracking-wider uppercase mt-1">
              @{user?.username}
            </p>

            <div className="w-full border-t border-slate-200/60 dark:border-slate-800/80 my-5" />

            <div className="w-full space-y-4 text-left text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4.5 h-4.5 text-slate-400" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4.5 h-4.5 text-slate-400" />
                <span>Joined {formattedDate || 'Recently'}</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  Verified Developer
                </span>
              </div>
            </div>
          </div>

          {/* Card Right - Statistics & Badges */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <FileText className="w-4.5 h-4.5 text-sky-500" />
                  <span>Uploaded Docs</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {loading ? '...' : stats.documentsCount}
                </div>
                <p className="text-xs text-slate-500 mt-1">Python PDF documents indexed</p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <MessageSquare className="w-4.5 h-4.5 text-indigo-500" />
                  <span>Saved Queries</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {loading ? '...' : stats.messagesCount}
                </div>
                <p className="text-xs text-slate-500 mt-1">Total chat history records</p>
              </div>
            </div>

            {/* Badges card */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Access Privileges
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">RAG PDF Uploads</span>
                  <p className="text-slate-500 dark:text-slate-400">Unlocked. Maximum file limit is 25MB per document.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">FastAPI + Groq Stream</span>
                  <p className="text-slate-500 dark:text-slate-400">Unlocked. Running with LLM model {import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile'}.</p>
                </div>
              </div>
            </div>
            
            {/* System Info card */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-850 dark:text-white">ChromaDB Vector Store</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Isolated vector indexes created per account ID.</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Connected
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
