import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Plus, Zap } from 'lucide-react';

export const ChatInput = ({ onSend, loading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSend(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto w-full px-4 mb-6">
      <form onSubmit={handleSubmit}>
        {/* ChatGPT Style Dark Floating Pill Search Container */}
        <div className="relative rounded-3xl border border-slate-300/80 dark:border-slate-800 shadow-2xl focus-within:border-sky-500/80 transition-all p-2 bg-white/95 dark:bg-[#212121] flex items-center gap-2">
          
          {/* Left Attachment / Plus Button */}
          <button
            type="button"
            onClick={() => window.location.href = '/upload'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-[#2f2f2f] hover:bg-slate-200 dark:hover:bg-[#383838] transition-colors shrink-0"
            title="Upload Documentation"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Textarea Input */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about Python..."
            className="w-full bg-transparent border-0 focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 text-sm md:text-base resize-none px-2 py-1.5 max-h-44 scrollbar-thin outline-none"
            disabled={loading}
          />

          {/* Right Circular Send Action Pill */}
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all shrink-0 active:scale-95 ${
              text.trim() && !loading
                ? 'bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/30'
                : 'bg-slate-300 dark:bg-[#383838] text-slate-500 dark:text-slate-500 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </form>

    </div>
  );
};
