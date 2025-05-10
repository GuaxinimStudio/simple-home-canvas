import React from 'react';
import { Card } from "@/components/ui/card";
import { Image, Clock, CheckCircle } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { OcorrenciaData } from '@/types/ocorrencia';
import { useElapsedTimeCounter } from '@/hooks/useElapsedTimeCounter';

interface OcorrenciaDetalhesProps {
  problemData: OcorrenciaData;
  onImageClick: () => void;
}

export const OcorrenciaDetalhes: React.FC<OcorrenciaDetalhesProps> = ({ 
  problemData,
  onImageClick
}) => {
  // Determinar se o problema está resolvido
  const isResolved = problemData.status === 'Resolvido';
  
  // Utilizamos o hook para atualizar o tempo a cada segundo como um cronômetro
  const elapsedTime = useElapsedTimeCounter(
    problemData.created_at,
    isResolved ? problemData.updated_at : null,
    1000 // Atualizar a cada 1 segundo para funcionar como cronômetro
  );

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium text-purple-600 mb-4 flex items-center">
        <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
        Detalhes da Solicitação
      </h2>
      <p className="text-sm text-gray-500 mb-6">Informações fornecidas pelo cidadão</p>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Registro Fotográfico</h3>
          {problemData.foto_url ? (
            <div className="bg-gray-100 h-48 rounded-md overflow-hidden">
              <div 
                className="w-full h-full cursor-pointer"
                onClick={onImageClick}
              >
                <div className="relative w-full h-full">
                  <img 
                    src={problemData.foto_url} 
                    alt={problemData.descricao}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity">
                    <Image className="w-8 h-8 text-white opacity-0 hover:opacity-100" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 h-40 rounded-md flex items-center justify-center text-gray-400">
              Sem foto disponível
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2">Descrição do Problema</h3>
          <p className="bg-gray-50 p-3 rounded text-gray-700 border">
            {problemData.descricao}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Contato</h3>
            <p className="text-gray-700">{problemData.telefone}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Data do Registro</h3>
            <p className="text-gray-700">{formatDate(problemData.created_at)}</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Tempo Decorrido</h3>
          <div className={`flex items-center ${isResolved ? "text-green-500" : "text-red-500"}`}>
            <Clock className="w-4 h-4 mr-2" />
            {isResolved ? (
              <span>
                Resolvido após {elapsedTime}
              </span>
            ) : (
              <span>
                Recebido há {elapsedTime}
              </span>
            )}
          </div>
        </div>

        {problemData.municipio && (
          <div>
            <h3 className="font-medium mb-2">Município</h3>
            <p className="text-gray-700">{problemData.municipio}</p>
          </div>
        )}
        
        {/* Seção de detalhes da resolução (quando resolvido) */}
        {isResolved && problemData.descricao_resolvido && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-medium mb-2 text-green-600">Detalhes da Resolução</h3>
            <p className="bg-green-50 p-3 rounded text-gray-700 border border-green-100">
              {problemData.descricao_resolvido}
            </p>
            
            {problemData.imagem_resolvida && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Comprovação da Resolução</h4>
                <div className="p-3 bg-green-50 rounded-md border border-green-100 flex items-center">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  <span className="text-gray-700">Imagem de comprovação anexada</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
