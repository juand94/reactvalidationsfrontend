import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FileUploadPage from './pages/FileUploadPage';
import AuthLayout from './pages/AuthLayout';
import { AuthProvider } from './components/AuthContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

   // Monitorear el token en localStorage para actualizar isAuthenticated
   useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jwtToken');
      setIsAuthenticated(!!token); // Actualiza si el token está presente
    };
    // Ejecutar checkAuth al montar el componente y cuando haya cambios en localStorage
    checkAuth();
    window.addEventListener('storage', checkAuth); // Escuchar cambios en localStorage

    return () => window.removeEventListener('storage', checkAuth);
  }, [isAuthenticated]);
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/upload" element={<FileUploadPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </AuthProvider>
  );
}

export default App;
