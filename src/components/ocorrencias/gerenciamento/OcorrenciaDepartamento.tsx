
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface Gabinete {
  id: string;
  gabinete: string;
}

interface OcorrenciaDepartamentoProps {
  selectedDepartamento: string;
  onDepartamentoChange: (value: string) => void;
  isDisabled?: boolean;
}

export const OcorrenciaDepartamento: React.FC<OcorrenciaDepartamentoProps> = ({
  selectedDepartamento,
  onDepartamentoChange,
  isDisabled = false
}) => {
  const [gabinetes, setGabinetes] = useState<Gabinete[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar gabinetes disponíveis
  useEffect(() => {
    const fetchGabinetes = async () => {
      try {
        const { data, error } = await supabase
          .from('gabinetes')
          .select('id, gabinete')
          .order('gabinete');
          
        if (error) throw error;
        
        setGabinetes(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar gabinetes:', error);
        setLoading(false);
      }
    };
    
    fetchGabinetes();
  }, []);

  // Encontrar o nome do gabinete baseado no ID selecionado
  const getGabineteName = (id: string) => {
    const gabinete = gabinetes.find(g => g.id === id);
    return gabinete ? gabinete.gabinete : 'Selecione um gabinete';
  };
  
  return (
    <div>
      <h3 className="font-medium mb-2">Departamento Responsável</h3>
      <Select 
        value={selectedDepartamento} 
        onValueChange={onDepartamentoChange}
        disabled={isDisabled || loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um gabinete">
            {selectedDepartamento ? getGabineteName(selectedDepartamento) : 'Selecione um gabinete'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {gabinetes.map((gabinete) => (
            <SelectItem key={gabinete.id} value={gabinete.id}>
              {gabinete.gabinete}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
