import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Chat } from '../pages/Chat';
import { Upload } from '../pages/Upload';
import { Dashboard } from '../pages/Dashboard';
import { History } from '../pages/History';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';
import { NotFound } from '../pages/NotFound';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Chat />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />

      {/* Catch-all 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};



