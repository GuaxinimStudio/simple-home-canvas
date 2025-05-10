
import React from 'react';
import { Card } from "@/components/ui/card";
import { Image } from 'lucide-react';
import { formatDate, calculateElapsedTime } from '@/utils/dateUtils';
import { OcorrenciaData } from '@/types/ocorrencia';

interface OcorrenciaDetalhesProps {
  problemData: OcorrenciaData;
  onImageClick: () => void;
}

export const OcorrenciaDetalhes: React.FC<OcorrenciaDetalhesProps> = ({ 
  problemData,
  onImageClick
}) => {
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
          <div className="flex items-center text-red-500">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {calculateElapsedTime(problemData.created_at)}
          </div>
        </div>

        {problemData.municipio && (
          <div>
            <h3 className="font-medium mb-2">Município</h3>
            <p className="text-gray-700">{problemData.municipio}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
