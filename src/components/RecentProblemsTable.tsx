
import React, { useEffect } from 'react';
import { ProblemsTableContainer } from './problemas/ProblemsTableContainer';
import { useProblems } from './problemas/useProblems';
import { useLocation } from 'react-router-dom';

type RecentProblemsTableProps = {
  limit?: number;
};

const RecentProblemsTable: React.FC<RecentProblemsTableProps> = ({ limit = 5 }) => {
  const location = useLocation();
  const { problems, isLoading, error, refreshData } = useProblems(limit);
  
  // Atualizar os dados quando retornar à página inicial
  useEffect(() => {
    // Se estamos na página inicial, atualizamos os dados
    if (location.pathname === '/') {
      refreshData();
    }
  }, [location.pathname, refreshData]);
  
  return (
    <ProblemsTableContainer 
      problems={problems}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default RecentProblemsTable;
