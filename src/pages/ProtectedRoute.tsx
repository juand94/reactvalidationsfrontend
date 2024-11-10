import React from 'react';
import { Navigate } from 'react-router-dom';

// Define the prop types
interface ProtectedRouteProps {
  element: React.ReactNode; // Can be any valid React component or JSX element
  isAuthenticated: boolean; // Boolean to check if the user is authenticated
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, isAuthenticated }) => {
  // If the user is not authenticated, redirect to the login page
  console.log("noooo au", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the passed element (component)
  return <>{element}</>;
};

export default ProtectedRoute;
