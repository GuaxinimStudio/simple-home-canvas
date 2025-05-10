
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Card } from "@/components/ui/card";
import Sidebar from '../components/Sidebar';
import { toast } from 'sonner';

type StatusType = 'Pendente' | 'Em andamento' | 'Resolvido' | 'Informações Insuficientes';

const DetalhesOcorrencia: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStatus, setCurrentStatus] = useState<StatusType>('Pendente');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');

  // Estes dados seriam obtidos de uma API com base no ID
  // Por enquanto, vamos simular dados estáticos
  const ocorrencia = {
    id: Number(id),
    descricao: "Árvore caída na Rua Principal",
    status: 'Pendente' as StatusType,
    dataRegistro: '8 mai 2025, 22:35',
    contato: '5562-9785050',
    tempoDecorrido: '00:45:23'
  };

  const handleVoltar = () => {
    navigate('/problemas');
  };

  const handleStatusChange = (value: string) => {
    setCurrentStatus(value as StatusType);
  };

  const handleSalvar = () => {
    toast.success('Alterações salvas com sucesso!');
  };

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
                  <div className="bg-gray-100 h-40 rounded-md flex items-center justify-center text-gray-400">
                    Sem foto disponível
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Descrição do Problema</h3>
                  <p className="bg-gray-50 p-3 rounded text-gray-700 border">
                    {ocorrencia.descricao}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Contato</h3>
                    <p className="text-gray-700">{ocorrencia.contato}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Data do Registro</h3>
                    <p className="text-gray-700">{ocorrencia.dataRegistro}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Tempo Decorrido</h3>
                  <div className="flex items-center text-red-500">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {ocorrencia.tempoDecorrido}
                  </div>
                </div>
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
                      type="text" 
                      className="w-full border rounded-md px-4 py-2.5 text-gray-700"
                      placeholder="Selecione um prazo"
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
    </div>
  );
};

export default DetalhesOcorrencia;
