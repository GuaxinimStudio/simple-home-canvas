
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OcorrenciaData } from '@/types/ocorrencia';

export const useEnviarRespostaCidadao = (
  problemData: OcorrenciaData | null,
  updateProblemData: (data: Partial<OcorrenciaData>) => void
) => {
  const [isEnviando, setIsEnviando] = useState(false);

  const handleEnviarRespostaCidadao = async (): Promise<void> => {
    if (!problemData || !problemData.id) {
      toast.error('Dados da ocorrência não disponíveis');
      return;
    }

    if (!problemData.descricao_resolvido) {
      toast.error('É necessário preencher a descrição da resolução antes de enviar');
      return;
    }

    try {
      setIsEnviando(true);

      // Atualizar o campo resposta_enviada na tabela problemas
      const { error } = await supabase
        .from('problemas')
        .update({
          resposta_enviada: true
        })
        .eq('id', problemData.id);

      if (error) throw error;

      // Aqui seria o lugar para adicionar a integração com serviço de mensagens
      // para enviar SMS ou WhatsApp para o cidadão
      toast.success('Resposta enviada com sucesso!');
      
      // Atualizar os dados locais
      updateProblemData({ resposta_enviada: true });
    } catch (error: any) {
      console.error('Erro ao enviar resposta ao cidadão:', error);
      toast.error(`Falha ao enviar resposta: ${error.message}`);
    } finally {
      setIsEnviando(false);
    }
  };

  return { 
    handleEnviarRespostaCidadao,
    isEnviando
  };
};
