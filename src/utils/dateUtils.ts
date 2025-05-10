
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const calculateElapsedTime = (createdAt: string) => {
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

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: ptBR });
  } catch (err) {
    return "Data inválida";
  }
};
