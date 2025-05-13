
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProblemHeaderProps {
  totalProblems: number;
}

export const ProblemHeader: React.FC<ProblemHeaderProps> = ({ totalProblems }) => {
  const { user } = useAuth();
  
  const { data: userProfile } = useQuery({
    queryKey: ['profile-location', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, gabinetes(municipio, estado), role')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Erro ao carregar perfil:', profileError);
        return null;
      }
      
      return profile;
    },
    enabled: !!user?.id
  });

  // Determinar a localização com base nos dados do perfil do usuário
  const location = userProfile?.role === 'administrador' 
    ? 'todas as cidades'
    : userProfile?.gabinetes 
      ? `${userProfile.gabinetes.municipio || ''}, ${userProfile.gabinetes.estado || ''}`
      : 'sua cidade';

  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800">Problemas Reportados</h1>
      <div className="flex items-center mt-1">
        <span className="text-gray-600 text-sm bg-green-100 px-2 py-0.5 rounded-full mr-2">
          {totalProblems} problemas
        </span>
        <p className="text-gray-600">
          Gerencie todos os problemas reportados pelos cidadãos em {location}
        </p>
      </div>
    </div>
  );
};
