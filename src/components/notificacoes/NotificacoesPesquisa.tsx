
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type NotificacoesPesquisaProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const NotificacoesPesquisa: React.FC<NotificacoesPesquisaProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Pesquisar notificações..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default NotificacoesPesquisa;
