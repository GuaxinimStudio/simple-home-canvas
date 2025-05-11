
import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiltrosRelatorios } from './relatorios/types';

// Componentes refatorados
import FiltroTextoBusca from './relatorios/FiltroTextoBusca';
import FiltroSecretaria from './relatorios/FiltroSecretaria';
import FiltroStatus from './relatorios/FiltroStatus';
import FiltroTipoData from './relatorios/FiltroTipoData';
import FiltroMesAno from './relatorios/FiltroMesAno';
import FiltroIntervalo from './relatorios/FiltroIntervalo';

interface RelatoriosFiltrosProps {
  filtros: FiltrosRelatorios;
  onFiltrosChange: (novosFiltros: FiltrosRelatorios) => void;
  onLimparFiltros: () => void;
}

const RelatoriosFiltros: React.FC<RelatoriosFiltrosProps> = ({ 
  filtros, 
  onFiltrosChange,
  onLimparFiltros
}) => {
  // Verificar que filtros não é undefined antes de prosseguir
  if (!filtros) {
    return <div>Carregando filtros...</div>;
  }
  
  const handleFiltroChange = (campo: keyof FiltrosRelatorios, valor: any) => {
    const novosFiltros = { ...filtros, [campo]: valor };
    onFiltrosChange(novosFiltros);
  };
  
  const handleTipoFiltroChange = (tipo: "mes_ano" | "intervalo") => {
    const novosFiltros = { 
      ...filtros, 
      tipoFiltro: tipo 
    };
    onFiltrosChange(novosFiltros);
  };

  // Nova lógica: verificar se o mês ou ano selecionado é diferente do atual
  const mesAtual = (new Date().getMonth() + 1).toString();
  const anoAtual = new Date().getFullYear().toString();
  
  const mesDiferenteDoAtual = filtros.mes !== null && filtros.mes !== mesAtual;
  const anoDiferenteDoAtual = filtros.ano !== null && filtros.ano !== anoAtual;
  
  // Mostrar botão de limpar apenas se o mês ou ano for diferente do atual
  const mostrarBotaoLimpar = mesDiferenteDoAtual || anoDiferenteDoAtual;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Filtros</h2>
          
          {mostrarBotaoLimpar && (
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
          <FiltroTextoBusca 
            textoBusca={filtros.textoBusca} 
            onChange={(valor) => handleFiltroChange('textoBusca', valor)} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FiltroSecretaria 
                secretaria={filtros.secretaria} 
                onChange={(valor) => handleFiltroChange('secretaria', valor)} 
              />
            </div>
            
            <div>
              <FiltroStatus 
                status={filtros.status} 
                onChange={(valor) => handleFiltroChange('status', valor)} 
              />
            </div>
            
            <div>
              <FiltroTipoData 
                tipoFiltro={filtros.tipoFiltro} 
                onChange={handleTipoFiltroChange} 
              />
            </div>
          </div>
          
          {filtros.tipoFiltro === "mes_ano" && (
            <FiltroMesAno 
              mes={filtros.mes} 
              ano={filtros.ano} 
              onChangeMes={(valor) => handleFiltroChange('mes', valor)} 
              onChangeAno={(valor) => handleFiltroChange('ano', valor)} 
            />
          )}

          {filtros.tipoFiltro === "intervalo" && (
            <FiltroIntervalo 
              dataInicio={filtros.dataInicio} 
              dataFim={filtros.dataFim} 
              onChangeDataInicio={(valor) => handleFiltroChange('dataInicio', valor)} 
              onChangeDataFim={(valor) => handleFiltroChange('dataFim', valor)} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatoriosFiltros;
