
import { useState } from 'react';

export const usePrazoEstimado = (initialPrazo: string = '') => {
  const [prazoEstimado, setPrazoEstimado] = useState<string>(initialPrazo);

  const handlePrazoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrazoEstimado(e.target.value);
  };

  return {
    prazoEstimado,
    setPrazoEstimado,
    handlePrazoChange,
    isPrazoDefinido: prazoEstimado !== ''
  };
};
