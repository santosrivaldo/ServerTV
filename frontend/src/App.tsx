import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Videos } from './pages/Videos';
import { Playlists } from './pages/Playlists';
import { Users } from './pages/Users';
import { Stats } from './pages/Stats';
import { VideoPlayer } from './pages/VideoPlayer';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="videos" element={<Videos />} />
          <Route path="playlists" element={<Playlists />} />
          <Route path="users" element={<Users />} />
          <Route path="stats" element={<Stats />} />
          <Route path="player/:videoId" element={<VideoPlayer />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
