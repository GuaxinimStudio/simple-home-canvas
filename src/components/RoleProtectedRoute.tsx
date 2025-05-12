
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { session, isLoading } = useAuth();
  
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        console.error('Erro ao carregar perfil:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user.id
  });

  // Mostra loading enquanto verifica a autenticação ou carrega o perfil
  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-resolve-green"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado mas não tiver perfil ou não tiver permissão
  if (!userProfile || !allowedRoles.includes(userProfile.role)) {
    toast.error('Você não tem permissão para acessar esta página');
    return <Navigate to="/" replace />;
  }

  // Se tiver permissão, renderiza o componente filho
  return <>{children}</>;
};

export default RoleProtectedRoute;
