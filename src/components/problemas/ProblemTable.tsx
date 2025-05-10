
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Problem } from './types';

interface ProblemTableProps {
  problems: Problem[];
}

export const ProblemTable: React.FC<ProblemTableProps> = ({ problems }) => {
  const navigate = useNavigate();
  
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
          {problems.map((problem) => (
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
  );
};
