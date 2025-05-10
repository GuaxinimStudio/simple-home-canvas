
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { OcorrenciaData } from '@/types/ocorrencia';

export const useEnviarRespostaCidadao = (
  problemData: OcorrenciaData | null,
  updateProblemData: (data: Partial<OcorrenciaData>) => void
) => {
  const handleEnviarRespostaCidadao = async () => {
    try {
      if (!problemData) {
        throw new Error('Dados do problema não disponíveis');
      }
      
      // Exibir toast de loading
      toast.loading('Enviando resposta ao cidadão...');
      
      // Preparar os dados para enviar ao webhook
      const webhookUrl = 'https://hook.us1.make.com/4ktz9s09wo5kt8a4fhhsb46pudkwan6u';
      const webhookData = {
        id: problemData.id,
        telefone: problemData.telefone,
        descricao: problemData.descricao,
        descricao_resolvido: problemData.descricao_resolvido,
        municipio: problemData.municipio,
        created_at: problemData.created_at,
        updated_at: problemData.updated_at,
        imagem_resolvido: problemData.imagem_resolvido
      };
      
      // Enviar para o webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar resposta: ${response.statusText}`);
      }
      
      // Atualizar o status de resposta enviada no banco de dados
      const { error } = await supabase
        .from('problemas')
        .update({ resposta_enviada: true })
        .eq('id', problemData.id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar localmente também
      updateProblemData({
        resposta_enviada: true
      });
      
      // Exibir toast de sucesso
      toast.dismiss();
      toast.success('Resposta enviada com sucesso ao cidadão!');
      
    } catch (err: any) {
      console.error('Erro ao enviar resposta ao cidadão:', err);
      toast.dismiss();
      toast.error(`Erro ao enviar resposta: ${err.message}`);
    }
  };

  return { handleEnviarRespostaCidadao };
};
