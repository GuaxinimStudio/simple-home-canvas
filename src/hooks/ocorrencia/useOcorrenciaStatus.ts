
import { useState } from 'react';
import { StatusType } from '@/types/ocorrencia';
import { usePrazoEstimado } from './usePrazoEstimado';
import { useStatusValidation } from './useStatusValidation';

export const useOcorrenciaStatus = (
  initialStatus: StatusType = 'Pendente',
  initialPrazo: string = ''
) => {
  // Gerenciar o status atual
  const [currentStatus, setCurrentStatus] = useState<StatusType>(initialStatus);
  
  // Utilizar hooks específicos para gerenciamento de prazo e validações
  const { prazoEstimado, setPrazoEstimado, handlePrazoChange, isPrazoDefinido } = usePrazoEstimado(initialPrazo);
  const { validateStatusChange } = useStatusValidation();

  // Função para alterar o status com validação
  const handleStatusChange = (value: string) => {
    const isValid = validateStatusChange({ isPrazoDefinido });
    
    if (isValid) {
      setCurrentStatus(value as StatusType);
    }
  };

  return {
    currentStatus,
    setCurrentStatus,
    prazoEstimado,
    setPrazoEstimado,
    handleStatusChange,
    handlePrazoChange,
    isPrazoDefinido
  };
};
