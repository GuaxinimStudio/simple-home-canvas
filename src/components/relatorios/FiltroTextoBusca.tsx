
import React from 'react';
import { Input } from '@/components/ui/input';

interface FiltroTextoBuscaProps {
  textoBusca: string;
  onChange: (value: string) => void;
}

const FiltroTextoBusca: React.FC<FiltroTextoBuscaProps> = ({ textoBusca, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <span className="text-sm text-gray-600 mb-1 block">Busca por texto</span>
      <Input 
        placeholder="Pesquisar por descrição ou município..." 
        className="max-w-full"
        value={textoBusca || ''}
        onChange={handleChange}
      />
    </div>
  );
};

export default FiltroTextoBusca;
