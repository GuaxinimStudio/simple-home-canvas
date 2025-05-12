
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { OcorrenciaData } from '@/types/ocorrencia';
import { OcorrenciaState } from './ocorrenciaTypes';

export const useFetchOcorrencia = (id: string | undefined, setState: (state: Partial<OcorrenciaState>) => void) => {
  const [ocorrencia, setOcorrencia] = useState<OcorrenciaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblemDetails = async () => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      // Tentamos primeiro buscar apenas dados básicos do problema, sem joins que podem causar recursão
      const { data: basicData, error: basicError } = await supabase
        .from('problemas')
        .select('*')
        .eq('id', id)
        .single();

      if (basicError) {
        // Se houver erro na consulta básica, não podemos continuar
        throw basicError;
      }

      // Se temos os dados básicos, podemos usá-los
      let fullData = {
        ...basicData,
        gabinete: null
      } as OcorrenciaData;
      
      // Agora tentamos buscar o gabinete separadamente se temos um gabinete_id
      if (basicData.gabinete_id) {
        try {
          const { data: gabineteData, error: gabineteError } = await supabase
            .from('gabinetes')
            .select('id, gabinete, municipio')
            .eq('id', basicData.gabinete_id)
            .single();
            
          if (!gabineteError && gabineteData) {
            // Se conseguimos os dados do gabinete, adicionamos ao objeto de dados
            fullData = {
              ...basicData,
              gabinete: {
                id: gabineteData.id,
                gabinete: gabineteData.gabinete
              }
            } as OcorrenciaData;
          }
        } catch (gabErr) {
          console.warn('Erro ao buscar gabinete, continuando com dados básicos:', gabErr);
          // Não interrompemos o fluxo, continuamos com os dados básicos
        }
      }

      setOcorrencia(fullData);
      
      setState({
        problemData: fullData,
        currentStatus: fullData.status as OcorrenciaData['status'],
        selectedDepartamento: fullData.gabinete_id || '',
        prazoEstimado: fullData.prazo_estimado ? format(new Date(fullData.prazo_estimado), 'yyyy-MM-dd') : '',
        descricaoResolvido: fullData.descricao_resolvido || '',
        imagemResolvidoPreview: fullData.imagem_resolvido || null,
        isLoading: false
      });
      
      setIsLoading(false);
      
    } catch (err: any) {
      console.error('Erro ao buscar detalhes do problema:', err);
      
      // Verificamos se é o erro específico de recursão infinita
      if (err.message?.includes('infinite recursion detected')) {
        setError('Erro de permissão no banco de dados. Contate o administrador.');
        toast.error('Erro de permissão no banco de dados.');
      } else {
        setError(err.message || 'Erro ao carregar dados');
        toast.error(`Erro ao carregar dados: ${err.message}`);
      }
      
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProblemDetails();
  }, [id, setState]);
  
  const refetchOcorrencia = () => {
    setIsLoading(true);
    fetchProblemDetails();
  };

  return { ocorrencia, isLoading, error, refetchOcorrencia };
};
