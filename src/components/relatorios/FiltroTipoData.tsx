
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

interface FiltroTipoDataProps {
  tipoFiltro: "mes_ano" | "intervalo";
  onChange: (tipo: "mes_ano" | "intervalo") => void;
}

const FiltroTipoData: React.FC<FiltroTipoDataProps> = ({ tipoFiltro, onChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-grow">
        <Button 
          variant={tipoFiltro === "mes_ano" ? "default" : "outline"} 
          className={cn(
            "w-full",
            tipoFiltro === "mes_ano" ? "bg-resolve-green hover:bg-green-600" : ""
          )}
          onClick={() => onChange("mes_ano")}
        >
          Mês/Ano
        </Button>
      </div>
      <div className="flex-grow">
        <Button 
          variant={tipoFiltro === "intervalo" ? "default" : "outline"} 
          className={cn(
            "w-full",
            tipoFiltro === "intervalo" ? "bg-resolve-green hover:bg-green-600" : ""
          )}
          onClick={() => onChange("intervalo")}
        >
          Intervalo
        </Button>
      </div>
    </div>
  );
};

export default FiltroTipoData;
