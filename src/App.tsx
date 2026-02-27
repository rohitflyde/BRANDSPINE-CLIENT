// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicOnlyRoute } from './components/auth/PublicOnlyRoute';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import ThemeSelection from './pages/ThemeSelection';
import Editor from './pages/Editor';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - order matters, put specific routes first */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } />

          {/* Theme Selection - only accessible to first-time users */}
          <Route path="/theme-selection" element={
            <ProtectedRoute>
              <ThemeSelection />
            </ProtectedRoute>
          } />

          {/* Editor - main app */}
          <Route path="/editor" element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          } />

          {/* Root - redirect to editor (ProtectedRoute will handle first-time redirect) */}
          <Route path="/" element={<Navigate to="/editor" replace />} />

          {/* Catch all - redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;