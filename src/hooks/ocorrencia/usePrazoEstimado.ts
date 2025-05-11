
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const usePrazoEstimado = (initialPrazo: string = '') => {
  const [prazoEstimado, setPrazoEstimado] = useState<string>(initialPrazo);

  // Atualizar o prazo quando o valor inicial mudar
  useEffect(() => {
    if (initialPrazo) {
      setPrazoEstimado(initialPrazo);
    }
  }, [initialPrazo]);

  // Função para formatar o prazo no formato aceito pelo input date
  const formatPrazoToInput = (prazoString: string | null): string => {
    if (!prazoString) return '';
    try {
      return format(new Date(prazoString), 'yyyy-MM-dd');
    } catch (error) {
      console.error('Erro ao formatar prazo:', error);
      return '';
    }
  };

  const handlePrazoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrazo = e.target.value;
    setPrazoEstimado(newPrazo);
    console.log('Prazo alterado para:', newPrazo);
  };

  return {
    prazoEstimado,
    setPrazoEstimado,
    handlePrazoChange,
    isPrazoDefinido: prazoEstimado !== '',
    formatPrazoToInput
  };
};
