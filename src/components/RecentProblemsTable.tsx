
import React, { useEffect, useState } from 'react';
import { ProblemsTableContainer } from './problemas/ProblemsTableContainer';
import { useProblems } from '@/hooks/problemas/useProblems';
import { useLocation } from 'react-router-dom';

type RecentProblemsTableProps = {
  limit?: number;
};

const RecentProblemsTable: React.FC<RecentProblemsTableProps> = ({ limit = 5 }) => {
  const location = useLocation();
  const { problems, isLoading, error, refreshData } = useProblems(limit);
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);
  
  // Atualizamos os dados apenas uma vez quando a página carrega
  useEffect(() => {
    // Verificamos se estamos na página inicial e se ainda não tentamos atualizar
    if (location.pathname === '/' && !hasAttemptedRefresh) {
      // Definimos um pequeno atraso para evitar múltiplas chamadas em sequência
      const timer = setTimeout(() => {
        refreshData();
        setHasAttemptedRefresh(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, refreshData, hasAttemptedRefresh]);
  
  return (
    <ProblemsTableContainer 
      problems={problems}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default RecentProblemsTable;
