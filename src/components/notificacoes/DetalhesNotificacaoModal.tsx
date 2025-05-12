
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { Notificacao } from '@/hooks/notificacoes/types';

type DetalhesNotificacaoModalProps = {
  notificacao: Notificacao | null;
  isOpen: boolean;
  onClose: () => void;
};

const DetalhesNotificacaoModal: React.FC<DetalhesNotificacaoModalProps> = ({ 
  notificacao, 
  isOpen, 
  onClose 
}) => {
  if (!notificacao) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getArquivoIcon = () => {
    if (!notificacao.arquivo_tipo) return null;
    
    if (notificacao.arquivo_tipo.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-500 mr-2" />;
    } else if (notificacao.arquivo_tipo === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500 mr-2" />;
    }
    
    return <FileText className="h-5 w-5 text-gray-500 mr-2" />;
  };

  const isImage = notificacao.arquivo_tipo?.startsWith('image/');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Detalhes da Notificação
          </DialogTitle>
        </DialogHeader>

        {/* Área com scroll para o conteúdo */}
        <ScrollArea className="max-h-[calc(80vh-80px)] pr-4">
          <div className="space-y-4 pt-2">
            {/* Data */}
            <div className="text-sm text-gray-500">
              Enviada em {formatDate(notificacao.created_at)}
            </div>

            {/* Gabinete */}
            {notificacao.gabinete && (
              <div className="text-sm bg-green-50 p-3 rounded-md">
                <p className="font-medium text-green-700">Gabinete</p>
                <p>{notificacao.gabinete.gabinete}</p>
                {notificacao.gabinete.municipio && (
                  <p className="text-gray-600">{notificacao.gabinete.municipio}</p>
                )}
              </div>
            )}

            {/* Número de destinatários */}
            <div className="text-sm text-gray-600">
              Enviada para {notificacao.telefones.length} contato(s)
            </div>

            {/* Texto da notificação */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2 text-gray-700">Mensagem</h3>
              <p className="whitespace-pre-wrap">{notificacao.informacao}</p>
            </div>

            {/* Arquivo anexado */}
            {notificacao.arquivo_url && (
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                  {getArquivoIcon()}
                  Arquivo anexado
                </h3>
                
                {isImage ? (
                  <div className="flex justify-center">
                    <img 
                      src={notificacao.arquivo_url} 
                      alt="Imagem anexada" 
                      className="max-h-64 max-w-full object-contain rounded-md"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <a 
                      href={notificacao.arquivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline flex items-center"
                    >
                      {getArquivoIcon()}
                      Abrir arquivo
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesNotificacaoModal;
