
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const calculateElapsedTime = (createdAt: string, endDate?: string) => {
  const now = new Date();
  const created = new Date(createdAt);
  const end = endDate ? new Date(endDate) : now;
  
  const diffMs = end.getTime() - created.getTime();
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
};

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: ptBR });
  } catch (err) {
    return "Data inválida";
  }
};
