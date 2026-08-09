import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Terminal } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 via-sky-500/5 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl relative z-10 text-center">
        
        {/* Animated Error Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-lg shadow-red-500/10 animate-pulse">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            HTTPError: Page Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed max-w-xs mx-auto">
            The route you are looking for does not exist in our system dictionary.
          </p>
        </div>

        {/* Console Box */}
        <div className="p-4 rounded-xl bg-slate-950 text-left border border-slate-800 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-900 text-slate-550">
            <Terminal className="w-3.5 h-3.5 text-sky-500" />
            <span>Python Traceback Console</span>
          </div>
          <pre className="mt-2 text-red-400 overflow-x-auto leading-relaxed">
            <code>{`>>> import urllib.error
>>> raise urllib.error.HTTPError(
...     url="http://localhost:3000/invalid",
...     code=404,
...     msg="Not Found",
...     hdrs=None,
...     fp=None
... )
HTTPError: HTTP Error 404: Not Found`}</code>
          </pre>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-sky-500/20 hover:scale-[1.01] active:scale-98"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Application</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
