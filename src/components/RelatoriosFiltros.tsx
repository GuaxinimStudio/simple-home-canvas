
import React, { useState } from 'react';
import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const meses = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const gerarAnos = () => {
  const anoAtual = new Date().getFullYear();
  const anos = [];
  for (let i = anoAtual - 5; i <= anoAtual + 5; i++) {
    anos.push({ value: i.toString(), label: i.toString() });
  }
  return anos;
};

const RelatoriosFiltros: React.FC = () => {
  const anos = gerarAnos();
  const anoAtual = new Date().getFullYear().toString();
  const mesAtual = (new Date().getMonth() + 1).toString();

  const [selectedMonth, setSelectedMonth] = useState<string>(mesAtual);
  const [selectedYear, setSelectedYear] = useState<string>(anoAtual);
  const [tipoFiltro, setTipoFiltro] = useState<"mes_ano" | "intervalo">("mes_ano");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  
  const handleTipoFiltroChange = (tipo: "mes_ano" | "intervalo") => {
    setTipoFiltro(tipo);
  };

  const getNomeMes = (mesNumero: string) => {
    return meses.find(mes => mes.value === mesNumero)?.label || "Selecione o mês";
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-600 mb-1 block">Busca por texto</span>
            <Input 
              placeholder="Pesquisar por descrição ou secretaria..." 
              className="max-w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas as secretarias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as secretarias</SelectItem>
                  <SelectItem value="saude">Secretaria de Saúde</SelectItem>
                  <SelectItem value="educacao">Secretaria de Educação</SelectItem>
                  <SelectItem value="infraestrutura">Secretaria de Infraestrutura</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <Button 
                  variant={tipoFiltro === "mes_ano" ? "default" : "outline"} 
                  className={cn(
                    "w-full",
                    tipoFiltro === "mes_ano" ? "bg-resolve-green hover:bg-green-600" : ""
                  )}
                  onClick={() => handleTipoFiltroChange("mes_ano")}
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
                  onClick={() => handleTipoFiltroChange("intervalo")}
                >
                  Intervalo
                </Button>
              </div>
            </div>
          </div>
          
          {tipoFiltro === "mes_ano" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={getNomeMes(selectedMonth)} />
                  </SelectTrigger>
                  <SelectContent>
                    {meses.map((mes) => (
                      <SelectItem key={mes.value} value={mes.value}>
                        {mes.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selectedYear} />
                  </SelectTrigger>
                  <SelectContent>
                    {anos.map((ano) => (
                      <SelectItem key={ano.value} value={ano.value}>
                        {ano.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {tipoFiltro === "intervalo" && (
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
                      onSelect={setDataInicio}
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
                      onSelect={setDataFim}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(date) => dataInicio ? date < dataInicio : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button className="bg-resolve-green hover:bg-green-600">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatoriosFiltros;
