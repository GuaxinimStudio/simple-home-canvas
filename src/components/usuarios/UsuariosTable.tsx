
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import EditarUsuarioModal from './EditarUsuarioModal';
import { useExcluirUsuario } from './hooks/useExcluirUsuario';
import DeleteUsuarioDialog from './DeleteUsuarioDialog';
import UsuarioTableHeader from './UsuarioTableHeader';
import UsuarioTableRow from './UsuarioTableRow';
import { traduzirRole } from './utils/roleUtils';

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

interface UsuariosTableProps {
  usuarios: Usuario[] | undefined;
  isLoading: boolean;
  error: Error | null;
  gabinetes: { id: string; gabinete: string }[];
  onUsuarioUpdated: () => void;
}

const UsuariosTable = ({ 
  usuarios, 
  isLoading, 
  error, 
  gabinetes, 
  onUsuarioUpdated 
}: UsuariosTableProps) => {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { 
    usuarioParaExcluir,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete,
    confirmarExclusao
  } = useExcluirUsuario(onUsuarioUpdated);

  const handleEdit = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setIsEditModalOpen(true);
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            Carregando usuários...
          </TableCell>
        </TableRow>
      );
    }
    
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-red-500">
            Erro ao carregar usuários
          </TableCell>
        </TableRow>
      );
    }
    
    if (!usuarios || usuarios.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
            Nenhum usuário encontrado
          </TableCell>
        </TableRow>
      );
    }
    
    return usuarios.map((usuario) => (
      <UsuarioTableRow
        key={usuario.id}
        usuario={usuario}
        onEdit={handleEdit}
        onDelete={handleDelete}
        traduzirRole={traduzirRole}
      />
    ));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <UsuarioTableHeader />
        <TableBody>
          {renderTableContent()}
        </TableBody>
      </Table>

      <EditarUsuarioModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={onUsuarioUpdated}
        usuario={usuarioSelecionado}
        gabinetes={gabinetes}
      />

      <DeleteUsuarioDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmarExclusao}
      />
    </div>
  );
};

export default UsuariosTable;
