
import React from 'react';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NotificacoesHeaderProps = {
  onNovaNotificacao: () => void;
};

const NotificacoesHeader: React.FC<NotificacoesHeaderProps> = ({ onNovaNotificacao }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Bell className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-semibold">Notificações</h1>
      </div>
      <Button className="bg-green-500 hover:bg-green-600" onClick={onNovaNotificacao}>
        <Plus className="mr-1 h-4 w-4" />
        Nova Notificação
      </Button>
    </div>
  );
};

export default NotificacoesHeader;
