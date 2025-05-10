
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, MessageCircle, Bell, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Notificacao = {
  id: string;
  data: string;
  hora: string;
  titulo: string;
  texto: string;
  secretaria: string;
  cidade: string;
  numContatos: number;
};

const notificacoesExemplo: Notificacao[] = [
  {
    id: '1',
    data: '09/05/2025',
    hora: '10:47',
    titulo: 'teste',
    texto: 'teste',
    secretaria: 'Secretaria de Cultura',
    cidade: 'Uruaçu, GO',
    numContatos: 2
  },
  {
    id: '2',
    data: '07/05/2025',
    hora: '16:40',
    titulo: 'Olá, tudo bem!',
    texto: 'Olá, tudo bem!',
    secretaria: 'Secretaria de Obras',
    cidade: 'Uruaçu, GO',
    numContatos: 2
  },
  {
    id: '3',
    data: '07/05/2025',
    hora: '11:14',
    titulo: 'Sobre a dengue',
    texto: 'Sobre a dengue É transmitida pela picada de um mosquito infectado com um dos qu...',
    secretaria: 'Secretaria de Saúde',
    cidade: 'Uruaçu, GO',
    numContatos: 5
  }
];

const Notificacoes: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho com ícone e botão */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Bell className="mr-2 h-6 w-6" />
              <h1 className="text-2xl font-semibold">Notificações</h1>
            </div>
            <Button className="bg-green-500 hover:bg-green-600">
              <Plus className="mr-1 h-4 w-4" />
              Nova Notificação
            </Button>
          </div>
          
          {/* Card de Sobre Notificações */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sobre Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Notificações são mensagens importantes que serão enviadas para os contatos registrados. 
                Utilize este recurso para enviar alertas, lembretes ou informações importantes.
              </p>
            </CardContent>
          </Card>
          
          {/* Seção Lista de Notificações */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lista de Notificações</h2>
            <p className="text-gray-500 text-sm">Clique no card para ver detalhes completos</p>
          </div>
          
          {/* Cards de Notificações */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notificacoesExemplo.map((notificacao) => (
              <Card key={notificacao.id} className="relative hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  {/* Ícone de lixeira */}
                  <button className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                  
                  {/* Ícone de mensagem e número de contatos */}
                  <div className="flex items-center text-green-600 mb-2">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="font-medium">{notificacao.numContatos} contato(s)</span>
                  </div>
                  
                  {/* Data e hora */}
                  <p className="text-sm text-gray-500 mb-2">
                    {notificacao.data} às {notificacao.hora}
                  </p>
                  
                  {/* Texto da notificação */}
                  <p className="mb-4">{notificacao.texto}</p>
                  
                  {/* Secretaria */}
                  <div className="text-sm text-gray-600">
                    <p><span className="text-green-600">Secretaria:</span> {notificacao.secretaria}</p>
                    <p><span className="text-green-600">Cidade:</span> {notificacao.cidade}</p>
                  </div>
                  
                  {/* Link para detalhes (apenas para o terceiro card) */}
                  {notificacao.id === '3' && (
                    <div className="mt-2">
                      <a href="#" className="text-sm text-green-500 flex items-center">
                        🔍 Clique para ver detalhes
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notificacoes;
