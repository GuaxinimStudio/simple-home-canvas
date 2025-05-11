
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { OcorrenciaDetalhes } from '../components/ocorrencias/OcorrenciaDetalhes';
import { OcorrenciaGerenciamento } from '../components/ocorrencias/OcorrenciaGerenciamento';
import { useFetchOcorrencia } from '@/hooks/ocorrencia/useFetchOcorrencia';
import { useOcorrenciaStatus } from '@/hooks/ocorrencia/useOcorrenciaStatus';
import { usePrazoEstimado } from '@/hooks/ocorrencia/usePrazoEstimado';
import { useOcorrenciaImages } from '@/hooks/ocorrencia/useOcorrenciaImages';
import { useOcorrenciaSave } from '@/hooks/ocorrencia/useOcorrenciaSave';
import { useEnviarRespostaCidadao } from '@/hooks/ocorrencia/useEnviarRespostaCidadao';
import { StatusType, OcorrenciaData } from '@/types/ocorrencia';

const DetalhesOcorrencia: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estado local
  const [state, setState] = useState({
    selectedDepartamento: '',
    descricaoResolvido: '',
    isSaved: false,
    problemData: null as OcorrenciaData | null
  });
  
  // Função para atualizar o estado parcialmente
  const updateState = (newState: Partial<typeof state>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };
  
  // Função para atualizar problemData
  const updateProblemData = (data: Partial<OcorrenciaData>) => {
    setState(prevState => ({
      ...prevState,
      problemData: prevState.problemData ? { ...prevState.problemData, ...data } : null
    }));
  };
  
  // Definindo formatPrazoToInput antes de usar
  const formatPrazoToInput = (prazoString: string | null): string => {
    if (!prazoString) return '';
    try {
      return new Date(prazoString).toISOString().split('T')[0];
    } catch (error) {
      console.error('Erro ao formatar prazo:', error);
      return '';
    }
  };
  
  // Hook para buscar dados da ocorrência
  const { ocorrencia, isLoading, error, refetchOcorrencia } = useFetchOcorrencia(id, updateState);
  
  // Hook para gerenciar status da ocorrência
  const { currentStatus, setCurrentStatus, handleStatusChange } = useOcorrenciaStatus(
    ocorrencia?.status as StatusType
  );
  
  // Hook para gerenciar o prazo estimado
  const { prazoEstimado, setPrazoEstimado, handlePrazoChange } = usePrazoEstimado(
    ocorrencia?.prazo_estimado ? formatPrazoToInput(ocorrencia.prazo_estimado) : ''
  );
  
  // Hook para gerenciar imagens da ocorrência
  const { 
    handleImagemResolvidoChange, 
    imagemResolvidoPreview,
    uploadImagemResolvido
  } = useOcorrenciaImages(ocorrencia?.imagem_resolvido || null);
  
  // Hook para salvar alterações
  const { saveProblema, isSaving, isSaved } = useOcorrenciaSave(id || '');
  
  // Hook para enviar resposta ao cidadão
  const { handleEnviarRespostaCidadao } = useEnviarRespostaCidadao(ocorrencia, updateProblemData);
  
  // Atualizar estados quando os dados da ocorrência forem carregados
  useEffect(() => {
    if (ocorrencia) {
      updateState({
        selectedDepartamento: ocorrencia.gabinete_id || '',
        descricaoResolvido: ocorrencia.descricao_resolvido || '',
        isSaved: !!ocorrencia.descricao_resolvido && 
          (ocorrencia.status === 'Resolvido' || ocorrencia.status === 'Informações Insuficientes'),
        problemData: ocorrencia
      });
    }
  }, [ocorrencia]);
  
  // Função para salvar as alterações
  const handleSalvar = async () => {
    if (!id) return;
    
    // Upload da imagem de resolução, se houver
    let imagemResolvidoUrl = null;
    if (imagemResolvidoPreview) {
      imagemResolvidoUrl = await uploadImagemResolvido(id);
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
    updateState({ isSaved: true });
  };
  
  // Função para lidar com alterações no departamento
  const handleDepartamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ selectedDepartamento: e.target.value });
  };
  
  // Função para lidar com alterações na descrição da resolução
  const handleDescricaoResolvidoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateState({ descricaoResolvido: e.target.value });
  };

  // Se estiver carregando, mostrar skeleton
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se ocorrer um erro
  if (error || !ocorrencia) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">
              Erro ao carregar detalhes da ocorrência
            </h2>
            <p className="mt-2 text-gray-600">{error || 'Ocorrência não encontrada'}</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/problemas')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Problemas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Função para lidar com cliques na imagem
  const handleImageClick = () => {
    // Implementar lógica de visualização de imagem
    console.log('Imagem clicada');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho com botão de voltar */}
          <div className="mb-6 flex items-center justify-between">
            <Button 
              variant="ghost" 
              className="flex items-center text-gray-600 hover:text-gray-900"
              onClick={() => navigate('/problemas')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Problemas
            </Button>
          </div>
          
          {/* Conteúdo principal em grid responsiva */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna da esquerda - 2/3 da largura em desktop */}
            <div className="lg:col-span-2 space-y-6">
              <OcorrenciaDetalhes 
                problemData={ocorrencia}
                onImageClick={handleImageClick}
              />
            </div>
            
            {/* Coluna da direita - 1/3 da largura em desktop */}
            <div className="space-y-6">
              <OcorrenciaGerenciamento 
                currentStatus={currentStatus as StatusType}
                onStatusChange={handleStatusChange}
                prazoEstimado={prazoEstimado}
                onPrazoChange={handlePrazoChange}
                selectedDepartamento={state.selectedDepartamento}
                onDepartamentoChange={handleDepartamentoChange}
                onSalvar={handleSalvar}
                descricaoResolvido={state.descricaoResolvido}
                onDescricaoResolvidoChange={handleDescricaoResolvidoChange}
                onImagemResolvidoChange={handleImagemResolvidoChange}
                imagemResolvidoPreview={imagemResolvidoPreview}
                onEnviarRespostaCidadao={handleEnviarRespostaCidadao}
                isSaved={state.isSaved || isSaved}
                respostaEnviada={ocorrencia.resposta_enviada || false}
                resolvidoNoPrazo={ocorrencia.resolvido_no_prazo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesOcorrencia;
