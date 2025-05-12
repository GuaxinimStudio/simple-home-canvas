
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

export const ProblemsTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-16">Imagem</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Tempo</TableHead>
        <TableHead>Prazo</TableHead>
        <TableHead>Data</TableHead>
        <TableHead>Gabinete</TableHead>
        <TableHead>Secretaria</TableHead> {/* Nova coluna para secretaria */}
        <TableHead className="w-10">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
