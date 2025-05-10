
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

const UsuarioTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Telefone</TableHead>
        <TableHead>Função</TableHead>
        <TableHead>Secretaria</TableHead>
        <TableHead className="w-[60px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UsuarioTableHeader;
