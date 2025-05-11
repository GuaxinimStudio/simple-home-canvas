
import { useState, useEffect } from 'react';
import { calculateElapsedTime } from '@/utils/dateUtils';
import { StatusType } from '@/types/ocorrencia';

/**
 * Hook que calcula e atualiza o tempo decorrido em tempo real (como um cronômetro)
 * @param createdAt Data de criação em formato ISO
 * @param endDate Data de finalização em formato ISO (opcional)
 * @param intervalMs Intervalo de atualização em milissegundos (padrão: 1000 = 1 segundo)
 * @param status Status atual da ocorrência (opcional)
 * @returns String formatada com o tempo decorrido
 */
export function useElapsedTimeCounter(
  createdAt: string, 
  endDate?: string | null,
  intervalMs: number = 1000,
  status?: StatusType
) {
  const [elapsedTime, setElapsedTime] = useState<string>(
    calculateElapsedTime(createdAt, endDate || undefined)
  );

  useEffect(() => {
    // Se tiver uma data de término ou o status for um dos finalizados (Resolvido ou Informações Insuficientes),
    // o contador está parado
    if (endDate || (status && (status === 'Resolvido' || status === 'Informações Insuficientes'))) {
      setElapsedTime(calculateElapsedTime(createdAt, endDate));
      return;
    }

    // Atualiza imediatamente e depois no intervalo definido
    const updateElapsedTime = () => {
      setElapsedTime(calculateElapsedTime(createdAt));
    };

    // Executa imediatamente
    updateElapsedTime();

    // Configura o intervalo para atualizações a cada segundo
    const interval = setInterval(updateElapsedTime, intervalMs);

    return () => clearInterval(interval);
  }, [createdAt, endDate, intervalMs, status]);

  return elapsedTime;
}
