
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
    const newPrazo = e.target.value;
    setPrazoEstimado(newPrazo);
    console.log('Prazo alterado para:', newPrazo);
  };

  return {
    prazoEstimado,
    setPrazoEstimado,
    handlePrazoChange,
    isPrazoDefinido: prazoEstimado !== ''
  };
};
