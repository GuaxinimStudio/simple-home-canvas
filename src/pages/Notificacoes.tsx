
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, MessageCircle, Bell, Plus, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import NovaNotificacaoModal from '@/components/notificacoes/NovaNotificacaoModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Notificacoes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    notificacoes, 
    isLoading, 
    error, 
    searchTerm, 
    setSearchTerm,
    excluirNotificacao
  } = useNotificacoes();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

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
            <Button className="bg-green-500 hover:bg-green-600" onClick={() => setIsModalOpen(true)}>
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
                Notificações são mensagens importantes que serão enviadas para os contatos registrados no Resolve Leg. 
                Utilize este recurso para enviar alertas, lembretes ou informações importantes.
              </p>
            </CardContent>
          </Card>
          
          {/* Barra de pesquisa */}
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
          
          {/* Seção Lista de Notificações */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lista de Notificações</h2>
            <p className="text-gray-500 text-sm">Clique no card para ver detalhes completos</p>
          </div>
          
          {/* Estado de carregamento */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              <p className="mt-2 text-gray-500">Carregando notificações...</p>
            </div>
          )}
          
          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">Erro ao carregar notificações. Tente novamente mais tarde.</p>
            </div>
          )}
          
          {/* Sem notificações */}
          {!isLoading && !error && notificacoes?.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Nenhuma notificação encontrada</h3>
              <p className="mt-1 text-gray-500">Comece criando uma nova notificação usando o botão acima.</p>
            </div>
          )}
          
          {/* Cards de Notificações */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notificacoes?.map((notificacao) => (
                <Card key={notificacao.id} className="relative hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    {/* Ícone de lixeira */}
                    <button 
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        if(window.confirm('Tem certeza que deseja excluir esta notificação?')) {
                          excluirNotificacao(notificacao.id);
                        }
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    
                    {/* Ícone de mensagem e número de contatos */}
                    <div className="flex items-center text-green-600 mb-2">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="font-medium">{notificacao.telefones?.length || 0} contato(s)</span>
                    </div>
                    
                    {/* Data e hora */}
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(notificacao.created_at)}
                    </p>
                    
                    {/* Texto da notificação */}
                    <p className="mb-4 line-clamp-3">{notificacao.informacao}</p>
                    
                    {/* Secretaria */}
                    {notificacao.gabinete && (
                      <div className="text-sm text-gray-600">
                        <p><span className="text-green-600">Gabinete:</span> {notificacao.gabinete.gabinete}</p>
                        {notificacao.gabinete.municipio && (
                          <p><span className="text-green-600">Cidade:</span> {notificacao.gabinete.municipio}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para Nova Notificação */}
      <NovaNotificacaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Notificacoes;
