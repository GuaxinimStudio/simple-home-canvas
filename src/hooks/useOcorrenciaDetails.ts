
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { StatusType } from '@/types/ocorrencia';

export const useOcorrenciaDetails = (id: string | undefined) => {
  const [currentStatus, setCurrentStatus] = useState<StatusType>('Pendente');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [problemData, setProblemData] = useState<any>(null);
  const [prazoEstimado, setPrazoEstimado] = useState<string>('');
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        setIsLoading(true);
        
        if (!id) {
          throw new Error('ID não fornecido');
        }

        const { data, error } = await supabase
          .from('problemas')
          .select(`
            *,
            gabinete:gabinetes(gabinete, municipio)
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setProblemData(data);
        
        if (data) {
          setCurrentStatus(data.status as StatusType);
          
          if (data.gabinete_id) {
            setSelectedDepartamento(data.gabinete?.gabinete || '');
          }
          
          if (data.prazo_estimado) {
            setPrazoEstimado(format(new Date(data.prazo_estimado), 'yyyy-MM-dd'));
          }
        }
      } catch (err: any) {
        console.error('Erro ao buscar detalhes do problema:', err);
        setError(err.message || 'Erro ao carregar dados');
        toast.error(`Erro ao carregar dados: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblemDetails();
  }, [id]);

  const handleStatusChange = (value: string) => {
    setCurrentStatus(value as StatusType);
  };

  const handlePrazoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrazoEstimado(e.target.value);
  };

  const handleSalvar = async () => {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      const updateData: Record<string, any> = {
        status: currentStatus,
      };

      if (prazoEstimado) {
        updateData.prazo_estimado = prazoEstimado;
      }

      const { error } = await supabase
        .from('problemas')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Alterações salvas com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar alterações:', err);
      toast.error(`Erro ao salvar: ${err.message}`);
    }
  };

  return {
    isLoading,
    error,
    problemData,
    currentStatus,
    selectedDepartamento,
    prazoEstimado,
    imageModalOpen,
    setImageModalOpen,
    handleStatusChange,
    handlePrazoChange,
    handleSalvar,
    setSelectedDepartamento
  };
};
