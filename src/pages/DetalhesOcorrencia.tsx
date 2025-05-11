
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
import { StatusType } from '@/types/ocorrencia';

const DetalhesOcorrencia: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [descricaoResolvido, setDescricaoResolvido] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  // Hook para buscar dados da ocorrência
  const { ocorrencia, isLoading, error, refetchOcorrencia } = useFetchOcorrencia(id || '');

  // Hook para gerenciar status da ocorrência
  const { currentStatus, setCurrentStatus, statusHistory } = useOcorrenciaStatus(ocorrencia?.status as StatusType);
  
  // Hook para gerenciar o prazo estimado
  const { prazoEstimado, setPrazoEstimado, formatPrazoToInput } = usePrazoEstimado(ocorrencia?.prazo_estimado);
  
  // Hook para gerenciar imagens da ocorrência
  const { 
    handleImagemResolvidoChange, 
    imagemResolvidoPreview, 
    uploadImagemResolvido 
  } = useOcorrenciaImages();

  // Hook para salvar alterações
  const { saveProblema, isSaving } = useOcorrenciaSave(id || '');
  
  // Hook para enviar resposta ao cidadão
  const { enviarResposta, isEnviando } = useEnviarRespostaCidadao(id || '');

  // Atualizar estados quando os dados da ocorrência forem carregados
  useEffect(() => {
    if (ocorrencia) {
      setSelectedDepartamento(ocorrencia.gabinete_id || '');
      setDescricaoResolvido(ocorrencia.descricao_resolvido || '');
      setPrazoEstimado(formatPrazoToInput(ocorrencia.prazo_estimado));
      setIsSaved(!!ocorrencia.descricao_resolvido && 
        (ocorrencia.status === 'Resolvido' || ocorrencia.status === 'Informações Insuficientes'));
    }
  }, [ocorrencia]);

  // Função para lidar com alterações no departamento
  const handleDepartamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDepartamento(e.target.value);
  };

  // Função para lidar com alterações na descrição da resolução
  const handleDescricaoResolvidoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescricaoResolvido(e.target.value);
  };

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
      selectedDepartamento,
      descricaoResolvido,
      imagemResolvidoUrl
    );
    
    // Atualizar dados
    refetchOcorrencia();
    setIsSaved(true);
  };

  // Função para enviar resposta ao cidadão
  const handleEnviarRespostaCidadao = async () => {
    if (!id) return;
    
    await enviarResposta(
      descricaoResolvido,
      imagemResolvidoPreview,
      ocorrencia?.telefone || ''
    );
    
    // Atualizar dados
    refetchOcorrencia();
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
                descricao={ocorrencia.descricao}
                fotoUrl={ocorrencia.foto_url}
                telefone={ocorrencia.telefone}
                dataRecebimento={ocorrencia.created_at}
                municipio={ocorrencia.municipio}
                status={ocorrencia.status as StatusType}
                prazoEstimado={ocorrencia.prazo_estimado}
                statusHistory={statusHistory}
                descricaoResolvido={ocorrencia.descricao_resolvido}
                imagemResolvido={ocorrencia.imagem_resolvido}
                gabinete={ocorrencia.gabinete?.gabinete || 'Não atribuído'}
                resolvidoNoPrazo={ocorrencia.resolvido_no_prazo}
                diasAtraso={ocorrencia.dias_atraso_resolucao}
              />
            </div>
            
            {/* Coluna da direita - 1/3 da largura em desktop */}
            <div className="space-y-6">
              <OcorrenciaGerenciamento 
                currentStatus={currentStatus as StatusType}
                onStatusChange={setCurrentStatus}
                prazoEstimado={prazoEstimado}
                onPrazoChange={(e) => setPrazoEstimado(e.target.value)}
                selectedDepartamento={selectedDepartamento}
                onDepartamentoChange={handleDepartamentoChange}
                onSalvar={handleSalvar}
                descricaoResolvido={descricaoResolvido}
                onDescricaoResolvidoChange={handleDescricaoResolvidoChange}
                onImagemResolvidoChange={handleImagemResolvidoChange}
                imagemResolvidoPreview={imagemResolvidoPreview}
                onEnviarRespostaCidadao={handleEnviarRespostaCidadao}
                isSaved={isSaved}
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
