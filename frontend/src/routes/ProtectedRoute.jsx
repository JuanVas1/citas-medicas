import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role: trim, lowercase, accept alias 'admin'
  const rawRole = (user.role || '').toString();
  const normalizedRole = rawRole.trim().toLowerCase() === 'admin' ? 'administrador' : rawRole.trim().toLowerCase();
  const allowedNormalized = (allowedRoles || []).map(r => r.toString().trim().toLowerCase());

  if (!allowedNormalized.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;