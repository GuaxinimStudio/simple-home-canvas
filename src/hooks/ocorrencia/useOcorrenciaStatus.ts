
import { useState } from 'react';
import { toast } from 'sonner';
import { StatusType, OcorrenciaData } from '@/types/ocorrencia';

export const useOcorrenciaStatus = (
  initialStatus: StatusType = 'Pendente',
  initialPrazo: string = ''
) => {
  const [currentStatus, setCurrentStatus] = useState<StatusType>(initialStatus);
  const [prazoEstimado, setPrazoEstimado] = useState<string>(initialPrazo);

  const handleStatusChange = (value: string) => {
    if (!prazoEstimado) {
      toast.error('É necessário definir um prazo antes de alterar o status.');
      return;
    }
    setCurrentStatus(value as StatusType);
  };

  const handlePrazoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrazoEstimado(e.target.value);
  };

  return {
    currentStatus,
    setCurrentStatus,
    prazoEstimado,
    setPrazoEstimado,
    handleStatusChange,
    handlePrazoChange,
  };
};
