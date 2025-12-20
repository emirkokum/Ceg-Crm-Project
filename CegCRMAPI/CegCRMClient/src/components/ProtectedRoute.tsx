import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRouteProps } from '../types/auth';
import { ReactNode } from 'react';

interface ProtectedRouteWithChildren extends ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteWithChildren) {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
} 