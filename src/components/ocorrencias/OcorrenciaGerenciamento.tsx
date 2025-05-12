
import React from 'react';
import { Card } from "@/components/ui/card";
import { StatusType } from '@/types/ocorrencia';
import { OcorrenciaStatus } from './gerenciamento/OcorrenciaStatus';
import { OcorrenciaPrazo } from './gerenciamento/OcorrenciaPrazo';
import { OcorrenciaDepartamento } from './gerenciamento/OcorrenciaDepartamento';
import { OcorrenciaDetalhesAdicionais } from './gerenciamento/OcorrenciaDetalhesAdicionais';
import { OcorrenciaAcoes } from './gerenciamento/OcorrenciaAcoes';
import { isStatusRequireResponse } from '@/hooks/ocorrencia/ocorrenciaTypes';

interface OcorrenciaGerenciamentoProps {
  currentStatus: StatusType;
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
  onEnviarRespostaCidadao?: () => void;
  isSaved?: boolean;
  respostaEnviada?: boolean;
  resolvidoNoPrazo?: boolean;
}

export const OcorrenciaGerenciamento: React.FC<OcorrenciaGerenciamentoProps> = ({
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
  isSaved = false,
  respostaEnviada = false,
  resolvidoNoPrazo
}) => {
  // Verifica se um prazo foi definido
  const isPrazoDefinido = prazoEstimado !== '';
  
  // Verifica se o status requer resposta
  const requiresResponse = isStatusRequireResponse(currentStatus);
  
  // Verifica se o status requer resposta e já foi finalizado completamente (salvo E resposta enviada)
  // Só desabilita os campos quando ambas as condições forem atendidas
  const isFormLocked = requiresResponse && isSaved && respostaEnviada;
  
  // Verifica se devemos mostrar os campos adicionais
  const showAdditionalFields = requiresResponse;
  
  // Verifica se a descrição é válida (preenchida quando obrigatória)
  const isDescricaoValida = !requiresResponse || (descricaoResolvido.trim() !== '');
  
  // Verifica se a imagem é válida (obrigatória apenas para status Resolvido)
  const isImagemValida = currentStatus !== 'Resolvido' || imagemResolvidoPreview !== null;
  
  // Calcula se o formulário é válido para habilitar o botão de salvar
  // Modificado: Garante que para status "Resolvido", tanto a descrição quanto a imagem são obrigatórias
  const isFormValid = 
    (!requiresResponse) || 
    (currentStatus === 'Resolvido' ? (isDescricaoValida && isImagemValida) : isDescricaoValida);
  
  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Gerenciamento</h2>
      <p className="text-sm text-gray-500 mb-6">
        Atualize as informações da ocorrência conforme o andamento.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Situação Atual</h3>
          <div className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full inline-flex items-center text-sm font-medium">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {currentStatus}
          </div>
        </div>

        <OcorrenciaStatus 
          currentStatus={currentStatus}
          onStatusChange={onStatusChange}
          isPrazoDefinido={isPrazoDefinido}
          isResolvido={isFormLocked}
        />

        <OcorrenciaPrazo 
          prazoEstimado={prazoEstimado}
          onPrazoChange={onPrazoChange}
          isResolvido={isFormLocked}
          resolvidoNoPrazo={resolvidoNoPrazo}
        />

        <OcorrenciaDepartamento 
          selectedDepartamento={selectedDepartamento}
          onDepartamentoChange={onDepartamentoChange}
          isDisabled={isFormLocked}
        />

        {showAdditionalFields && (
          <OcorrenciaDetalhesAdicionais 
            currentStatus={currentStatus}
            descricaoResolvido={descricaoResolvido}
            onDescricaoResolvidoChange={onDescricaoResolvidoChange}
            imagemResolvidoPreview={imagemResolvidoPreview}
            onImagemResolvidoChange={onImagemResolvidoChange}
            isResolvido={isFormLocked}
            isRequired={true}
            isDescricaoValida={isDescricaoValida}
            isImagemValida={isImagemValida}
          />
        )}

        <OcorrenciaAcoes 
          currentStatus={currentStatus}
          isSalvo={isSaved}
          onSalvar={onSalvar}
          onEnviarRespostaCidadao={onEnviarRespostaCidadao}
          respostaEnviada={respostaEnviada}
          isFormValid={isFormValid}
          isPrazoDefinido={isPrazoDefinido}
        />
      </div>
    </Card>
  );
};
