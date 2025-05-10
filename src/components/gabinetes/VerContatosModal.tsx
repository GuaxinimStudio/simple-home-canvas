
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Phone, User } from 'lucide-react';
import { useContatos } from '@/hooks/useContatos';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface VerContatosModalProps {
  isOpen: boolean;
  onClose: () => void;
  gabineteId: string;
  gabineteNome: string;
}

const VerContatosModal: React.FC<VerContatosModalProps> = ({
  isOpen,
  onClose,
  gabineteId,
  gabineteNome
}) => {
  const { contatos, isLoading } = useContatos(gabineteId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contatos do Gabinete {gabineteNome}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-resolve-green"></div>
          </div>
        ) : contatos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contatos.map((contato) => (
                <TableRow key={contato.id}>
                  <TableCell className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {contato.nome}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      {contato.telefone}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Não há contatos cadastrados para este gabinete
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerContatosModal;
