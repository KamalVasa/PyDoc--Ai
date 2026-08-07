import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const CodeBlock = ({ language = 'python', value = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-slate-700/60 shadow-xl bg-[#1e1e1e]">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold text-slate-200 uppercase tracking-wider">{language || 'python'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-sans"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighted Code */}
      <SyntaxHighlighter
        language={language || 'python'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          backgroundColor: '#1e1e1e',
        }}
        codeTagProps={{
          style: {
            fontFamily: "'Fira Code', monospace",
          },
        }}
      >
        {value.trim()}
      </SyntaxHighlighter>
    </div>
  );
};
