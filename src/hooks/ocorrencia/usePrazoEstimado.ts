
import { useState, useEffect } from 'react';

export const usePrazoEstimado = (initialPrazo: string = '') => {
  const [prazoEstimado, setPrazoEstimado] = useState<string>(initialPrazo);

  // Atualizar o prazo quando o valor inicial mudar
  useEffect(() => {
    if (initialPrazo) {
      setPrazoEstimado(initialPrazo);
    }
  }, [initialPrazo]);

  const handlePrazoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrazoEstimado(e.target.value);
    console.log('Prazo alterado para:', e.target.value);
  };

  return {
    prazoEstimado,
    setPrazoEstimado,
    handlePrazoChange,
    isPrazoDefinido: prazoEstimado !== ''
  };
};
