import React, { useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useDocuments } from '../hooks/useDocuments';
import { Sidebar } from '../components/Sidebar';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { TypingIndicator } from '../components/TypingIndicator';
import { Code2, ShieldAlert, PanelLeft } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

export const Chat = () => {
  const { messages, loading, streamingMessage, sendMessage, startNewChat, switchSession, regenerateLastMessage } = useChat();
  const { documents } = useDocuments();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new message or token stream
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, loading]);

  const handleSelectPrompt = (promptText) => {
    sendMessage(promptText);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onNewChat={startNewChat}
        onSelectSession={switchSession}
        documentsCount={documents.length}
        onSelectPrompt={handleSelectPrompt}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        currentMessages={messages}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50 relative overflow-hidden">
        {/* Floating Sidebar Open Toggle Button (Below Top Navbar on Top-Left) */}
        {!sidebarOpen && (
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={toggleSidebar}
              className="p-2.5 rounded-xl glass shadow-lg border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-all hover:scale-105"
              title="Open Sidebar"
            >
              <PanelLeft className="w-5 h-5 text-sky-500" />
            </button>
          </div>
        )}

        {/* Scrollable Message List */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-16 space-y-4 scrollbar-thin">
          {messages.length === 0 && !streamingMessage ? (
            /* Empty State Hero Card */
            <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto my-auto p-6 sm:p-8 glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 mb-3 animate-bounce-subtle">
                <Code2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                How can I help with Python today?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-md">
                I am your strictly guarded Python Documentation Assistant. Ask any Python question or query uploaded PDF documentation.
              </p>

              {/* Guard Warning Box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-left text-xs text-sky-700 dark:text-sky-300 space-y-1 w-full">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Strict Topic Guard Enforcement</span>
                </div>
                <p className="text-[11px] leading-normal">
                  Questions outside Python programming (React, Java, SQL, General Knowledge, etc.) are immediately rejected.
                </p>
              </div>

              {/* Sample Prompts */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {[
                  "Explain list comprehension in Python",
                  "What is async/await in Python?",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPrompt(prompt)}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-sky-500/10 dark:hover:bg-sky-500/20 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-medium text-left transition-all hover:scale-[1.01]"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isLast={idx === messages.length - 1}
                  onRegenerate={regenerateLastMessage}
                />
              ))}

              {/* Live Streaming Message Bubble */}
              {streamingMessage && (
                <ChatMessage
                  message={{
                    id: 'streaming-live',
                    role: 'assistant',
                    content: streamingMessage,
                    created_at: new Date().toISOString(),
                  }}
                  isLast={true}
                />
              )}

              {/* Bouncing Dots Typing Indicator */}
              {loading && !streamingMessage && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ChatGPT Style Floating Input Dock with Compact Bottom Blur */}
        <div className="absolute bottom-0 left-0 right-0 pt-2 pb-2 px-2 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent dark:from-[#070b14] dark:via-[#070b14]/80 dark:to-transparent backdrop-blur-[2px] pointer-events-none z-10">
          <div className="pointer-events-auto">
            <ChatInput onSend={sendMessage} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
};
