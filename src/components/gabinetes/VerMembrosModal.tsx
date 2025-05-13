
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useContatos } from '@/hooks/useContatos';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

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
  telefone?: string | null;
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
  const { contatos, isLoading: isLoadingContatos, excluirContato } = useContatos(gabineteId);
  
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
          telefone: contato.telefone,
          tipoMembro: 'contato' as const
        });
      });
    }
    
    setTodosMembrosCombinados(membrosCombinados);
  }, [membrosVinculados, contatos]);

  const handleExcluirContato = async (contatoId: string) => {
    try {
      await excluirContato(contatoId);
      toast({
        title: "Contato excluído com sucesso",
        description: "O contato foi removido do gabinete."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir contato",
        description: "Não foi possível excluir o contato. Tente novamente."
      });
    }
  };

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
                <TableHead>Telefone</TableHead>
                <TableHead></TableHead>
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
                    {membro.telefone || '-'}
                  </TableCell>
                  <TableCell>
                    {membro.tipoMembro === 'contato' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleExcluirContato(membro.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
