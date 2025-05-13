
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface VerMembrosModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: { id: string; nome: string | null }[];
  gabineteNome: string;
}

const VerMembrosModal: React.FC<VerMembrosModalProps> = ({
  isOpen,
  onClose,
  profiles,
  gabineteNome
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Membros do {gabineteNome}</DialogTitle>
        </DialogHeader>

        {profiles.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
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
