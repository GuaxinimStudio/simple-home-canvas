
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { OcorrenciaData } from '@/types/ocorrencia';
import { OcorrenciaState, isStatusRequireResponse } from './ocorrenciaTypes';

export const useOcorrenciaSave = (
  id: string | undefined, 
  state: OcorrenciaState, 
  setState: (state: Partial<OcorrenciaState>) => void
) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  const { 
    currentStatus, 
    problemData, 
    prazoEstimado, 
    descricaoResolvido, 
    imagemResolvido 
  } = state;

  // Quando carrega os dados iniciais, verifica se já está resolvido e salvo
  useState(() => {
    if (problemData && isStatusRequireResponse(problemData.status as any)) {
      setIsSaved(true);
    }
  });

  const handleSalvar = async () => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      if (currentStatus !== 'Pendente' && !prazoEstimado) {
        toast.error('É necessário definir um prazo antes de alterar o status.');
        return;
      }

      // Verifica se precisa de descrição detalhada para status de Resolvido ou Informações Insuficientes
      if (isStatusRequireResponse(currentStatus) && !descricaoResolvido?.trim()) {
        toast.error(`É necessário fornecer ${currentStatus === 'Resolvido' ? 'detalhes da resolução' : 'orientações para o cidadão'}.`);
        return;
      }

      // Se estiver resolvendo e não tiver imagem, exigir uma imagem
      if (currentStatus === 'Resolvido' && !imagemResolvido && !problemData?.imagem_resolvido) {
        toast.error('É necessário fornecer uma imagem de comprovação da resolução.');
        return;
      }

      console.log('Salvando alterações no banco de dados...');
      console.log('Status:', currentStatus);
      console.log('Prazo estimado:', prazoEstimado);
      
      const updateData: Record<string, any> = {
        status: currentStatus,
        prazo_estimado: prazoEstimado ? new Date(prazoEstimado).toISOString() : null
      };
      
      if (descricaoResolvido?.trim()) {
        updateData.descricao_resolvido = descricaoResolvido;
      }
      
      // Se o status for alterado para Resolvido ou Informações Insuficientes,
      // atualizamos a data de resolução automaticamente
      const shouldUpdateResolvedAt = isStatusRequireResponse(currentStatus) && 
        !isStatusRequireResponse(problemData?.status as any);
        
      if (shouldUpdateResolvedAt) {
        // A data de atualização (updated_at) será atualizada automaticamente pelo trigger do banco
        toast.success(
          currentStatus === 'Resolvido' 
            ? 'Problema resolvido! O contador de tempo foi parado.' 
            : 'Informações insuficientes registradas! O cidadão será notificado.'
        );
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
            console.error('Erro ao salvar alterações:', error);
            throw error;
          }

          // Atualizar o problemData localmente para refletir mudanças imediatamente
          if (problemData) {
            const updatedProblem = {
              ...problemData,
              ...updateData,
              prazo_estimado: prazoEstimado ? new Date(prazoEstimado).toISOString() : null,
              updated_at: shouldUpdateResolvedAt 
                ? new Date().toISOString() 
                : problemData.updated_at
            };
            setState({ problemData: updatedProblem });
            
            // Atualizar o estado de salvamento se foi resolvido ou informações insuficientes
            if (isStatusRequireResponse(currentStatus)) {
              setIsSaved(true);
            }
          }

          toast.success('Alterações salvas com sucesso!');
        };
      } else {
        // Se não houver nova imagem, apenas atualizamos os outros dados
        console.log('Dados de atualização:', updateData);
        
        const { error } = await supabase
          .from('problemas')
          .update(updateData)
          .eq('id', id);

        if (error) {
          console.error('Erro ao salvar alterações:', error);
          throw error;
        }

        // Atualizar o problemData localmente para refletir mudanças imediatamente
        if (problemData) {
          const updatedProblem = {
            ...problemData,
            ...updateData,
            updated_at: shouldUpdateResolvedAt 
              ? new Date().toISOString() 
              : problemData.updated_at
          };
          setState({ problemData: updatedProblem });
          
          // Atualizar o estado de salvamento se foi resolvido ou informações insuficientes
          if (isStatusRequireResponse(currentStatus)) {
            setIsSaved(true);
          }
        }

        toast.success('Alterações salvas com sucesso!');
      }
    } catch (err: any) {
      console.error('Erro ao salvar alterações:', err);
      toast.error(`Erro ao salvar: ${err.message}`);
    }
  };

  return { handleSalvar, isSaved };
};
