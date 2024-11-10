import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FileUploadPage from './pages/FileUploadPage';
import UploadResultsPage from './pages/UploadResultsPage';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  // Placeholder for authentication state; implement as needed
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  return (
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/upload"
          element={<ProtectedRoute element={<FileUploadPage />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/upload-results"
          element={<ProtectedRoute element={<UploadResultsPage />} isAuthenticated={isAuthenticated} />}
        />

        {/* Redirect any other route to /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
  );
}

export default App;
