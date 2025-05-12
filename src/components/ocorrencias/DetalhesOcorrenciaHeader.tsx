
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const DetalhesOcorrenciaHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};
