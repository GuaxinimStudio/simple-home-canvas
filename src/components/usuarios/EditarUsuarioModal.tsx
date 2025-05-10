
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import EditarUsuarioForm from './EditarUsuarioForm';

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

interface EditarUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  usuario: Usuario | null;
  gabinetes: { id: string; gabinete: string }[];
}

const EditarUsuarioModal = ({
  open,
  onOpenChange,
  onSuccess,
  usuario,
  gabinetes,
}: EditarUsuarioModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Edite as informações do usuário abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <EditarUsuarioForm
          usuario={usuario}
          onSuccess={onSuccess}
          onClose={() => onOpenChange(false)}
          gabinetes={gabinetes}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditarUsuarioModal;
