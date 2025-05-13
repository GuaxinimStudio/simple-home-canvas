
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface VerMembrosModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: { id: string; nome: string | null; role?: string }[];
  gabineteNome: string;
}

const VerMembrosModal: React.FC<VerMembrosModalProps> = ({
  isOpen,
  onClose,
  profiles,
  gabineteNome
}) => {
  // Filtra os membros para não incluir vereadores (que são os donos dos gabinetes)
  const membrosVinculados = profiles.filter(profile => profile.role !== 'vereador');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Membros do {gabineteNome}</DialogTitle>
          <DialogDescription>
            Usuários vinculados a este gabinete
          </DialogDescription>
        </DialogHeader>

        {membrosVinculados.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membrosVinculados.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {profile.nome || 'Sem nome definido'}
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
