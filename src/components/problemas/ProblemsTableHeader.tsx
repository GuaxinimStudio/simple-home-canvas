
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

export const ProblemsTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Descrição</TableHead>
        <TableHead className="w-[120px]">Status</TableHead>
        <TableHead className="w-[120px]">Tempo</TableHead>
        <TableHead className="w-[120px]">Prazo</TableHead>
        <TableHead className="w-[180px]">Data</TableHead>
        <TableHead className="w-[180px]">Secretaria</TableHead>
        <TableHead className="w-[100px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
