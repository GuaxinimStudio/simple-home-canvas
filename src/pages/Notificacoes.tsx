
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import NovaNotificacaoModal from '@/components/notificacoes/NovaNotificacaoModal';
import DetalhesNotificacaoModal from '@/components/notificacoes/DetalhesNotificacaoModal';
import NotificacoesHeader from '@/components/notificacoes/NotificacoesHeader';
import NotificacoesInfo from '@/components/notificacoes/NotificacoesInfo';
import NotificacoesPesquisa from '@/components/notificacoes/NotificacoesPesquisa';
import NotificacoesLista from '@/components/notificacoes/NotificacoesLista';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Notificacoes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    notificacoes, 
    isLoading, 
    error, 
    searchTerm, 
    setSearchTerm,
    excluirNotificacao,
    selectedNotificacao,
    setSelectedNotificacao 
  } = useNotificacoes();
  
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<{ role: string, gabineteNome?: string, municipio?: string } | null>(null);
  
  useEffect(() => {
    const buscarInformacaoUsuario = async () => {
      if (!user?.id) return;
      
      try {
        const { data: perfilData, error: perfilError } = await supabase
          .from('profiles')
          .select('role, gabinete_id')
          .eq('id', user?.id)
          .single();
          
        if (perfilError || !perfilData) return;
        
        if (perfilData.role === 'administrador') {
          setUserInfo({ role: 'administrador' });
        } else if (perfilData.gabinete_id) {
          const { data: gabineteData, error: gabineteError } = await supabase
            .from('gabinetes')
            .select('gabinete, municipio')
            .eq('id', perfilData.gabinete_id)
            .single();
            
          if (!gabineteError && gabineteData) {
            setUserInfo({
              role: perfilData.role,
              gabineteNome: gabineteData.gabinete,
              municipio: gabineteData.municipio || undefined
            });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
      }
    };
    
    buscarInformacaoUsuario();
  }, [user?.id]);

  const renderTitulo = () => {
    if (!userInfo) return "Carregando...";
    
    if (userInfo.role === 'administrador') {
      return "Notificações de Todos os Gabinetes";
    }
    
    return `Notificações do Gabinete ${userInfo.gabineteNome || ''}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho com ícone e botão */}
          <NotificacoesHeader onNovaNotificacao={() => setIsModalOpen(true)} />
          
          {/* Card de Sobre Notificações */}
          <NotificacoesInfo />
          
          {/* Barra de pesquisa */}
          <NotificacoesPesquisa searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          {/* Seção Lista de Notificações */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">{renderTitulo()}</h2>
            <p className="text-gray-500 text-sm">Clique no card para ver detalhes completos</p>
          </div>
          
          {/* Lista de Notificações */}
          <NotificacoesLista 
            notificacoes={notificacoes}
            isLoading={isLoading}
            error={error}
            onSelectNotificacao={setSelectedNotificacao}
            onExcluirNotificacao={excluirNotificacao}
          />
        </div>
      </div>
      
      {/* Modal para Nova Notificação */}
      <NovaNotificacaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Modal para Detalhes da Notificação */}
      <DetalhesNotificacaoModal
        notificacao={selectedNotificacao}
        isOpen={!!selectedNotificacao}
        onClose={() => setSelectedNotificacao(null)}
      />
    </div>
  );
};

export default Notificacoes;
