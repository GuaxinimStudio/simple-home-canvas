
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useOcorrenciaDetails } from '@/hooks/useOcorrenciaDetails';
import { DetalhesOcorrenciaLoading } from '@/components/ocorrencias/DetalhesOcorrenciaLoading';
import { DetalhesOcorrenciaErro } from '@/components/ocorrencias/DetalhesOcorrenciaErro';
import { DetalhesOcorrenciaLayout } from '@/components/ocorrencias/DetalhesOcorrenciaLayout';

const DetalhesOcorrencia: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  
  // Usar o hook useOcorrenciaDetails para gerenciar toda a lógica
  const ocorrenciaDetails = useOcorrenciaDetails(id);
  
  // Função para lidar com cliques na imagem
  const handleImageClick = () => {
    setImageModalOpen(true);
    console.log('Imagem clicada');
  };

  // Se estiver carregando, mostrar skeleton
  if (ocorrenciaDetails.isLoading) {
    return <DetalhesOcorrenciaLoading />;
  }

  // Se ocorrer um erro
  if (ocorrenciaDetails.error || !ocorrenciaDetails.problemData) {
    return <DetalhesOcorrenciaErro mensagemErro={ocorrenciaDetails.error} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <DetalhesOcorrenciaLayout
          ocorrencia={ocorrenciaDetails.problemData}
          currentStatus={ocorrenciaDetails.currentStatus}
          onStatusChange={ocorrenciaDetails.handleStatusChange}
          prazoEstimado={ocorrenciaDetails.prazoEstimado}
          onPrazoChange={ocorrenciaDetails.handlePrazoChange}
          selectedDepartamento={ocorrenciaDetails.selectedDepartamento}
          onDepartamentoChange={ocorrenciaDetails.setSelectedDepartamento}
          onSalvar={ocorrenciaDetails.handleSalvar}
          descricaoResolvido={ocorrenciaDetails.descricaoResolvido}
          onDescricaoResolvidoChange={ocorrenciaDetails.handleDescricaoResolvidoChange}
          onImagemResolvidoChange={ocorrenciaDetails.handleImagemResolvidoChange}
          imagemResolvidoPreview={ocorrenciaDetails.imagemResolvidoPreview}
          onEnviarRespostaCidadao={ocorrenciaDetails.handleEnviarRespostaCidadao}
          isSaved={ocorrenciaDetails.isSaved}
          respostaEnviada={ocorrenciaDetails.respostaEnviada}
          onImageClick={handleImageClick}
          resolvidoNoPrazo={ocorrenciaDetails.problemData.resolvido_no_prazo}
          isEnviandoResposta={ocorrenciaDetails.isEnviandoResposta}
        />
      </div>
    </div>
  );
};

export default DetalhesOcorrencia;
