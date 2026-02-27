// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicOnlyRoute } from './components/auth/PublicOnlyRoute';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import Editor from './pages/Editor';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - only accessible when NOT logged in */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          {/* Protected Routes - only accessible when logged in */}
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />

          {/* Add more protected routes as needed */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div>Settings Page (Coming Soon)</div>
              </ProtectedRoute>
            }
          />

          {/* Redirect root based on auth status */}
          <Route path="/" element={<Navigate to="/editor" replace />} />

          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;