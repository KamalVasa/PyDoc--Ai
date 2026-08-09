import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { Settings as SettingsIcon, Sun, Moon, Trash2, ShieldAlert, Database, Cpu, HelpCircle, Check, Info } from 'lucide-react';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to permanently delete all your conversation history? This action is irreversible.')) return;
    
    setClearing(true);
    setCleared(false);
    try {
      await api.delete('/history');
      setCleared(true);
      localStorage.removeItem('chat_session_id');
      setTimeout(() => setCleared(false), 3000);
    } catch (err) {
      console.error('Failed to clear chat history:', err);
      alert('Error clearing chat history');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="pb-6 border-b border-slate-200/85 dark:border-slate-800">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-8 h-8 text-sky-500" />
            System Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure preferences, manage data deletion, and view system status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left panel - Config Categories */}
          <div className="md:col-span-1 space-y-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-200/60 dark:border-slate-855 text-xs text-slate-400 dark:text-slate-500 space-y-4 uppercase tracking-wider font-bold">
              <span>Configuration Menu</span>
              <div className="flex flex-col gap-2 mt-2 font-sans font-medium text-sm text-slate-700 dark:text-slate-350 normal-case tracking-normal">
                <span className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold cursor-pointer">
                  General Preferences
                </span>
                <span className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer">
                  Data Management
                </span>
                <span className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer">
                  System Diagnostics
                </span>
              </div>
            </div>
          </div>

          {/* Right panel - Config Content */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Preferences */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">General Preferences</h3>
              
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Color Theme</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Toggle dark and light application interfaces.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Switch to Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-slate-500" />
                      <span>Switch to Dark</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Strict Python Guard</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Restricts AI to answer Python questions only.</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Enforced
                </span>
              </div>
            </div>

            {/* Data Management */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Data & Storage Management
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div className="max-w-md">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Wipe Chat Conversations</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Clear all chat history records and message logs saved to your developer account database.
                  </p>
                </div>
                <button
                  onClick={handleClearHistory}
                  disabled={clearing}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors self-start sm:self-auto disabled:opacity-50"
                >
                  {cleared ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Cleared History!</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>{clearing ? 'Clearing...' : 'Clear All History'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Diagnostics */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-sky-500" />
                System Diagnostics
              </h3>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Embedding model architecture</span>
                  <span className="font-mono text-slate-850 dark:text-slate-200 font-semibold">sentence-transformers/all-MiniLM-L6-v2 (384 Dimensions)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Inference LLM service</span>
                  <span className="font-mono text-slate-850 dark:text-slate-200 font-semibold">Groq API (llama-3.3-70b-versatile)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Vector database store</span>
                  <span className="font-mono text-slate-850 dark:text-slate-200 font-semibold">ChromaDB HTTP/Local client</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Database Connection</span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Database className="w-3.5 h-3.5" />
                    SQL Database (Postgres with SQLite backup)
                  </span>
                </div>
              </div>
              
              {/* SQLite fallback info box */}
              <div className="p-3.5 rounded-2xl bg-sky-500/5 border border-sky-500/10 text-xs text-sky-700 dark:text-sky-300 flex gap-2.5 items-start">
                <Info className="w-4 h-4 shrink-0 text-sky-500 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Zero-Config Note:</strong> If local PostgreSQL server is password protected, the application safely runs in SQLite fallback database mode automatically to ensure immediate local testing.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
