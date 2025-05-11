
import React from 'react';
import { Bell } from 'lucide-react';
import { Notificacao } from '@/hooks/notificacoes/types';
import NotificacaoCard from './NotificacaoCard';

type NotificacoesListaProps = {
  notificacoes: Notificacao[] | undefined;
  isLoading: boolean;
  error: unknown;
  onSelectNotificacao: (notificacao: Notificacao) => void;
  onExcluirNotificacao: (id: string) => void;
};

const NotificacoesLista: React.FC<NotificacoesListaProps> = ({ 
  notificacoes,
  isLoading,
  error,
  onSelectNotificacao,
  onExcluirNotificacao
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
        <p className="mt-2 text-gray-500">Carregando notificações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">Erro ao carregar notificações. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!notificacoes || notificacoes.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <Bell className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">Nenhuma notificação encontrada</h3>
        <p className="mt-1 text-gray-500">Comece criando uma nova notificação usando o botão acima.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notificacoes.map((notificacao) => (
        <NotificacaoCard 
          key={notificacao.id}
          notificacao={notificacao}
          onSelect={onSelectNotificacao}
          onExcluir={onExcluirNotificacao}
        />
      ))}
    </div>
  );
};

export default NotificacoesLista;
