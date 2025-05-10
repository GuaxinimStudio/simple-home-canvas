
import { useState, useMemo } from 'react';
import { Problem } from './types';

export const useProblemData = () => {
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
  
  const filteredProblems = useMemo(() => {
    return selectedStatus === "todos" 
      ? problems 
      : problems.filter(problem => problem.status.toLowerCase() === selectedStatus.toLowerCase());
  }, [problems, selectedStatus]);
  
  return {
    problems,
    selectedStatus,
    setSelectedStatus,
    filteredProblems,
    totalProblems: filteredProblems.length
  };
};
