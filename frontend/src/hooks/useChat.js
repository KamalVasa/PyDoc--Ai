import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('chat_session_id') || '');

  // Fetch history for current session
  const fetchHistory = useCallback(async (targetSessionId = sessionId) => {
    try {
      const response = await api.get('/history', {
        params: targetSessionId ? { session_id: targetSessionId } : {},
      });
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Start a new blank chat session without deleting old history
  const startNewChat = useCallback(() => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    localStorage.setItem('chat_session_id', newSessionId);
    setMessages([]);
    setStreamingMessage('');
  }, []);

  // Switch to an existing history session
  const switchSession = useCallback(async (targetSessionId) => {
    if (!targetSessionId) return;
    setSessionId(targetSessionId);
    localStorage.setItem('chat_session_id', targetSessionId);
    try {
      const response = await api.get('/history', {
        params: { session_id: targetSessionId },
      });
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error('Failed to switch session:', err);
    }
  }, []);

  // Send message and handle SSE response
  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    setLoading(true);
    setStreamingMessage('');

    const currentSession = sessionId || crypto.randomUUID();
    if (!sessionId) {
      setSessionId(currentSession);
      localStorage.setItem('chat_session_id', currentSession);
    }

    const token = localStorage.getItem('access_token');
    const API_URL = import.meta.env.VITE_API_URL || 'https://python-chatbot-1-8w4q.onrender.com/api/v1';

    // Add user message optimistically
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          session_id: currentSession,
        }),
      });

      const sessionHeader = response.headers.get('X-Session-ID');
      if (sessionHeader && sessionHeader !== sessionId) {
        setSessionId(sessionHeader);
        localStorage.setItem('chat_session_id', sessionHeader);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataContent = line.slice(6);
            if (dataContent === '[DONE]') {
              break;
            }
            if (dataContent.startsWith('[ERROR:')) {
              accumulatedText += `\n${dataContent}`;
            } else {
              try {
                accumulatedText += JSON.parse(dataContent);
              } catch (e) {
                accumulatedText += dataContent;
              }
            }
            setStreamingMessage(accumulatedText);
          }
        }
      }

      // Append assistant message once stream completes
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: accumulatedText,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingMessage('');
    } catch (error) {
      console.error('Streaming error:', error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to connect to the server.'}`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await api.delete('/history', {
        params: sessionId ? { session_id: sessionId } : {},
      });
      startNewChat();
    } catch (err) {
      console.error('Failed to clear chat history:', err);
    }
  };

  const regenerateLastMessage = async () => {
    if (messages.length === 0 || loading) return;

    const userMessages = messages.filter((m) => m.role === 'user');
    if (userMessages.length === 0) return;
    const lastUserMsg = userMessages[userMessages.length - 1];

    setMessages((prev) => {
      const updated = [...prev];
      if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
        updated.pop();
      }
      if (updated.length > 0 && updated[updated.length - 1].role === 'user') {
        updated.pop();
      }
      return updated;
    });

    await sendMessage(lastUserMsg.content);
  };

  return {
    messages,
    loading,
    streamingMessage,
    sessionId,
    sendMessage,
    startNewChat,
    switchSession,
    clearChat,
    fetchHistory,
    regenerateLastMessage,
  };
};
