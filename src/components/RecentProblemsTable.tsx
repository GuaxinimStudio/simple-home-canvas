
import React, { useEffect, useState, useCallback } from 'react';
import { ProblemsTableContainer } from './problemas/ProblemsTableContainer';
import { useProblems } from '@/hooks/problemas/useProblems';
import { useLocation } from 'react-router-dom';
import { useRealtimeProblems } from '@/hooks/problemas/useRealtimeProblems';

type RecentProblemsTableProps = {
  limit?: number;
};

const RecentProblemsTable: React.FC<RecentProblemsTableProps> = ({ limit = 5 }) => {
  const location = useLocation();
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);
  
  // Usar useCallback para evitar recriações desnecessárias da função de atualização
  const refreshData = useCallback(() => {
    // Esta função será passada para o hook useRealtimeProblems
    setHasAttemptedRefresh(false); // Forçar nova atualização
  }, []);
  
  // Hook problems com dados e função de atualização
  const { problems, isLoading, error, refreshData: problemsRefresh } = useProblems(limit);
  
  // Hook para atualização em tempo real e notificações
  useRealtimeProblems(refreshData);
  
  // Atualizamos os dados apenas uma vez quando a página carrega
  // ou quando a função refreshData é chamada pelo hook useRealtimeProblems
  useEffect(() => {
    // Verificamos se estamos na página inicial e se ainda não tentamos atualizar
    if ((location.pathname === '/' && !hasAttemptedRefresh) || !hasAttemptedRefresh) {
      // Definimos um pequeno atraso para evitar múltiplas chamadas em sequência
      const timer = setTimeout(() => {
        problemsRefresh();
        setHasAttemptedRefresh(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, problemsRefresh, hasAttemptedRefresh, refreshData]);
  
  return (
    <ProblemsTableContainer 
      problems={problems}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default RecentProblemsTable;
