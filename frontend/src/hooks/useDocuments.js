import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/documents');
      setDocuments(response.data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError(err.response?.data?.detail || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadPdf = async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Only PDF files are allowed');
    }

    if (file.size > 25 * 1024 * 1024) {
      throw new Error('File size exceeds maximum limit of 25MB');
    }

    setUploading(true);
    setUploadProgress(10);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      setDocuments((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Upload failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteDocument = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error('Failed to delete document:', err);
      throw new Error(err.response?.data?.detail || 'Failed to delete document');
    }
  };

  return {
    documents,
    loading,
    uploading,
    uploadProgress,
    error,
    fetchDocuments,
    uploadPdf,
    deleteDocument,
  };
};
