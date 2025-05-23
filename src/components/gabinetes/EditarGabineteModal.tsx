
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GabineteForm from '@/components/gabinetes/GabineteForm';
import useEditarGabinete from '@/hooks/useEditarGabinete';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditarGabineteModalProps {
  isOpen: boolean;
  onClose: () => void;
  gabinete: {
    id: string;
    gabinete: string;
    estado: string | null;
    municipio: string | null;
    telefone: string | null;
    responsavel: string | null;
  };
  onSuccess?: () => void;
}

const EditarGabineteModal: React.FC<EditarGabineteModalProps> = ({ isOpen, onClose, gabinete, onSuccess }) => {
  const { editarGabinete, isUpdating } = useEditarGabinete(() => {
    onClose();
    if (onSuccess) {
      onSuccess();
    }
  });

  const handleFormSubmit = async (formData: any) => {
    const success = await editarGabinete(gabinete.id, formData);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Editar Gabinete</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="py-2">
            <GabineteForm 
              onSuccess={handleFormSubmit}
              onCancel={onClose}
              initialData={gabinete}
              submitButtonText={isUpdating ? 'Atualizando...' : 'Atualizar'}
              isSubmitting={isUpdating}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditarGabineteModal;
