
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Usuario {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  role: string;
  gabinetes: {
    gabinete: string;
  } | null;
}

interface UsuariosTableProps {
  usuarios: Usuario[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const UsuariosTable = ({ usuarios, isLoading, error }: UsuariosTableProps) => {
  // Função para traduzir o role
  const traduzirRole = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'Administrador';
      case 'vereador':
        return 'Vereador';
      default:
        return role;
    }
  };

  const handleEdit = (usuario: Usuario) => {
    toast.info(`Editar usuário: ${usuario.nome}`);
    // Aqui implementaremos a funcionalidade de edição posteriormente
  };

  const handleDelete = (usuario: Usuario) => {
    toast.info(`Excluir usuário: ${usuario.nome}`);
    // Aqui implementaremos a funcionalidade de exclusão posteriormente
  };

  return (
    <div className="overflow-x-auto">
      <Table>
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
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Carregando usuários...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-red-500">
                Erro ao carregar usuários
              </TableCell>
            </TableRow>
          ) : usuarios && usuarios.length > 0 ? (
            usuarios.map((usuario) => (
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
                        onClick={() => handleEdit(usuario)}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(usuario)}
                        className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsuariosTable;
