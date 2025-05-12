
import { useState, useCallback, useEffect } from 'react';
import { StatusType, OcorrenciaData } from '@/types/ocorrencia';
import { OcorrenciaState, OcorrenciaActions, isStatusRequireResponse } from './ocorrencia/ocorrenciaTypes';
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
    imageModalOpen: false,
    isSaved: false,
    respostaEnviada: false
  });

  // Função para atualizar o estado parcialmente
  const updateState = useCallback((newState: Partial<OcorrenciaState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  }, []);

  // Função para atualizar os dados do problema
  const updateProblemData = useCallback((data: Partial<OcorrenciaData>) => {
    setState(prevState => ({
      ...prevState,
      problemData: prevState.problemData ? { ...prevState.problemData, ...data } : null,
      // Atualizar respostaEnviada se estiver presente no problema
      respostaEnviada: data.resposta_enviada !== undefined ? data.resposta_enviada : prevState.respostaEnviada
    }));
  }, []);

  // Obter os dados iniciais da ocorrência
  const { ocorrencia, isLoading, error, refetchOcorrencia } = useFetchOcorrencia(id, updateState);

  // Gerenciar status e prazo
  const { 
    currentStatus, 
    prazoEstimado, 
    handleStatusChange, 
    handlePrazoChange 
  } = useOcorrenciaStatus(
    state.currentStatus,
    state.prazoEstimado
  );
  
  // Gerenciar imagens
  const imageManager = useOcorrenciaImages(state.imagemResolvidoPreview);
  
  // Gerenciar salvamento de alterações
  const { saveProblema, isSaving, isSaved, resetSavedState } = useOcorrenciaSave(id || '');

  // Verificar se já está salvo como resolvido e se a resposta já foi enviada quando carregar os dados
  useEffect(() => {
    if (state.problemData) {
      if (isStatusRequireResponse(state.problemData.status as StatusType)) {
        updateState({ isSaved: true });
      }
      if (state.problemData.resposta_enviada) {
        updateState({ respostaEnviada: true });
      }
    }
  }, [state.problemData, updateState]);

  // Gerenciar envio de resposta ao cidadão
  const { handleEnviarRespostaCidadao } = useEnviarRespostaCidadao(
    state.problemData,
    updateProblemData
  );

  // Adicionar função handleSalvar usando saveProblema
  const handleSalvar = async () => {
    if (!id) return;
    
    // Upload da imagem de resolução, se houver
    let imagemResolvidoUrl = null;
    if (imageManager.imagemResolvido && imageManager.uploadImagemResolvido) {
      imagemResolvidoUrl = await imageManager.uploadImagemResolvido(id);
    }
    
    // Salvar problema
    await saveProblema(
      currentStatus as StatusType,
      prazoEstimado,
      state.selectedDepartamento,
      state.descricaoResolvido,
      imagemResolvidoUrl
    );
    
    // Atualizar dados
    refetchOcorrencia();
  };

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
    isSaved: isSaved || (state.problemData && isStatusRequireResponse(state.problemData.status as StatusType)), 
    respostaEnviada: state.respostaEnviada || (state.problemData?.resposta_enviada === true),
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
