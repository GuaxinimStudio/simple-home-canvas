
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
} from '@/components/ui/sheet';
import NovoUsuarioForm from './NovoUsuarioForm';

interface NovoUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  gabinetes: {id: string, gabinete: string}[] | undefined;
}

const NovoUsuarioModal = ({ open, onOpenChange, onSuccess, gabinetes }: NovoUsuarioModalProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Novo Usuário</SheetTitle>
          <SheetDescription>
            Adicione um novo usuário ao sistema. Defina a senha inicial que será usada pelo usuário.
          </SheetDescription>
        </SheetHeader>

        <NovoUsuarioForm 
          onSuccess={onSuccess} 
          onClose={() => onOpenChange(false)}
          gabinetes={gabinetes}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NovoUsuarioModal;
