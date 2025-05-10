
import React from 'react';
import { Building, MapPin, Phone, PlusCircle, Eye, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
}

const GabineteCard: React.FC<GabineteCardProps> = ({ gabinete }) => {
  return (
    <Card className="bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="bg-green-50 p-2 rounded-md">
            <Building className="h-5 w-5 text-resolve-green" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-1">{gabinete.gabinete}</h3>
            <p className="text-gray-500 text-sm mb-4">
              {gabinete.responsavel ? `Responsável: ${gabinete.responsavel}` : 'Sem responsável definido'}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{gabinete.municipio ? `${gabinete.municipio}, ${gabinete.estado}` : 'Localização não definida'}</span>
              </div>

              {gabinete.telefone && (
                <div className="flex items-center text-gray-500 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{gabinete.telefone}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span>{gabinete.profiles.length} membros vinculados</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4 text-gray-500" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <PlusCircle className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GabineteCard;
