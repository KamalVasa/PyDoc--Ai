import React from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { UploadZone } from '../components/UploadZone';
import { DocumentCard } from '../components/DocumentCard';
import { BookOpen, FileText, Database, ShieldCheck, RefreshCw } from 'lucide-react';

export const Upload = () => {
  const { documents, loading, uploading, uploadProgress, error, uploadPdf, deleteDocument, fetchDocuments } =
    useDocuments();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sky-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Knowledge Base Indexer</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Python Documentation PDFs
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Upload Python manuals, library docs, or cheat sheets (PDF format only, max 25MB).
            </p>
          </div>

          <button
            onClick={fetchDocuments}
            disabled={loading}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl glass border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Upload Drag & Drop Component */}
        <UploadZone
          onUpload={uploadPdf}
          uploading={uploading}
          uploadProgress={uploadProgress}
          error={error}
        />

        {/* Uploaded Documents List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-500" />
              Indexed Documents ({documents.length})
            </h2>
            <span className="text-xs text-slate-500">
              Vectors stored exclusively inside ChromaDB
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                No Documentation Uploaded Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Upload your first Python PDF documentation above to enable vector similarity search for RAG queries.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} onDelete={deleteDocument} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
