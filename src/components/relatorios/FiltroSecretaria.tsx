
import React, { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FiltroSecretariaProps {
  secretaria: string | null;
  onChange: (value: string | null) => void;
}

const FiltroSecretaria: React.FC<FiltroSecretariaProps> = ({ secretaria, onChange }) => {
  const [secretarias, setSecretarias] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    const carregarSecretarias = async () => {
      try {
        const { data, error } = await supabase
          .from('problemas')
          .select('municipio')
          .not('municipio', 'is', null)
          .order('municipio');
        
        if (error) throw error;
        
        // Filtrar valores únicos
        const municipiosUnicos = Array.from(new Set(data.map(item => item.municipio)))
          .filter(Boolean)
          .map(municipio => ({
            value: municipio,
            label: municipio
          }));
        
        setSecretarias(municipiosUnicos);
      } catch (error: any) {
        console.error('Erro ao carregar municípios:', error);
        toast.error('Não foi possível carregar a lista de municípios');
      }
    };
    
    carregarSecretarias();
  }, []);

  const handleChange = (value: string) => {
    onChange(value || null);
  };

  return (
    <Select 
      value={secretaria || undefined} 
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Todos os municípios" />
      </SelectTrigger>
      <SelectContent>
        {secretarias.map((secretaria) => (
          <SelectItem key={secretaria.value} value={secretaria.value}>
            {secretaria.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FiltroSecretaria;
