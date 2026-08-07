import React, { useState } from 'react';
import { User, Bot, Clock, Copy, Check, RefreshCw } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export const ChatMessage = ({ message, isLast = false, onRegenerate = null }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const formattedTime = message.created_at
    ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <div className={`flex items-start gap-3 my-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md ${
          isUser
            ? 'bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-600'
            : 'bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-sky-500/20'
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message Content Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm border ${
          isUser
            ? 'bg-sky-600 text-white rounded-tr-sm border-sky-500'
            : 'glass-card text-slate-800 dark:text-slate-100 rounded-tl-sm border-slate-200/80 dark:border-slate-800'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}

        {/* Timestamp + Actions (inline at bottom) */}
        {formattedTime && (
          <div className={`flex items-center gap-2 mt-2 text-[10px] ${
            isUser ? 'text-sky-100 justify-end' : 'text-slate-400 dark:text-slate-500'
          }`}>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formattedTime}</span>
            </div>

            {isUser && <Check className="w-3 h-3 text-sky-200" />}

            {!isUser && message.id !== 'streaming-live' && (
              <div className="flex items-center gap-1.5 ml-1">
                <button
                  onClick={handleCopy}
                  className="hover:text-sky-500 transition-colors"
                  title="Copy"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="hover:text-indigo-500 transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
