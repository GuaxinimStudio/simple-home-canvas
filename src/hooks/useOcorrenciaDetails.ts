
import { useState, useCallback } from 'react';
import { StatusType, OcorrenciaData } from '@/types/ocorrencia';
import { OcorrenciaState, OcorrenciaActions } from './ocorrencia/ocorrenciaTypes';
import { useFetchOcorrencia } from './ocorrencia/useFetchOcorrencia';
import { useOcorrenciaStatus } from './ocorrencia/useOcorrenciaStatus';
import { useOcorrenciaImages } from './ocorrencia/useOcorrenciaImages';
import { useOcorrenciaSave } from './ocorrencia/useOcorrenciaSave';
import { useEnviarRespostaCidadao } from './ocorrencia/useEnviarRespostaCidadao';

export const useOcorrenciaDetails = (id: string | undefined): OcorrenciaState & OcorrenciaActions => {
  const [state, setState] = useState<OcorrenciaState>({
    currentStatus: 'Pendente',
    selectedDepartamento: '',
    prazoEstimado: '',
    isLoading: true,
    error: null,
    problemData: null,
    descricaoResolvido: '',
    imagemResolvido: null,
    imagemResolvidoPreview: null,
    imageModalOpen: false
  });

  // Função para atualizar o estado parcialmente
  const updateState = useCallback((newState: Partial<OcorrenciaState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  }, []);

  // Função para atualizar os dados do problema
  const updateProblemData = useCallback((data: Partial<OcorrenciaData>) => {
    setState(prevState => ({
      ...prevState,
      problemData: prevState.problemData ? { ...prevState.problemData, ...data } : null
    }));
  }, []);

  // Obter os dados iniciais da ocorrência
  useFetchOcorrencia(id, updateState);

  // Gerenciar status e prazo
  const { 
    currentStatus, 
    prazoEstimado, 
    handleStatusChange, 
    handlePrazoChange 
  } = useOcorrenciaStatus(state.currentStatus, state.prazoEstimado);
  
  // Gerenciar imagens
  const imageManager = useOcorrenciaImages(state.imagemResolvidoPreview);
  
  // Gerenciar salvamento de alterações
  const { handleSalvar } = useOcorrenciaSave(id, {
    ...state,
    currentStatus,
    prazoEstimado,
    imagemResolvido: imageManager.imagemResolvido,
    imagemResolvidoPreview: imageManager.imagemResolvidoPreview
  }, updateState);

  // Gerenciar envio de resposta ao cidadão
  const { handleEnviarRespostaCidadao } = useEnviarRespostaCidadao(
    state.problemData,
    updateProblemData
  );

  // Gerenciar a descrição resolvido
  const handleDescricaoResolvidoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateState({ descricaoResolvido: e.target.value });
  };

  // Gerenciar a seleção de departamento
  const setSelectedDepartamento = (value: React.SetStateAction<string>) => {
    const newValue = typeof value === 'function' ? value(state.selectedDepartamento) : value;
    updateState({ selectedDepartamento: newValue });
  };

  // Gerenciar o modal de imagem
  const setImageModalOpen = (value: React.SetStateAction<boolean>) => {
    const newValue = typeof value === 'function' ? value(state.imageModalOpen) : value;
    updateState({ imageModalOpen: newValue });
  };

  return {
    ...state,
    currentStatus,
    prazoEstimado,
    imagemResolvido: imageManager.imagemResolvido,
    imagemResolvidoPreview: imageManager.imagemResolvidoPreview,
    handleStatusChange,
    handlePrazoChange,
    handleSalvar,
    setSelectedDepartamento,
    handleDescricaoResolvidoChange,
    handleImagemResolvidoChange: imageManager.handleImagemResolvidoChange,
    setImageModalOpen,
    handleEnviarRespostaCidadao
  };
};
