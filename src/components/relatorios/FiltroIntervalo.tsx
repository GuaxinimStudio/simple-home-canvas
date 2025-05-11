
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FiltroIntervaloProps {
  dataInicio: Date | undefined;
  dataFim: Date | undefined;
  onChangeDataInicio: (data: Date | undefined) => void;
  onChangeDataFim: (data: Date | undefined) => void;
}

const FiltroIntervalo: React.FC<FiltroIntervaloProps> = ({ 
  dataInicio, 
  dataFim, 
  onChangeDataInicio, 
  onChangeDataFim 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <span className="text-sm text-gray-600 mb-1 block">Data inicial</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dataInicio ? (
                format(dataInicio, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Selecionar data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dataInicio}
              onSelect={onChangeDataInicio}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <span className="text-sm text-gray-600 mb-1 block">Data final</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dataFim ? (
                format(dataFim, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Selecionar data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dataFim}
              onSelect={onChangeDataFim}
              initialFocus
              className="p-3 pointer-events-auto"
              disabled={(date) => dataInicio ? date < dataInicio : false}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FiltroIntervalo;
