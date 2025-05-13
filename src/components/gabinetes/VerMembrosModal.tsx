
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useContatos } from '@/hooks/useContatos';

interface VerMembrosModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: { id: string; nome: string | null; role?: string }[];
  gabineteNome: string;
  gabineteId: string; // Adicionado o ID do gabinete para buscar os contatos
}

// Vamos estender a interface de perfil para adicionar o tipo de membro
interface MembroCombinado {
  id: string;
  nome: string | null;
  role?: string;
  tipoMembro: 'contato' | 'usuario';
}

const VerMembrosModal: React.FC<VerMembrosModalProps> = ({
  isOpen,
  onClose,
  profiles,
  gabineteNome,
  gabineteId
}) => {
  // Filtra os membros para não incluir vereadores (que são os donos dos gabinetes)
  const membrosVinculados = profiles.filter(profile => profile.role !== 'vereador');
  
  // Busca os contatos do gabinete
  const { contatos, isLoading: isLoadingContatos } = useContatos(gabineteId);
  
  // Estado para armazenar todos os membros (profiles + contatos)
  const [todosMembrosCombinados, setTodosMembrosCombinados] = useState<MembroCombinado[]>([]);
  
  // Combina os membros dos profiles com os contatos
  useEffect(() => {
    const membrosCombinados: MembroCombinado[] = [...membrosVinculados.map(m => ({
      ...m, 
      tipoMembro: 'usuario' as const
    }))];
    
    // Adiciona os contatos como membros
    if (contatos && contatos.length > 0) {
      contatos.forEach(contato => {
        membrosCombinados.push({
          id: contato.id,
          nome: contato.nome,
          tipoMembro: 'contato' as const
        });
      });
    }
    
    setTodosMembrosCombinados(membrosCombinados);
  }, [membrosVinculados, contatos]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Membros do {gabineteNome}</DialogTitle>
          <DialogDescription>
            Usuários vinculados a este gabinete
          </DialogDescription>
        </DialogHeader>

        {isLoadingContatos ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-resolve-green"></div>
          </div>
        ) : todosMembrosCombinados.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todosMembrosCombinados.map((membro) => (
                <TableRow key={membro.id}>
                  <TableCell className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {membro.nome || 'Sem nome definido'}
                  </TableCell>
                  <TableCell>
                    {membro.tipoMembro === 'contato' ? 'Contato' : (membro.role === 'administrador' ? 'Administrador' : 'Usuário')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Não há membros vinculados a este gabinete
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerMembrosModal;
