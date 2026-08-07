import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 my-4 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
        <Bot className="w-5 h-5" />
      </div>
      <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-800">
        <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce"></span>
        <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]"></span>
      </div>
    </div>
  );
};
