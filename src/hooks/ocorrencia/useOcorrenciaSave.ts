
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { OcorrenciaData } from '@/types/ocorrencia';
import { OcorrenciaState } from './ocorrenciaTypes';

export const useOcorrenciaSave = (
  id: string | undefined, 
  state: OcorrenciaState, 
  setState: (state: Partial<OcorrenciaState>) => void
) => {
  const { 
    currentStatus, 
    problemData, 
    prazoEstimado, 
    descricaoResolvido, 
    imagemResolvido 
  } = state;

  const handleSalvar = async () => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      if (currentStatus !== problemData?.status && !prazoEstimado) {
        toast.error('É necessário definir um prazo antes de alterar o status.');
        return;
      }

      // Verifica se precisa de descrição detalhada para status de Resolvido ou Informações Insuficientes
      if ((currentStatus === 'Resolvido' || currentStatus === 'Informações Insuficientes') && !descricaoResolvido.trim()) {
        toast.error(`É necessário fornecer ${currentStatus === 'Resolvido' ? 'detalhes da resolução' : 'orientações para o cidadão'}.`);
        return;
      }

      const updateData: Record<string, any> = {
        status: currentStatus,
        descricao_resolvido: descricaoResolvido
      };

      if (prazoEstimado) {
        updateData.prazo_estimado = prazoEstimado;
      }
      
      // Se o status for alterado para Resolvido, atualizamos a data de resolução
      // automaticamente na data atual
      if (currentStatus === 'Resolvido' && problemData?.status !== 'Resolvido') {
        // A data de atualização (updated_at) será atualizada automaticamente pelo trigger do banco
        toast.success('Problema resolvido! O contador de tempo foi parado.');
      }
      
      // Se tiver uma nova imagem para upload
      if (imagemResolvido) {
        // Converter imagem para base64 para salvar no banco
        const reader = new FileReader();
        reader.readAsDataURL(imagemResolvido);
        reader.onload = async () => {
          updateData.imagem_resolvido = reader.result;
          
          // Atualizar o banco de dados com todos os dados
          const { error } = await supabase
            .from('problemas')
            .update(updateData)
            .eq('id', id);

          if (error) {
            throw error;
          }

          // Atualizar o problemData localmente para refletir mudanças imediatamente
          if (problemData) {
            const updatedProblem = {
              ...problemData,
              ...updateData,
              prazo_estimado: prazoEstimado ? new Date(prazoEstimado).toISOString() : problemData.prazo_estimado,
              updated_at: currentStatus === 'Resolvido' && problemData.status !== 'Resolvido' 
                ? new Date().toISOString() 
                : problemData.updated_at
            };
            setState({ problemData: updatedProblem });
          }

          toast.success('Alterações salvas com sucesso!');
        };
      } else {
        // Se não houver nova imagem, apenas atualizamos os outros dados
        const { error } = await supabase
          .from('problemas')
          .update(updateData)
          .eq('id', id);

        if (error) {
          throw error;
        }

        // Atualizar o problemData localmente para refletir mudanças imediatamente
        if (problemData) {
          const updatedProblem = {
            ...problemData,
            ...updateData,
            prazo_estimado: prazoEstimado ? new Date(prazoEstimado).toISOString() : problemData.prazo_estimado,
            updated_at: currentStatus === 'Resolvido' && problemData.status !== 'Resolvido' 
              ? new Date().toISOString() 
              : problemData.updated_at
          };
          setState({ problemData: updatedProblem });
        }

        toast.success('Alterações salvas com sucesso!');
      }
    } catch (err: any) {
      console.error('Erro ao salvar alterações:', err);
      toast.error(`Erro ao salvar: ${err.message}`);
    }
  };

  return { handleSalvar };
};
