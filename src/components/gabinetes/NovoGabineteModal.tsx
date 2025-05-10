
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import GabineteForm from './GabineteForm';

interface NovoGabineteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NovoGabineteModal: React.FC<NovoGabineteModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Novo Gabinete</SheetTitle>
          <SheetDescription>
            Preencha os campos para criar um novo gabinete.
          </SheetDescription>
        </SheetHeader>
        
        <GabineteForm 
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NovoGabineteModal;
