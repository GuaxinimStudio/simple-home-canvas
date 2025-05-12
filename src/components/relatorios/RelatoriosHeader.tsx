
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDownCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; 
import { supabase } from '@/integrations/supabase/client';

interface RelatoriosHeaderProps {
  isLoading: boolean;
  problemaCount: number;
  onVisualizarRelatorio: () => void;
}

type UserGabineteInfo = {
  role: string;
  gabineteNome: string;
  municipio: string | null;
};

const RelatoriosHeader: React.FC<RelatoriosHeaderProps> = ({ 
  isLoading,
  problemaCount, 
  onVisualizarRelatorio
}) => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserGabineteInfo | null>(null);
  
  useEffect(() => {
    const buscarDadosUsuario = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, gabinete_id')
        .eq('id', user.id)
        .single();
      
      if (error || !data) return;
      
      // Se o usuário tiver um gabinete vinculado, busque os detalhes do gabinete
      if (data.gabinete_id) {
        const { data: gabineteData, error: gabineteError } = await supabase
          .from('gabinetes')
          .select('gabinete, municipio')
          .eq('id', data.gabinete_id)
          .single();
        
        if (!gabineteError && gabineteData) {
          setUserInfo({
            role: data.role,
            gabineteNome: gabineteData.gabinete,
            municipio: gabineteData.municipio
          });
        }
      } else {
        setUserInfo({
          role: data.role,
          gabineteNome: 'Todos os Gabinetes',
          municipio: null
        });
      }
    };
    
    buscarDadosUsuario();
  }, [user?.id]);
  
  const renderTituloPagina = () => {
    if (!userInfo) return 'Relatórios';
    
    if (userInfo.role === 'administrador') {
      return 'Relatórios - Todos os Gabinetes';
    }
    
    return `Relatórios - ${userInfo.gabineteNome}`;
  };
  
  const renderSubtituloPagina = () => {
    if (!userInfo) return 'Gerencie e visualize os problemas reportados.';
    
    if (userInfo.role === 'administrador') {
      return 'Visão geral de todos os problemas reportados em todos os gabinetes';
    }
    
    return userInfo.municipio 
      ? `Visão geral dos problemas reportados em ${userInfo.municipio}` 
      : `Visão geral dos problemas reportados no seu gabinete`;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">{renderTituloPagina()}</h1>
        <p className="text-gray-600">{renderSubtituloPagina()}</p>
      </div>
      
      <Button
        className="bg-resolve-green hover:bg-green-700 flex items-center w-full md:w-auto"
        disabled={isLoading || problemaCount === 0}
        onClick={onVisualizarRelatorio}
      >
        <ChevronDownCircle className="mr-2 h-4 w-4" />
        {isLoading ? 'Carregando...' : `Exportar Relatório (${problemaCount})`}
      </Button>
    </div>
  );
};

export default RelatoriosHeader;
