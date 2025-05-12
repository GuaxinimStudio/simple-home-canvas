
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DetalhesOcorrenciaErroProps {
  mensagemErro: string | null;
}

export const DetalhesOcorrenciaErro: React.FC<DetalhesOcorrenciaErroProps> = ({ mensagemErro }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Erro ao carregar detalhes da ocorrência
          </h2>
          <p className="mt-2 text-gray-600">{mensagemErro || 'Ocorrência não encontrada'}</p>
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
};
