
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useOcorrenciaDetails } from '@/hooks/useOcorrenciaDetails';
import { OcorrenciaDetalhes } from '@/components/ocorrencias/OcorrenciaDetalhes';
import { OcorrenciaGerenciamento } from '@/components/ocorrencias/OcorrenciaGerenciamento';
import { ProblemImageModal } from '@/components/problemas/ProblemImageModal';

const DetalhesOcorrencia: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    isLoading,
    error,
    problemData,
    currentStatus,
    selectedDepartamento,
    prazoEstimado,
    imageModalOpen,
    descricaoResolvido,
    imagemResolvidoPreview,
    setImageModalOpen,
    handleStatusChange,
    handlePrazoChange,
    handleSalvar,
    setSelectedDepartamento,
    handleDescricaoResolvidoChange,
    handleImagemResolvidoChange
  } = useOcorrenciaDetails(id);

  const handleVoltar = () => {
    navigate('/problemas');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-green-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error || !problemData) {
    return (
      <div className="flex h-screen bg-green-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <button onClick={handleVoltar} className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Voltar para Problemas</span>
              </button>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-sm">
              <h1 className="text-xl text-red-500">Erro ao carregar detalhes da ocorrência</h1>
              <p className="text-gray-600 mt-2">{error || 'Ocorrência não encontrada'}</p>
              <button 
                onClick={handleVoltar}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Voltar para a lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-green-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Cabeçalho */}
          <div className="flex items-center mb-6">
            <button 
              onClick={handleVoltar}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Voltar para Problemas</span>
            </button>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h1 className="text-2xl font-semibold text-gray-800">Detalhes da Ocorrência</h1>
            <p className="text-gray-600 mt-1">
              Acompanhe e gerencie os detalhes deste chamado para melhor atender às necessidades do cidadão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna da esquerda - Detalhes da solicitação */}
            <OcorrenciaDetalhes 
              problemData={problemData}
              onImageClick={() => setImageModalOpen(true)}
            />

            {/* Coluna da direita - Gerenciamento */}
            <OcorrenciaGerenciamento
              currentStatus={currentStatus}
              onStatusChange={handleStatusChange}
              prazoEstimado={prazoEstimado}
              onPrazoChange={handlePrazoChange}
              selectedDepartamento={selectedDepartamento}
              onDepartamentoChange={(e) => setSelectedDepartamento(e.target.value)}
              onSalvar={handleSalvar}
              descricaoResolvido={descricaoResolvido}
              onDescricaoResolvidoChange={handleDescricaoResolvidoChange}
              onImagemResolvidoChange={handleImagemResolvidoChange}
              imagemResolvidoPreview={imagemResolvidoPreview}
            />
          </div>
        </div>
      </div>

      {problemData.foto_url && (
        <ProblemImageModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          imageUrl={problemData.foto_url}
          description={problemData.descricao}
        />
      )}
    </div>
  );
};

export default DetalhesOcorrencia;
