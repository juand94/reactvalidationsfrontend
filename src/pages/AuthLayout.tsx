// AuthLayout.tsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const AuthLayout: React.FC = () => {
    const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;
};

export default AuthLayout;
