
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import useExcluirGabinete from '@/hooks/useExcluirGabinete';

interface ExcluirGabineteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gabineteId: string;
  gabineteNome: string;
  onSuccess: () => void;
}

const ExcluirGabineteDialog: React.FC<ExcluirGabineteDialogProps> = ({
  isOpen,
  onClose,
  gabineteId,
  gabineteNome,
  onSuccess
}) => {
  const { excluirGabinete, isDeleting } = useExcluirGabinete(onSuccess);

  const handleExcluir = async () => {
    const sucesso = await excluirGabinete(gabineteId);
    if (sucesso) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o gabinete <strong>{gabineteNome}</strong>?
            <br /><br />
            Esta ação não poderá ser desfeita. Gabinetes com problemas ou usuários vinculados não podem ser excluídos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleExcluir();
            }}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExcluirGabineteDialog;
