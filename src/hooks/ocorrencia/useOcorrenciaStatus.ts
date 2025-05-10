
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { StatusType } from '@/types/ocorrencia';
import { usePrazoEstimado } from './usePrazoEstimado';

export const useOcorrenciaStatus = (
  initialStatus: StatusType = 'Pendente',
  initialPrazo: string = ''
) => {
  // Gerenciar o status atual
  const [currentStatus, setCurrentStatus] = useState<StatusType>(initialStatus);
  
  // Utilizar hooks específicos para gerenciamento de prazo
  const { prazoEstimado, setPrazoEstimado, handlePrazoChange } = usePrazoEstimado(initialPrazo);
  
  // Atualizar o status quando o valor inicial mudar
  useEffect(() => {
    if (initialStatus) {
      setCurrentStatus(initialStatus);
    }
  }, [initialStatus]);

  // Função para alterar o status com validação
  const handleStatusChange = (value: string) => {
    // Se estiver mudando para qualquer status diferente de Pendente, verificar se tem prazo
    if (value !== 'Pendente' && !prazoEstimado) {
      toast.error('É necessário definir um prazo antes de alterar o status.');
      return;
    }
    
    setCurrentStatus(value as StatusType);
  };

  return {
    currentStatus,
    setCurrentStatus,
    prazoEstimado,
    setPrazoEstimado,
    handleStatusChange,
    handlePrazoChange,
    isPrazoDefinido: prazoEstimado !== ''
  };
};
