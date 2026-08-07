import React, { useState, useRef } from 'react';
import { Upload, FileUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export const UploadZone = ({ onUpload, uploading, uploadProgress, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF files are supported.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert('File size exceeds the 25MB limit.');
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed: ' + err.message);
    }
  };

  const triggerFileSelect = () => {
    if (!uploading && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-sky-500 bg-sky-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 bg-slate-50/50 dark:bg-slate-900/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <FileUp className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Upload Python Documentation PDF
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Drag and drop your PDF here, or click to browse files
            </p>
            <p className="text-xs text-sky-500 font-medium mt-1">
              Maximum file size: 25 MB • PDF files only
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-600 dark:text-sky-400 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{selectedFile.name}</span>
              <span className="text-xs font-normal text-slate-400">
                ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
          )}

          {uploading && (
            <div className="w-full max-w-xs space-y-2">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs font-medium text-slate-500">
                Processing PDF & Generating Embeddings... {uploadProgress}%
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {selectedFile && !uploading && (
            <button
              onClick={handleSubmit}
              className="mt-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-sky-500/20 transition-all active:scale-95 z-50 relative pointer-events-auto"
            >
              Start Upload & Indexing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
