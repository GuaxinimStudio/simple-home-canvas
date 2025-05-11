
import React from 'react';
import { Check } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface ProblemFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  totalProblems: number;
}

export const ProblemFilters: React.FC<ProblemFiltersProps> = ({ 
  selectedStatus, 
  setSelectedStatus, 
  totalProblems 
}) => {
  return (
    <div className="flex gap-4">
      <div className="w-64">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-600" />
                Todos os status
              </div>
            </SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Em andamento">Em andamento</SelectItem>
            <SelectItem value="Resolvido">Resolvido</SelectItem>
            <SelectItem value="Informações Insuficientes">Informações Insuficientes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-64">
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Todas as secretarias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as secretarias</SelectItem>
            <SelectItem value="obras">Secretaria de Obras</SelectItem>
            <SelectItem value="saude">Secretaria de Saúde</SelectItem>
            <SelectItem value="educacao">Secretaria de Educação</SelectItem>
            <SelectItem value="meio-ambiente">Secretaria de Meio Ambiente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 text-right">
        <span className="text-gray-600">{totalProblems} problema(s) encontrado(s)</span>
      </div>
    </div>
  );
};
