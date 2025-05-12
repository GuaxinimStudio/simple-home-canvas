
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OcorrenciaData } from '@/types/ocorrencia';
import { useWebhookEnvio } from '../notificacoes/useWebhookEnvio';

export const useEnviarRespostaCidadao = (
  problemData: OcorrenciaData | null,
  updateProblemData: (data: Partial<OcorrenciaData>) => void
) => {
  const [isEnviando, setIsEnviando] = useState(false);
  const { enviarParaWebhook } = useWebhookEnvio();

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

      // Preparar o texto da resposta ao cidadão
      const textoResposta = `Prezado cidadão, sua ocorrência "${problemData.descricao}" foi ${problemData.status.toLowerCase()}. ${problemData.descricao_resolvido}`;
      
      // Verificar se tem imagem de resolução
      const temImagem = !!problemData.imagem_resolvido;
      const tipoArquivo = temImagem ? 'image/jpeg' : null;
      
      // Enviar a resposta para o webhook (integração com plataforma de mensagem)
      if (problemData.telefone) {
        // Formatar o número de telefone se necessário (remover caracteres não numéricos)
        const telefoneFormatado = problemData.telefone.replace(/\D/g, '');
        
        // Enviar para o webhook com os dados da ocorrência
        await enviarParaWebhook(
          [telefoneFormatado], 
          textoResposta,
          temImagem,
          tipoArquivo
        );
      }

      // Atualizar o campo resposta_enviada na tabela problemas
      const { error } = await supabase
        .from('problemas')
        .update({
          resposta_enviada: true
        })
        .eq('id', problemData.id);

      if (error) throw error;

      toast.success('Resposta enviada com sucesso ao cidadão!');
      
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
