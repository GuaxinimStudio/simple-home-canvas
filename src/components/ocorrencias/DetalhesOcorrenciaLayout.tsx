
import React from 'react';
import { OcorrenciaItem } from '@/types/ocorrencia';
import { OcorrenciaDetalhes } from './OcorrenciaDetalhes';
import { OcorrenciaGerenciamento } from './OcorrenciaGerenciamento';
import { DetalhesOcorrenciaHeader } from './DetalhesOcorrenciaHeader';

interface DetalhesOcorrenciaLayoutProps {
  ocorrencia: OcorrenciaItem;
  currentStatus: string;
  onStatusChange: (value: string) => void;
  prazoEstimado: string;
  onPrazoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedDepartamento: string;
  onDepartamentoChange: (value: string) => void;
  onSalvar: () => void;
  descricaoResolvido: string;
  onDescricaoResolvidoChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImagemResolvidoChange: (file: File | null) => void;
  imagemResolvidoPreview: string | null;
  onEnviarRespostaCidadao: () => Promise<void>;
  isSaved: boolean;
  respostaEnviada: boolean;
  onImageClick: () => void;
  resolvidoNoPrazo?: boolean;
}

export const DetalhesOcorrenciaLayout: React.FC<DetalhesOcorrenciaLayoutProps> = ({
  ocorrencia,
  currentStatus,
  onStatusChange,
  prazoEstimado,
  onPrazoChange,
  selectedDepartamento,
  onDepartamentoChange,
  onSalvar,
  descricaoResolvido,
  onDescricaoResolvidoChange,
  onImagemResolvidoChange,
  imagemResolvidoPreview,
  onEnviarRespostaCidadao,
  isSaved,
  respostaEnviada,
  onImageClick,
  resolvidoNoPrazo
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <DetalhesOcorrenciaHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OcorrenciaDetalhes 
            problemData={ocorrencia}
            onImageClick={onImageClick}
          />
        </div>
        
        <div className="space-y-6">
          <OcorrenciaGerenciamento 
            currentStatus={currentStatus as any}
            onStatusChange={onStatusChange}
            prazoEstimado={prazoEstimado}
            onPrazoChange={onPrazoChange}
            selectedDepartamento={selectedDepartamento}
            onDepartamentoChange={onDepartamentoChange}
            onSalvar={onSalvar}
            descricaoResolvido={descricaoResolvido}
            onDescricaoResolvidoChange={onDescricaoResolvidoChange}
            onImagemResolvidoChange={onImagemResolvidoChange}
            imagemResolvidoPreview={imagemResolvidoPreview}
            onEnviarRespostaCidadao={onEnviarRespostaCidadao}
            isSaved={isSaved}
            respostaEnviada={respostaEnviada}
            resolvidoNoPrazo={resolvidoNoPrazo}
          />
        </div>
      </div>
    </div>
  );
};
