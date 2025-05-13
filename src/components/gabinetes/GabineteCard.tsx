
import React, { useState } from 'react';
import { Building, MapPin, Phone, PlusCircle, Eye, UserPlus, Trash2, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VerContatosModal from './VerContatosModal';
import NovoContatoModal from './NovoContatoModal';
import ExcluirGabineteDialog from './ExcluirGabineteDialog';
import EditarGabineteModal from './EditarGabineteModal';
import VerMembrosModal from './VerMembrosModal';

interface GabineteCardProps {
  gabinete: {
    id: string;
    gabinete: string;
    estado: string | null;
    municipio: string | null;
    telefone: string | null;
    responsavel: string | null;
    profiles: { id: string; nome: string | null }[];
  };
  onDelete?: () => void;
  onEdit?: () => void;
  isAdmin?: boolean;
}

const GabineteCard: React.FC<GabineteCardProps> = ({ gabinete, onDelete, onEdit, isAdmin = false }) => {
  const [isVerContatosModalOpen, setIsVerContatosModalOpen] = useState(false);
  const [isNovoContatoModalOpen, setIsNovoContatoModalOpen] = useState(false);
  const [isExcluirDialogOpen, setIsExcluirDialogOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isVerMembrosModalOpen, setIsVerMembrosModalOpen] = useState(false);

  // Garantir que profiles seja sempre um array, mesmo se for null
  const profiles = gabinete.profiles || [];

  return (
    <Card className="bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          {/* Cabeçalho do Card com título e botões de ação */}
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-2 rounded-md">
                <Building className="h-5 w-5 text-resolve-green" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">{gabinete.gabinete}</h3>
                <p className="text-gray-500 text-sm">
                  {gabinete.responsavel ? `Responsável: ${gabinete.responsavel}` : 'Sem responsável definido'}
                </p>
              </div>
            </div>
            
            {/* Botões de ação - apenas visíveis para administradores */}
            {isAdmin && (
              <div className="flex">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-500 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsEditarModalOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setIsExcluirDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Conteúdo do Card */}
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="break-words">{gabinete.municipio ? `${gabinete.municipio}, ${gabinete.estado}` : 'Localização não definida'}</span>
            </div>

            {gabinete.telefone && (
              <div className="flex flex-wrap items-center text-gray-500 text-sm">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="break-words">{gabinete.telefone}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
              <div className="flex items-center text-gray-500 text-sm">
                <UserPlus className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{profiles.length} {profiles.length === 1 ? 'membro vinculado' : 'membros vinculados'}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setIsVerMembrosModalOpen(true)}
                  title="Ver membros"
                >
                  <Eye className="h-4 w-4 text-gray-500" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setIsNovoContatoModalOpen(true)}
                  title="Adicionar contato"
                >
                  <PlusCircle className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Modal para Ver Contatos */}
      <VerContatosModal
        isOpen={isVerContatosModalOpen}
        onClose={() => setIsVerContatosModalOpen(false)}
        gabineteId={gabinete.id}
        gabineteNome={gabinete.gabinete}
      />

      {/* Modal para Novo Contato */}
      <NovoContatoModal
        isOpen={isNovoContatoModalOpen}
        onClose={() => setIsNovoContatoModalOpen(false)}
        gabineteId={gabinete.id}
        gabineteNome={gabinete.gabinete}
      />

      {/* Modal para Ver Membros vinculados */}
      <VerMembrosModal
        isOpen={isVerMembrosModalOpen}
        onClose={() => setIsVerMembrosModalOpen(false)}
        profiles={profiles}
        gabineteNome={gabinete.gabinete}
      />

      {/* Modais de ação - disponíveis apenas para administradores */}
      {isAdmin && (
        <>
          <ExcluirGabineteDialog
            isOpen={isExcluirDialogOpen}
            onClose={() => setIsExcluirDialogOpen(false)}
            gabineteId={gabinete.id}
            gabineteNome={gabinete.gabinete}
            onSuccess={onDelete || (() => {})}
          />

          <EditarGabineteModal
            isOpen={isEditarModalOpen}
            onClose={() => setIsEditarModalOpen(false)}
            gabinete={gabinete}
            onSuccess={onEdit || (() => {})}
          />
        </>
      )}
    </Card>
  );
};

export default GabineteCard;
