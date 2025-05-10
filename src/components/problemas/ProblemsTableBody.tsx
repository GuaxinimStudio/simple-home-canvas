
import React from 'react';
import { TableBody } from '@/components/ui/table';
import { ProblemRow } from './ProblemRow';
import { ProblemItem } from './types';

type ProblemsTableBodyProps = {
  problems: ProblemItem[];
};

export const ProblemsTableBody: React.FC<ProblemsTableBodyProps> = ({ problems }) => {
  return (
    <TableBody>
      {problems.map(problem => (
        <ProblemRow key={problem.id} problem={problem} />
      ))}
    </TableBody>
  );
};
