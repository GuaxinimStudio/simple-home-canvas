
import React, { useState, useEffect } from 'react';
import { ChevronDown, Calendar as CalendarIcon, X } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FiltrosRelatorios {
  textoBusca: string;
  secretaria: string | null;
  status: string | null;
  tipoFiltro: "mes_ano" | "intervalo";
  mes: string | null;
  ano: string | null;
  dataInicio: Date | undefined;
  dataFim: Date | undefined;
}

interface RelatoriosFiltrosProps {
  filtros: FiltrosRelatorios;
  onFiltrosChange: (novosFiltros: FiltrosRelatorios) => void;
  onLimparFiltros: () => void;
}

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

const RelatoriosFiltros: React.FC<RelatoriosFiltrosProps> = ({ 
  filtros, 
  onFiltrosChange,
  onLimparFiltros
}) => {
  const anos = gerarAnos();
  const [secretarias, setSecretarias] = useState<{value: string, label: string}[]>([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState<boolean>(false);
  
  // Buscar secretarias únicas do banco de dados
  useEffect(() => {
    const carregarSecretarias = async () => {
      try {
        const { data, error } = await supabase
          .from('problemas')
          .select('secretaria')
          .not('secretaria', 'is', null)
          .order('secretaria');
        
        if (error) throw error;
        
        // Filtrar valores únicos
        const secretariasUnicas = Array.from(new Set(data.map(item => item.secretaria)))
          .filter(Boolean)
          .map(secretaria => ({
            value: secretaria,
            label: secretaria
          }));
        
        setSecretarias(secretariasUnicas);
      } catch (error: any) {
        console.error('Erro ao carregar secretarias:', error);
        toast.error('Não foi possível carregar a lista de secretarias');
      }
    };
    
    carregarSecretarias();
  }, []);
  
  const handleFiltroChange = (campo: keyof FiltrosRelatorios, valor: any) => {
    const novosFiltros = { ...filtros, [campo]: valor };
    onFiltrosChange(novosFiltros);
    setFiltrosAplicados(true);
  };
  
  const handleTipoFiltroChange = (tipo: "mes_ano" | "intervalo") => {
    const novosFiltros = { 
      ...filtros, 
      tipoFiltro: tipo 
    };
    onFiltrosChange(novosFiltros);
    setFiltrosAplicados(true);
  };

  const handleTextoBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiltroChange('textoBusca', e.target.value);
  };
  
  const getNomeMes = (mesNumero: string | null) => {
    if (!mesNumero) return "Selecione o mês";
    return meses.find(mes => mes.value === mesNumero)?.label || "Selecione o mês";
  };

  const temFiltrosAplicados = filtrosAplicados || 
    filtros.textoBusca || 
    filtros.secretaria || 
    filtros.status || 
    filtros.mes || 
    filtros.ano || 
    filtros.dataInicio || 
    filtros.dataFim;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Filtros</h2>
          
          {temFiltrosAplicados && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={onLimparFiltros}
            >
              <X className="h-4 w-4" /> Limpar filtros
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-600 mb-1 block">Busca por texto</span>
            <Input 
              placeholder="Pesquisar por descrição ou secretaria..." 
              className="max-w-full"
              value={filtros.textoBusca}
              onChange={handleTextoBuscaChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select 
                value={filtros.secretaria || ''} 
                onValueChange={(value) => handleFiltroChange('secretaria', value || null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas as secretarias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as secretarias</SelectItem>
                  {secretarias.map((secretaria) => (
                    <SelectItem key={secretaria.value} value={secretaria.value}>
                      {secretaria.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select 
                value={filtros.status || ''} 
                onValueChange={(value) => handleFiltroChange('status', value || null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Resolvido">Resolvido</SelectItem>
                  <SelectItem value="Informações Insuficientes">Informações Insuficientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <Button 
                  variant={filtros.tipoFiltro === "mes_ano" ? "default" : "outline"} 
                  className={cn(
                    "w-full",
                    filtros.tipoFiltro === "mes_ano" ? "bg-resolve-green hover:bg-green-600" : ""
                  )}
                  onClick={() => handleTipoFiltroChange("mes_ano")}
                >
                  Mês/Ano
                </Button>
              </div>
              <div className="flex-grow">
                <Button 
                  variant={filtros.tipoFiltro === "intervalo" ? "default" : "outline"} 
                  className={cn(
                    "w-full",
                    filtros.tipoFiltro === "intervalo" ? "bg-resolve-green hover:bg-green-600" : ""
                  )}
                  onClick={() => handleTipoFiltroChange("intervalo")}
                >
                  Intervalo
                </Button>
              </div>
            </div>
          </div>
          
          {filtros.tipoFiltro === "mes_ano" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select 
                  value={filtros.mes || ''} 
                  onValueChange={(value) => handleFiltroChange('mes', value || null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={getNomeMes(filtros.mes)} />
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
                <Select 
                  value={filtros.ano || ''} 
                  onValueChange={(value) => handleFiltroChange('ano', value || null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={filtros.ano || 'Selecione o ano'} />
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

          {filtros.tipoFiltro === "intervalo" && (
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
                      {filtros.dataInicio ? (
                        format(filtros.dataInicio, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecionar data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filtros.dataInicio}
                      onSelect={(date) => handleFiltroChange('dataInicio', date)}
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
                      {filtros.dataFim ? (
                        format(filtros.dataFim, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecionar data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filtros.dataFim}
                      onSelect={(date) => handleFiltroChange('dataFim', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(date) => filtros.dataInicio ? date < filtros.dataInicio : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatoriosFiltros;
