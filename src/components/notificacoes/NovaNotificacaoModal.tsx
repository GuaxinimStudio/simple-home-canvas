
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import { NotificacaoForm, NotificacaoFormData } from './form/NotificacaoForm';

type NovaNotificacaoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NovaNotificacaoModal: React.FC<NovaNotificacaoModalProps> = ({ isOpen, onClose }) => {
  const { criarNotificacao, isCreating, isUploading } = useNotificacoes();
  const isLoading = isCreating || isUploading;

  const handleSubmit = async (values: NotificacaoFormData, arquivo: File | null) => {
    await criarNotificacao({
      novaNotificacao: {
        gabinete_id: values.gabinete_id,
        informacao: values.informacao
      },
      arquivo: arquivo || undefined
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle>Nova Notificação</SheetTitle>
          <SheetDescription>
            Envie uma notificação para os contatos cadastrados no gabinete.
          </SheetDescription>
        </SheetHeader>

        <NotificacaoForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={onClose}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NovaNotificacaoModal;
