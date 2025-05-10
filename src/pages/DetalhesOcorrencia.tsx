
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image } from 'lucide-react';
import { Card } from "@/components/ui/card";
import Sidebar from '../components/Sidebar';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { ProblemImageModal } from '@/components/problemas/ProblemImageModal';
import { ptBR } from 'date-fns/locale';

type StatusType = 'Pendente' | 'Em andamento' | 'Resolvido' | 'Informações Insuficientes';

const DetalhesOcorrencia: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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

  const handleVoltar = () => {
    navigate('/problemas');
  };

  const handleStatusChange = (value: string) => {
    setCurrentStatus(value as StatusType);
  };

  const handlePrazoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrazoEstimado(e.target.value);
  };

  const calculateElapsedTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: ptBR });
    } catch (err) {
      return "Data inválida";
    }
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

  if (isLoading) {
    return (
      <div className="flex h-screen bg-green-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error || !problemData) {
    return (
      <div className="flex h-screen bg-green-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <button onClick={handleVoltar} className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Voltar para Problemas</span>
              </button>
            </div>
            <Card className="p-6 text-center">
              <h1 className="text-xl text-red-500">Erro ao carregar detalhes da ocorrência</h1>
              <p className="text-gray-600 mt-2">{error || 'Ocorrência não encontrada'}</p>
              <Button onClick={handleVoltar} className="mt-4">
                Voltar para a lista
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-green-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Cabeçalho */}
          <div className="flex items-center mb-6">
            <button 
              onClick={handleVoltar}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Voltar para Problemas</span>
            </button>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h1 className="text-2xl font-semibold text-gray-800">Detalhes da Ocorrência</h1>
            <p className="text-gray-600 mt-1">
              Acompanhe e gerencie os detalhes deste chamado para melhor atender às necessidades do cidadão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna da esquerda */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-purple-600 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                Detalhes da Solicitação
              </h2>
              <p className="text-sm text-gray-500 mb-6">Informações fornecidas pelo cidadão</p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Registro Fotográfico</h3>
                  {problemData.foto_url ? (
                    <div className="bg-gray-100 h-48 rounded-md overflow-hidden">
                      <div 
                        className="w-full h-full cursor-pointer"
                        onClick={() => setImageModalOpen(true)}
                      >
                        <div className="relative w-full h-full">
                          <img 
                            src={problemData.foto_url} 
                            alt={problemData.descricao}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity">
                            <Image className="w-8 h-8 text-white opacity-0 hover:opacity-100" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 h-40 rounded-md flex items-center justify-center text-gray-400">
                      Sem foto disponível
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Descrição do Problema</h3>
                  <p className="bg-gray-50 p-3 rounded text-gray-700 border">
                    {problemData.descricao}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Contato</h3>
                    <p className="text-gray-700">{problemData.telefone}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Data do Registro</h3>
                    <p className="text-gray-700">{formatDate(problemData.created_at)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Tempo Decorrido</h3>
                  <div className="flex items-center text-red-500">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {calculateElapsedTime(problemData.created_at)}
                  </div>
                </div>

                {problemData.municipio && (
                  <div>
                    <h3 className="font-medium mb-2">Município</h3>
                    <p className="text-gray-700">{problemData.municipio}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Coluna da direita */}
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Gerenciamento</h2>
              <p className="text-sm text-gray-500 mb-6">
                Atualize as informações da ocorrência conforme o andamento.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Situação Atual</h3>
                  <div className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full inline-flex items-center text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    {currentStatus}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium mb-2">Atualizar Situação</h3>
                    <span className="text-orange-500 text-xs">Define um prazo estimado para poder alterar o status.</span>
                  </div>
                  
                  <RadioGroup 
                    value={currentStatus} 
                    onValueChange={handleStatusChange}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Pendente" id="pendente" />
                      <label htmlFor="pendente" className="text-sm font-medium">Pendente</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Em andamento" id="em-andamento" />
                      <label htmlFor="em-andamento" className="text-sm font-medium">Em andamento</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Resolvido" id="resolvido" />
                      <label htmlFor="resolvido" className="text-sm font-medium">Resolvido</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Informações Insuficientes" id="insuficiente" />
                      <label htmlFor="insuficiente" className="text-sm font-medium">Informações Insuficientes</label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium mb-2">Prazo Estimado de Resolução</h3>
                    <span className="text-green-500 text-xs">Alteração: SG</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="date" 
                      className="w-full border rounded-md px-4 py-2.5 text-gray-700"
                      placeholder="Selecione um prazo"
                      value={prazoEstimado}
                      onChange={handlePrazoChange}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium mb-2">Departamento Responsável</h3>
                    <span className="text-orange-500 text-xs">Requer permissão de Admin</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full border rounded-md px-4 py-2.5 text-gray-700"
                      placeholder="Sem departamento definido"
                      value={selectedDepartamento}
                      onChange={(e) => setSelectedDepartamento(e.target.value)}
                      disabled
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSalvar}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Salvar Alterações
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {problemData.foto_url && (
        <ProblemImageModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          imageUrl={problemData.foto_url}
          description={problemData.descricao}
        />
      )}
    </div>
  );
};

export default DetalhesOcorrencia;
