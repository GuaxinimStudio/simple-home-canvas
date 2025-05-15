
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Log para debugging
    console.log("ProtectedRoute - Estado da sessão:", session ? "Autenticado" : "Não autenticado");
    console.log("ProtectedRoute - Caminho atual:", location.pathname);
  }, [session, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-resolve-green"></div>
      </div>
    );
  }

  if (!session) {
    console.log("ProtectedRoute - Redirecionando para login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
