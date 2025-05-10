
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Usuario {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  role: string;
  gabinete_id: string | null;
  gabinetes: {
    gabinete: string;
  } | null;
}

interface UsuarioTableRowProps {
  usuario: Usuario;
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
  traduzirRole: (role: string) => string;
}

const UsuarioTableRow = ({ usuario, onEdit, onDelete, traduzirRole }: UsuarioTableRowProps) => {
  return (
    <TableRow key={usuario.id}>
      <TableCell className="font-medium">{usuario.nome || "Sem nome"}</TableCell>
      <TableCell>{usuario.email}</TableCell>
      <TableCell>{usuario.telefone || "-"}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            usuario.role === 'administrador' ? 'bg-resolve-yellow' : 'bg-resolve-teal'
          }`}></div>
          {traduzirRole(usuario.role)}
        </div>
      </TableCell>
      <TableCell>{usuario.gabinetes?.gabinete || "-"}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onEdit(usuario)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(usuario)}
              className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UsuarioTableRow;
