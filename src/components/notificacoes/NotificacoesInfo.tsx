
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotificacoesInfo: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
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
