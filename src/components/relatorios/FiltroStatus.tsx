
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltroStatusProps {
  status: string | null;
  onChange: (value: string | null) => void;
}

const FiltroStatus: React.FC<FiltroStatusProps> = ({ status, onChange }) => {
  const handleChange = (value: string) => {
    onChange(value || null);
  };

  return (
    <Select 
      value={status || undefined} 
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Todos os status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pendente">Pendente</SelectItem>
        <SelectItem value="Em andamento">Em andamento</SelectItem>
        <SelectItem value="Resolvido">Resolvido</SelectItem>
        <SelectItem value="Informações Insuficientes">Informações Insuficientes</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FiltroStatus;
