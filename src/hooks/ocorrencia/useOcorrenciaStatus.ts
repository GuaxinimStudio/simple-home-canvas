
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { StatusType } from '@/types/ocorrencia';
import { usePrazoEstimado } from './usePrazoEstimado';
import { useStatusValidation } from './useStatusValidation';

export const useOcorrenciaStatus = (
  initialStatus: StatusType = 'Pendente',
  initialPrazo: string = ''
) => {
  // Gerenciar o status atual
  const [currentStatus, setCurrentStatus] = useState<StatusType>(initialStatus);
  const [statusHistory, setStatusHistory] = useState<Array<{status: StatusType, date: string}>>([]);
  
  // Utilizar hooks específicos para gerenciamento de prazo
  const { prazoEstimado, setPrazoEstimado, handlePrazoChange, isPrazoDefinido } = usePrazoEstimado(initialPrazo);
  const { validateStatusChange } = useStatusValidation();
  
  // Atualizar o status quando o valor inicial mudar
  useEffect(() => {
    if (initialStatus) {
      setCurrentStatus(initialStatus);
      // Inicializa o histórico com o status atual
      setStatusHistory([{
        status: initialStatus,
        date: new Date().toISOString()
      }]);
    }
  }, [initialStatus]);

  // Função para alterar o status com validação
  const handleStatusChange = (value: string) => {
    // Se estiver mudando para qualquer status diferente de Pendente, verificar se tem prazo
    if (value !== 'Pendente' && !isPrazoDefinido) {
      toast.error('É necessário definir um prazo antes de alterar o status.');
      return;
    }
    
    setCurrentStatus(value as StatusType);
    
    // Adicionar ao histórico
    setStatusHistory(prev => [
      ...prev, 
      {
        status: value as StatusType,
        date: new Date().toISOString()
      }
    ]);
    
    console.log('Status alterado para:', value);
  };

  return {
    currentStatus,
    setCurrentStatus,
    statusHistory,
    prazoEstimado,
    setPrazoEstimado,
    handleStatusChange,
    handlePrazoChange,
    isPrazoDefinido
  };
};
