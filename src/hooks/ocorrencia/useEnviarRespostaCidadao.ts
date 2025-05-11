
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
      toast.loading('Enviando informações ao cidadão...');
      
      // Preparar os dados para enviar ao webhook
      const webhookUrl = 'https://hook.us1.make.com/4ktz9s09wo5kt8a4fhhsb46pudkwan6u';
      const webhookData = {
        valor_1_foto_problema: problemData.foto_url || '',
        valor_2_descricao_problema: problemData.descricao || '',
        valor_3_foto_resolucao: problemData.imagem_resolvido || '',
        valor_4_descricao_resolucao: problemData.descricao_resolvido || '',
        valor_5_telefone: problemData.telefone || ''
      };

      console.log('Dados sendo enviados para o webhook:', webhookData);
      
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
      
      const mensagemSucesso = problemData.status === 'Informações Insuficientes' 
        ? 'Orientações enviadas com sucesso ao cidadão!' 
        : 'Resposta enviada com sucesso ao cidadão!';
        
      toast.success(mensagemSucesso);
      
      return true; // Adicionando retorno para indicar sucesso
    } catch (err: any) {
      console.error('Erro ao enviar resposta ao cidadão:', err);
      toast.dismiss();
      toast.error(`Erro ao enviar informações: ${err.message}`);
      return false; // Adicionando retorno para indicar falha
    }
  };

  return { 
    handleEnviarRespostaCidadao,
    enviarResposta: handleEnviarRespostaCidadao, // Alias para compatibilidade
    isEnviando: false // Propriedade para compatibilidade
  };
};
