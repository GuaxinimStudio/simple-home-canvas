
import React from 'react';
import { ProblemsTableContainer } from './problemas/ProblemsTableContainer';
import { useProblems } from './problemas/useProblems';

type RecentProblemsTableProps = {
  limit?: number;
};

const RecentProblemsTable: React.FC<RecentProblemsTableProps> = ({ limit = 5 }) => {
  const { problems, isLoading, error } = useProblems(limit);
  
  return (
    <ProblemsTableContainer 
      problems={problems}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default RecentProblemsTable;
