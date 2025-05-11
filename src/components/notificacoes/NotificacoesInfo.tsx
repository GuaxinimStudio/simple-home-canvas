
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const NotificacoesInfo: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center gap-2">
        <Bell className="h-5 w-5 text-green-600" />
        <CardTitle>Sobre Notificações</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Notificações são mensagens importantes que serão enviadas para os contatos registrados no Resolve Leg. 
          Utilize este recurso para enviar alertas, lembretes ou informações importantes.
        </p>
      </CardContent>
    </Card>
  );
};

export default NotificacoesInfo;
