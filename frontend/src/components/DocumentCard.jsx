import React from 'react';
import { FileText, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const DocumentCard = ({ document, onDelete }) => {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ready':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Ready for RAG
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            Processing Chunks
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Processing Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-sky-500/50 transition-all group flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
              {document.original_filename}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatBytes(document.file_size)} • {document.chunk_count} Chunks
            </p>
          </div>
        </div>
        {getStatusBadge(document.status)}
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500">
        <span>Uploaded {new Date(document.created_at).toLocaleDateString()}</span>
        <button
          onClick={() => onDelete(document.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Delete PDF document"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
