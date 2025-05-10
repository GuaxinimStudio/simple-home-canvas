
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GabineteDistribution {
  id: string;
  gabinete: string;
  count: number;
  percentage: number;
  color: string;
}

// Cores predefinidas para os gabinetes
const COLORS = ['#FF8585', '#9061F9', '#37A2B2', '#F5B74F', '#5D5FEF', '#3BA676'];

export const useGabineteDistribution = () => {
  const [distribution, setDistribution] = useState<GabineteDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        setIsLoading(true);
        
        // Buscar problemas com seus gabinetes
        const { data: problemas, error: problemasError } = await supabase
          .from('problemas')
          .select('gabinete_id');
        
        if (problemasError) throw problemasError;

        // Buscar todos os gabinetes
        const { data: gabinetes, error: gabinetesError } = await supabase
          .from('gabinetes')
          .select('id, gabinete');
        
        if (gabinetesError) throw gabinetesError;

        // Calcular contagem para cada gabinete
        const gabineteCounts: Record<string, number> = {};
        let totalAssigned = 0;

        problemas.forEach(problema => {
          if (problema.gabinete_id) {
            gabineteCounts[problema.gabinete_id] = (gabineteCounts[problema.gabinete_id] || 0) + 1;
            totalAssigned++;
          }
        });

        // Criar distribuição
        const distributionData = gabinetes
          .map((gabinete, index) => ({
            id: gabinete.id,
            gabinete: gabinete.gabinete,
            count: gabineteCounts[gabinete.id] || 0,
            percentage: totalAssigned > 0 ? ((gabineteCounts[gabinete.id] || 0) / totalAssigned) * 100 : 0,
            color: COLORS[index % COLORS.length]
          }))
          .filter(item => item.count > 0)
          .sort((a, b) => b.count - a.count);

        setDistribution(distributionData);
      } catch (error: any) {
        console.error('Erro ao buscar distribuição por gabinete:', error);
        toast.error(`Erro ao carregar distribuição por gabinete: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDistribution();
  }, []);

  return { distribution, isLoading };
};
