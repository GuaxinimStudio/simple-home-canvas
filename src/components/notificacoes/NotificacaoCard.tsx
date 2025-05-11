
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Notificacao } from '@/hooks/notificacoes/types';

type NotificacaoCardProps = {
  notificacao: Notificacao;
  onSelect: (notificacao: Notificacao) => void;
  onExcluir: (id: string) => void;
};

const NotificacaoCard: React.FC<NotificacaoCardProps> = ({ 
  notificacao, 
  onSelect, 
  onExcluir 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getArquivoIcon = (tipo: string | null | undefined) => {
    if (!tipo) return null;
    
    if (tipo.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4 text-blue-500 mr-1" />;
    } else if (tipo === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500 mr-1" />;
    }
    
    return null;
  };

  return (
    <Card 
      className="relative hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(notificacao)}
    >
      <CardContent className="pt-6">
        {/* Ícone de lixeira */}
        <button 
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
          onClick={(e) => {
            e.stopPropagation();
            if(window.confirm('Tem certeza que deseja excluir esta notificação?')) {
              onExcluir(notificacao.id);
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
        
        {/* Exibir uma prévia da imagem se for uma imagem */}
        {notificacao.arquivo_url && notificacao.arquivo_tipo?.startsWith('image/') && (
          <div className="mb-3">
            <img 
              src={notificacao.arquivo_url} 
              alt="Imagem anexada" 
              className="h-24 object-cover rounded-md mx-auto"
            />
          </div>
        )}
        
        {/* Ícone do arquivo se não for imagem */}
        {notificacao.arquivo_url && !notificacao.arquivo_tipo?.startsWith('image/') && (
          <div className="flex items-center text-sm text-blue-600 mb-3">
            {getArquivoIcon(notificacao.arquivo_tipo)}
            <span>Arquivo anexado</span>
          </div>
        )}
        
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
  );
};

export default NotificacaoCard;
