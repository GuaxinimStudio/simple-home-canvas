
import React from 'react';
import { Calendar, Clock3, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';

type ProblemItem = {
  id: number;
  description: string;
  status: string;
  date: string;
  secretary: string;
  timeElapsed: string;
  dueDate: string;
};

interface ProblemDetailContentProps {
  activity: ProblemItem;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const ProblemDetailContent: React.FC<ProblemDetailContentProps> = ({
  activity,
  activeTab,
  setActiveTab
}) => {
  return (
    <>
      <div className="mb-3">
        <ToggleGroup type="single" defaultValue="detalhes" value={activeTab} onValueChange={(value) => value && setActiveTab(value)}>
          <ToggleGroupItem value="detalhes" variant="success" className="text-sm">
            Detalhes
          </ToggleGroupItem>
          <ToggleGroupItem value="solicitacao" variant="success" className="text-sm">
            Solicitação
          </ToggleGroupItem>
          <ToggleGroupItem value="gerenciamento" variant="success" className="text-sm">
            Gerenciamento
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {activeTab === "detalhes" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Detalhes do Problema</h4>
              <p className="text-sm">{activity.description}</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Registro: {activity.date}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock3 className="h-4 w-4" />
                <span>Tempo decorrido: {activity.timeElapsed}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Informações de Contato</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Contato: 55629406{activity.id}234</span>
              </div>
              
              <h4 className="text-sm font-semibold mt-4">Situação Atual</h4>
              <Badge className={`px-2.5 py-1 rounded-full text-xs ${
                activity.status === 'Resolvido' 
                  ? "bg-resolve-lightgreen text-resolve-green" 
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {activity.status}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {activeTab === "solicitacao" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold">Informações fornecidas pelo cidadão</h4>
            <p className="text-sm mt-2">
              Detalhes da solicitação para o problema "{activity.description}". 
              Este problema foi registrado no {activity.secretary}.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Registro Fotográfico</h4>
            <div className="mt-2 h-48 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-sm text-gray-500">Imagem do problema</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "gerenciamento" && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold">Atualizar Situação</h4>
            <div className="mt-2 bg-gray-100 p-3 rounded-md">
              <p className="text-sm">
                {activity.status === 'Resolvido' 
                  ? "O status não pode ser alterado pois a demanda já foi finalizada."
                  : "Pendente de resolução pelo gabinete responsável."}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Prazo Estimado de Resolução</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center justify-center">
                {activity.dueDate}
              </div>
              <span className="text-xs text-orange-500">Alterações: 1/2</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
