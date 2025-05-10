
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Check } from "lucide-react";

type Problem = {
  id: number;
  photo: string;
  description: string;
  status: 'Resolvido' | 'Pendente' | 'Em andamento' | 'Informações Insuficientes';
  time: string;
  deadline: string;
  date: string;
  secretary: string;
};

const Problemas: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  
  const [problems] = useState<Problem[]>([
    { 
      id: 1, 
      photo: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
      description: 'Visita Valdei', 
      status: 'Resolvido', 
      time: '13:32:49',
      deadline: '14/05/25 00:00',
      date: '9 mai 2025, 08:39',
      secretary: 'Secretaria de Saúde',
    },
    { 
      id: 2, 
      photo: "https://images.unsplash.com/photo-1525348371683-1e1f02b5c535?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
      description: 'Carros lá fora', 
      status: 'Resolvido', 
      time: '2d 05:40:57',
      deadline: '14/05/25 00:00',
      date: '7 mai 2025, 16:31',
      secretary: 'Secretaria de Obras',
    },
    { 
      id: 3, 
      photo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
      description: 'Solucionar', 
      status: 'Pendente', 
      time: '2d 10:25:12',
      deadline: '15/05/25 00:00',
      date: '7 mai 2025, 11:47',
      secretary: 'Secretaria de Obras',
    },
    { 
      id: 4, 
      photo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
      description: 'Avaliação interna', 
      status: 'Em andamento', 
      time: '1d 10:25:12',
      deadline: '16/05/25 00:00',
      date: '8 mai 2025, 11:47',
      secretary: 'Secretaria de Educação',
    },
    { 
      id: 5, 
      photo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
      description: 'Árvore caída', 
      status: 'Informações Insuficientes', 
      time: '3d 10:25:12',
      deadline: '17/05/25 00:00',
      date: '6 mai 2025, 11:47',
      secretary: 'Secretaria de Meio Ambiente',
    }
  ]);
  
  const filteredProblems = selectedStatus === "todos" 
    ? problems 
    : problems.filter(problem => problem.status.toLowerCase() === selectedStatus.toLowerCase());
    
  const totalProblems = filteredProblems.length;
  
  const handleViewProblem = (id: number) => {
    navigate(`/detalhes-ocorrencia/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Resolvido':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em andamento':
        return 'bg-blue-100 text-blue-800';
      case 'Informações Insuficientes':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Resolvido':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'Pendente':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );
      case 'Em andamento':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      case 'Informações Insuficientes':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 8.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Título e subtítulo */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h1 className="text-2xl font-semibold text-gray-800">Problemas Reportados</h1>
            <div className="flex items-center mt-1">
              <span className="text-gray-600 text-sm bg-green-100 px-2 py-0.5 rounded-full mr-2">
                {totalProblems} problemas
              </span>
              <p className="text-gray-600">
                Gerencie todos os problemas reportados pelos cidadãos na cidade de Uruaçu, GO
              </p>
            </div>
          </div>

          {/* Filtros */}
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
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em andamento">Em andamento</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                  <SelectItem value="informações insuficientes">Informações Insuficientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-64">
              <Select>
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

          {/* Tabela de problemas */}
          <div className="bg-white rounded-lg border shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium text-gray-600">Foto</th>
                  <th className="p-4 text-left font-medium text-gray-600">Descrição</th>
                  <th className="p-4 text-left font-medium text-gray-600">Status</th>
                  <th className="p-4 text-left font-medium text-gray-600">Tempo</th>
                  <th className="p-4 text-left font-medium text-gray-600">Prazo</th>
                  <th className="p-4 text-left font-medium text-gray-600">Data</th>
                  <th className="p-4 text-left font-medium text-gray-600">Secretaria</th>
                  <th className="p-4 text-center font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((problem) => (
                  <tr key={problem.id} className="border-b">
                    <td className="p-4">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={problem.photo} 
                          alt={problem.description}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </td>
                    <td className="p-4 font-medium">{problem.description}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(problem.status)}`}>
                        {getStatusIcon(problem.status)}
                        {problem.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="6.5" stroke="currentColor"/>
                          <path d="M8 5V8H11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {problem.time}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke="currentColor"/>
                          <path d="M2.5 6.5H13.5" stroke="currentColor" strokeLinecap="round"/>
                          <path d="M5.5 2.5V4.5" stroke="currentColor" strokeLinecap="round"/>
                          <path d="M10.5 2.5V4.5" stroke="currentColor" strokeLinecap="round"/>
                        </svg>
                        <span className={`text-sm ${
                          problem.status === 'Resolvido' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {problem.deadline}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{problem.date}</td>
                    <td className="p-4 text-gray-600">{problem.secretary}</td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewProblem(problem.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problemas;
