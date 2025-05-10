
import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ProblemItem = {
  id: string;
  descricao: string;
  status: string;
  created_at: string;
  telefone: string;
  prazo_estimado: string | null;
  municipio: string | null;
  gabinete: {
    gabinete: string;
  } | null;
};

type RecentProblemsTableProps = {
  limit?: number;
};

const RecentProblemsTable: React.FC<RecentProblemsTableProps> = ({ limit = 5 }) => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProblemas = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('problemas')
          .select(`
            id,
            descricao,
            status,
            created_at,
            telefone,
            prazo_estimado,
            municipio,
            gabinete:gabinete_id(gabinete)
          `)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) throw error;
        setProblems(data || []);
      } catch (err: any) {
        console.error('Erro ao buscar problemas:', err);
        setError(err.message || 'Erro ao carregar problemas');
        toast.error(`Erro ao carregar problemas: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProblemas();
  }, [limit]);
  
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'resolvido':
        return "bg-resolve-lightgreen text-resolve-green";
      case 'pendente':
        return "bg-yellow-100 text-yellow-700";
      case 'em andamento':
        return "bg-blue-100 text-blue-700";
      case 'informações insuficientes':
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'resolvido':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'pendente':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );
      case 'em andamento':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      case 'informações insuficientes':
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
  
  const handleViewProblem = (id: string) => {
    navigate(`/detalhes-ocorrencia/${id}`);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', {
        locale: ptBR
      });
    } catch (e) {
      return dateString;
    }
  };

  const calculateTimeElapsed = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        locale: ptBR,
        addSuffix: true
      });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'Não definido';
    
    try {
      return format(new Date(deadline), 'dd/MM/yy HH:mm', {
        locale: ptBR
      });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-lg">Problemas Recentes</h3>
          </div>
        </div>
        <div className="w-full text-center py-8">
          <p className="text-gray-500">Carregando problemas...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-lg">Problemas Recentes</h3>
          </div>
        </div>
        <div className="w-full text-center py-8 text-red-500">
          <p>Erro ao carregar problemas. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }
  
  if (problems.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-lg">Problemas Recentes</h3>
          </div>
        </div>
        <div className="w-full text-center py-8">
          <p className="text-gray-500">Nenhum problema registrado ainda.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-lg">Problemas Recentes</h3>
        </div>
        <button 
          className="text-sm text-resolve-green font-medium"
          onClick={() => navigate('/problemas')}
        >
          Ver todos
        </button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Tempo</TableHead>
              <TableHead className="w-[120px]">Prazo</TableHead>
              <TableHead className="w-[180px]">Data</TableHead>
              <TableHead className="w-[180px]">Secretaria</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell className="font-medium">{problem.descricao}</TableCell>
                <TableCell>
                  <Badge className={`px-2.5 py-1 rounded-full text-xs flex items-center ${getStatusColor(problem.status)}`}>
                    {getStatusIcon(problem.status)}
                    {problem.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {calculateTimeElapsed(problem.created_at)}
                </TableCell>
                <TableCell>
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center justify-center">
                    {formatDeadline(problem.prazo_estimado)}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{formatDate(problem.created_at)}</TableCell>
                <TableCell className="text-sm">
                  {problem.gabinete?.gabinete || 'Não atribuído'}
                </TableCell>
                <TableCell>
                  <button 
                    className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200"
                    onClick={() => handleViewProblem(problem.id)}
                  >
                    <span className="sr-only">Ver detalhes</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentProblemsTable;
