import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MessageSquare, Calendar, Trash2, ArrowRight, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const History = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/history');
      const messages = response.data.messages || [];
      
      // Group messages by session_id
      const sessionMap = {};
      messages.forEach((msg) => {
        if (!sessionMap[msg.session_id]) {
          sessionMap[msg.session_id] = {
            id: msg.session_id,
            firstQuery: msg.role === 'user' ? msg.content : '',
            lastUpdated: msg.created_at,
            messageCount: 0,
          };
        }
        sessionMap[msg.session_id].messageCount += 1;
        if (!sessionMap[msg.session_id].firstQuery && msg.role === 'user') {
          sessionMap[msg.session_id].firstQuery = msg.content;
        }
        if (new Date(msg.created_at) > new Date(sessionMap[msg.session_id].lastUpdated)) {
          sessionMap[msg.session_id].lastUpdated = msg.created_at;
        }
      });

      const groupedSessions = Object.values(sessionMap).sort(
        (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
      );

      setSessions(groupedSessions);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Could not retrieve your chat history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleResume = (sessionId) => {
    localStorage.setItem('chat_session_id', sessionId);
    navigate('/chat');
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this chat session?')) return;
    
    try {
      await api.delete('/history', { params: { session_id: sessionId } });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      
      // If current active session is deleted, remove it from localStorage
      if (localStorage.getItem('chat_session_id') === sessionId) {
        localStorage.removeItem('chat_session_id');
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
      alert('Error deleting session');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL chat history? This cannot be undone.')) return;
    try {
      await api.delete('/history');
      setSessions([]);
      localStorage.removeItem('chat_session_id');
    } catch (err) {
      console.error('Failed to clear history:', err);
      alert('Error clearing history');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-8 h-8 text-sky-500" />
              Chat History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Resume your previous Python documentation conversations.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {sessions.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* History Sessions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Conversations Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              Start chatting with the assistant to build up your history.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-medium text-sm transition-all"
            >
              Start New Chat
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleResume(session.id)}
                className="group flex items-center justify-between p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 hover:border-sky-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="space-y-2 max-w-[80%]">
                  <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-sky-500 transition-colors line-clamp-1">
                    {session.firstQuery || 'New Conversation'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(session.lastUpdated).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium">
                      {session.messageCount} Messages
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="p-2.5 rounded-xl border border-transparent hover:border-red-200 dark:hover:border-red-900/40 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-sky-500 group-hover:bg-sky-500/10 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
