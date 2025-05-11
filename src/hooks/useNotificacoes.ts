
import { useState } from 'react';
import { Notificacao } from './notificacoes/types';
import { useBuscarNotificacoes } from './notificacoes/useBuscarNotificacoes';
import { useCriarNotificacao } from './notificacoes/useCriarNotificacao';
import { useExcluirNotificacao } from './notificacoes/useExcluirNotificacao';

export type { Notificacao } from './notificacoes/types';

export const useNotificacoes = () => {
  const { notificacoes, isLoading, error, searchTerm, setSearchTerm } = useBuscarNotificacoes();
  const { criarNotificacao, isCreating, isUploading } = useCriarNotificacao();
  const { excluirNotificacao } = useExcluirNotificacao();
  const [selectedNotificacao, setSelectedNotificacao] = useState<Notificacao | null>(null);

  return {
    notificacoes,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    criarNotificacao,
    excluirNotificacao,
    isCreating,
    isUploading,
    selectedNotificacao,
    setSelectedNotificacao
  };
};
