
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StatusType } from '@/types/ocorrencia';

export const useOcorrenciaSave = (id: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Função para calcular se a resolução foi feita no prazo
  const calcularResolvidoNoPrazo = (prazoEstimado: string | null): boolean | null => {
    if (!prazoEstimado) return null;
    
    const dataPrazo = new Date(prazoEstimado);
    const dataAtual = new Date();
    
    // Se o prazo é posterior à data atual, foi resolvido no prazo
    return dataPrazo >= dataAtual;
  };

  // Função para calcular os dias de atraso na resolução
  const calcularDiasAtraso = (prazoEstimado: string | null): number | null => {
    if (!prazoEstimado) return null;
    
    const dataPrazo = new Date(prazoEstimado);
    const dataAtual = new Date();
    
    // Se foi resolvido no prazo, não há atraso
    if (dataPrazo >= dataAtual) return 0;
    
    // Calcula a diferença em dias
    const diffTime = Math.abs(dataAtual.getTime() - dataPrazo.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const saveProblema = async (
    status: StatusType,
    prazoEstimado: string | null,
    departamento: string,
    descricaoResolvido: string,
    imagemResolvidoUrl: string | null
  ) => {
    setIsSaving(true);
    try {
      // Determina se o status representa uma finalização
      const isStatusFinalizado = status === 'Resolvido' || status === 'Informações Insuficientes';
      
      // Se o status indica finalização, calcula se foi resolvido no prazo
      let resolvidoNoPrazo = null;
      let diasAtrasoResolucao = null;
      
      if (isStatusFinalizado && prazoEstimado) {
        resolvidoNoPrazo = calcularResolvidoNoPrazo(prazoEstimado);
        diasAtrasoResolucao = calcularDiasAtraso(prazoEstimado);
      }

      const { error } = await supabase
        .from('problemas')
        .update({
          status,
          prazo_estimado: prazoEstimado,
          gabinete_id: departamento || null,
          descricao_resolvido: isStatusFinalizado ? descricaoResolvido : null,
          imagem_resolvido: isStatusFinalizado ? imagemResolvidoUrl : null,
          // Adicionamos os novos campos apenas se o status for de finalização
          resolvido_no_prazo: isStatusFinalizado ? resolvidoNoPrazo : null,
          dias_atraso_resolucao: isStatusFinalizado ? diasAtrasoResolucao : null
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Problema atualizado com sucesso!');
      setIsSaved(true);
    } catch (error: any) {
      console.error('Erro ao salvar problema:', error);
      toast.error(`Falha ao atualizar problema: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetSavedState = () => setIsSaved(false);

  return { saveProblema, isSaving, isSaved, resetSavedState };
};
