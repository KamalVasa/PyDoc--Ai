import React, { useEffect, useState } from 'react';
import { Plus, Sparkles, ShieldCheck, ChevronRight, MessageSquare, PanelLeftClose, Clock, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useSidebar } from '../context/SidebarContext';

export const Sidebar = ({ onNewChat, onSelectSession, documentsCount = 0, onSelectPrompt, isOpen: propIsOpen, onToggle: propOnToggle, currentMessages = [] }) => {
  const contextSidebar = useSidebar();
  const isOpen = propIsOpen !== undefined ? propIsOpen : contextSidebar.sidebarOpen;
  const onToggle = propOnToggle !== undefined ? propOnToggle : contextSidebar.toggleSidebar;

  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'topics'
  const [sessions, setSessions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const quickPrompts = [
    "What is the difference between list and tuple?",
    "How to handle custom exceptions in FastAPI?",
    "Explain Python list comprehension vs generator.",
  ];

  // Fetch session-based chat history directly inside sidebar
  const fetchSidebarHistory = async () => {
    setLoadingHistory(true);
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

      const sortedSessions = Object.values(sessionMap)
        .filter((s) => s.firstQuery)
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

      setSessions(sortedSessions);
    } catch (err) {
      console.error('Failed to load sidebar history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchSidebarHistory();
  }, [currentMessages]);

  const handleSelectSession = (sessionId) => {
    if (onSelectSession) {
      onSelectSession(sessionId);
    }
    if (window.innerWidth < 768 && onToggle) {
      onToggle();
    }
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await api.delete('/history', { params: { session_id: sessionId } });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (localStorage.getItem('chat_session_id') === sessionId && onNewChat) {
        onNewChat();
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="md:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto flex flex-col h-screen md:h-[calc(100vh-4rem)] bg-slate-900 text-slate-200 border-r border-slate-800 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 overflow-hidden shadow-2xl md:shadow-none ${
          isOpen
            ? 'w-60 sm:w-64 p-3.5 gap-3 opacity-100 translate-x-0'
            : 'w-0 p-0 gap-0 opacity-0 -translate-x-full border-none pointer-events-none'
        }`}
      >
        {/* Top Sidebar Header with Close Toggle Icon */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Navigation
          </span>
          <button
            onClick={onToggle}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Sidebar"
          >
            <PanelLeftClose className="w-6 h-6 text-sky-400 hover:text-white" />
          </button>
        </div>

        {/* Guard Notice */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            <strong className="text-emerald-300">Strict Python Guard</strong>
            <br />
            Non-Python questions are rejected.
          </p>
        </div>

        {/* Tab Switcher: History vs Topics */}
        <div className="flex items-center p-1 bg-slate-800/60 rounded-xl border border-slate-700/40 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-sky-500 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History ({sessions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'topics'
                ? 'bg-sky-500 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Topics</span>
          </button>
        </div>

        {/* History List Directly Below + New Chat */}
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-2">
          {activeTab === 'history' ? (
            /* Past Conversations History List */
            <div className="space-y-1.5">
              {loadingHistory ? (
                <div className="text-center py-6 text-xs text-slate-500 animate-pulse">
                  Loading history...
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 px-2 text-xs text-slate-500">
                  No past chat history yet. Ask a question to start!
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className="w-full flex items-center justify-between text-left p-2.5 rounded-xl bg-slate-800/30 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-transparent hover:border-slate-700/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate font-medium">{session.firstQuery || 'Python Chat Session'}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-opacity rounded"
                      title="Delete Chat Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Sample Topics List */
            <div className="space-y-1">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onSelectPrompt) onSelectPrompt(prompt);
                    if (window.innerWidth < 768 && onToggle) onToggle();
                  }}
                  className="w-full flex items-start gap-2 text-left p-2.5 rounded-xl bg-transparent hover:bg-slate-800/60 text-xs text-slate-400 hover:text-white border border-transparent hover:border-slate-700/40 transition-all group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="line-clamp-2">{prompt}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Fixed Action: + New Chat Button */}
        <div className="pt-3 pb-1 mt-auto border-t border-slate-800 shrink-0 w-full">
          <button
            onClick={() => {
              if (onNewChat) onNewChat();
              if (window.innerWidth < 768 && onToggle) onToggle();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-medium text-xs shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
      </aside>
    </>
  );
};
