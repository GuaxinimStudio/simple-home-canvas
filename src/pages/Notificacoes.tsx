
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import NovaNotificacaoModal from '@/components/notificacoes/NovaNotificacaoModal';
import DetalhesNotificacaoModal from '@/components/notificacoes/DetalhesNotificacaoModal';
import NotificacoesHeader from '@/components/notificacoes/NotificacoesHeader';
import NotificacoesInfo from '@/components/notificacoes/NotificacoesInfo';
import NotificacoesPesquisa from '@/components/notificacoes/NotificacoesPesquisa';
import NotificacoesLista from '@/components/notificacoes/NotificacoesLista';

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
            <h2 className="text-xl font-semibold">Lista de Notificações</h2>
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
