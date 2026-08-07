import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { CheckCircle2 } from 'lucide-react';

export const MarkdownRenderer = ({ content = '' }) => {
  // Pre-process content: clean up divider artifacts while preserving clean linebreaks for markdown
  const processedContent = content
    .replace(/={2,}/g, '')
    .replace(/-{4,}/g, '')
    .replace(/(###?\s+)/g, '\n\n$1')
    .trim();

  return (
    <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 leading-relaxed text-sm md:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : 'python';
            const value = String(children).replace(/\n$/, '');

            if (!inline) {
              return <CodeBlock language={lang} value={value} />;
            }
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-mono text-xs font-semibold"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-3 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-2 mb-1">
              {children}
            </h3>
          ),
          ul: ({ children }) => <ul className="my-2 space-y-1.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1.5">{children}</ol>,
          li: ({ children }) => (
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{children}</span>
            </li>
          ),
          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-sky-500 pl-4 py-1 italic my-3 bg-sky-500/5 rounded-r-lg">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-slate-200 dark:border-slate-800 my-4" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-left font-semibold border-b border-slate-300 dark:border-slate-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
              {children}
            </td>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
