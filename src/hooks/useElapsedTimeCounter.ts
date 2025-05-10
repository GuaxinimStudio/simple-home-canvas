
import { useState, useEffect } from 'react';
import { calculateElapsedTime } from '@/utils/dateUtils';

/**
 * Hook que calcula e atualiza o tempo decorrido em tempo real
 * @param createdAt Data de criação em formato ISO
 * @param endDate Data de finalização em formato ISO (opcional)
 * @param intervalMs Intervalo de atualização em milissegundos (padrão: 60000 = 1 minuto)
 * @returns String formatada com o tempo decorrido
 */
export function useElapsedTimeCounter(
  createdAt: string, 
  endDate?: string | null, 
  intervalMs: number = 60000
) {
  const [elapsedTime, setElapsedTime] = useState<string>(
    calculateElapsedTime(createdAt, endDate || undefined)
  );

  useEffect(() => {
    // Se tiver uma data de término, o contador está parado
    if (endDate) {
      setElapsedTime(calculateElapsedTime(createdAt, endDate));
      return;
    }

    // Atualiza imediatamente e depois no intervalo definido
    const updateElapsedTime = () => {
      setElapsedTime(calculateElapsedTime(createdAt));
    };

    // Executa imediatamente
    updateElapsedTime();

    // Configura o intervalo para atualizações
    const interval = setInterval(updateElapsedTime, intervalMs);

    return () => clearInterval(interval);
  }, [createdAt, endDate, intervalMs]);

  return elapsedTime;
}
