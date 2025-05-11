
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check } from 'lucide-react';
import { Problema, RelatoriosStats } from '@/hooks/useRelatoriosData';

interface VisualizacaoRelatorioProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  problemas: Problema[];
  stats: RelatoriosStats;
  filtros: {
    textoBusca: string;
    status: string | null;
    tipoFiltro: "mes_ano" | "intervalo";
    mes: string | null;
    ano: string | null;
    dataInicio: Date | undefined;
    dataFim: Date | undefined;
  };
  onConfirmarExportacao: () => void;
}

const VisualizacaoRelatorio: React.FC<VisualizacaoRelatorioProps> = ({ 
  isOpen, 
  onOpenChange, 
  problemas, 
  stats, 
  filtros,
  onConfirmarExportacao 
}) => {
  const [activeTab, setActiveTab] = useState<string>("resumo");

  // Formatar texto de período para exibição
  const obterTextoPeriodo = () => {
    if (filtros.tipoFiltro === 'mes_ano') {
      if (!filtros.mes || !filtros.ano) return 'Todo o período';
      
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      const mesIndex = parseInt(filtros.mes, 10) - 1;
      const nomeMes = meses[mesIndex];
      
      return `${nomeMes} de ${filtros.ano}`;
    } else {
      if (!filtros.dataInicio && !filtros.dataFim) return 'Todo o período';
      
      if (filtros.dataInicio && !filtros.dataFim) {
        return `A partir de ${filtros.dataInicio.toLocaleDateString('pt-BR')}`;
      }
      
      if (!filtros.dataInicio && filtros.dataFim) {
        return `Até ${filtros.dataFim.toLocaleDateString('pt-BR')}`;
      }
      
      return `De ${filtros.dataInicio?.toLocaleDateString('pt-BR')} até ${filtros.dataFim?.toLocaleDateString('pt-BR')}`;
    }
  };

  const calculaPorcentagem = (valor: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((valor / total) * 100)}%`;
  };

  // Obter informações de média de dias de atraso
  const calculaMediaAtraso = () => {
    const problemasComAtraso = problemas.filter(p => p.dias_atraso_resolucao !== null && p.dias_atraso_resolucao > 0);
    
    if (problemasComAtraso.length === 0) return 0;
    
    const somaAtrasos = problemasComAtraso.reduce((soma, p) => soma + (p.dias_atraso_resolucao || 0), 0);
    return Math.round(somaAtrasos / problemasComAtraso.length);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visualização do Relatório</DialogTitle>
        </DialogHeader>
        
        <Tabs 
          defaultValue="resumo" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="resumo" className="text-center">
              Resumo
            </TabsTrigger>
            <TabsTrigger value="problemas" className="text-center">
              Problemas ({problemas.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="resumo" className="space-y-6">
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Filtros aplicados:</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Período:</span> {obterTextoPeriodo()}</p>
                <p><span className="font-medium">Status:</span> {filtros.status || 'Todos os status'}</p>
                {filtros.textoBusca && (
                  <p><span className="font-medium">Busca:</span> {filtros.textoBusca}</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Estatísticas do Relatório:</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-md p-3">
                  <p className="text-sm text-gray-600 mb-1">Total de problemas:</p>
                  <p className="text-2xl font-medium text-blue-600">{stats.total}</p>
                </div>
                
                <div className="border rounded-md p-3">
                  <p className="text-sm text-gray-600 mb-1">Pendentes:</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-medium text-yellow-600 mr-2">{stats.pendentes}</p>
                    <span className="text-sm text-gray-500">({calculaPorcentagem(stats.pendentes, stats.total)})</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <p className="text-sm text-gray-600 mb-1">Em Andamento:</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-medium text-blue-600 mr-2">{stats.emAndamento}</p>
                    <span className="text-sm text-gray-500">({calculaPorcentagem(stats.emAndamento, stats.total)})</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <p className="text-sm text-gray-600 mb-1">Resolvidos:</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-medium text-green-600 mr-2">{stats.resolvidos}</p>
                    <span className="text-sm text-gray-500">({calculaPorcentagem(stats.resolvidos, stats.total)})</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-md p-3">
                <p className="text-sm text-gray-600 mb-1">Resolvidos no Prazo:</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-medium text-green-600 mr-2">
                    {stats.totalResolvidos > 0 
                      ? `${Math.round((stats.resolvidosNoPrazo / stats.totalResolvidos) * 100)}%` 
                      : '0%'}
                  </p>
                  <span className="text-sm text-gray-500">
                    ({stats.resolvidosNoPrazo} de {stats.totalResolvidos})
                  </span>
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <p className="text-sm text-gray-600 mb-1">Média de Atraso:</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-medium text-red-600 mr-2">
                    {calculaMediaAtraso()}
                  </p>
                  <span className="text-sm text-gray-500">dias em média</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="problemas" className="space-y-4">
            {problemas.length > 0 ? (
              problemas.map((problema, index) => (
                <div 
                  key={problema.id} 
                  className="border rounded-md p-4 relative"
                >
                  <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${
                    problema.status === 'Resolvido' 
                      ? 'bg-green-100 text-green-800' 
                      : problema.status === 'Pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : problema.status === 'Em andamento'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                  }`}>
                    {problema.status}
                  </div>
                  
                  <h4 className="text-green-700 font-medium mb-3">Problema #{index + 1}</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Descrição</p>
                      <p className="text-sm">{problema.descricao || 'Sem descrição'}</p>
                    </div>
                    
                    <div className="row-span-2">
                      <p className="text-sm text-gray-600 mb-1">Foto do Problema</p>
                      {problema.foto_url ? (
                        <img 
                          src={problema.foto_url} 
                          alt="Foto do problema" 
                          className="w-full h-32 object-cover rounded-md" 
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                          <p className="text-sm text-gray-400">Sem imagem</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Município</p>
                        <p className="text-sm">{problema.municipio || '-'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Prazo</p>
                      <p className="text-sm">{
                        problema.prazo_estimado 
                          ? new Date(problema.prazo_estimado).toLocaleDateString('pt-BR') 
                          : '-'
                      }</p>
                    </div>
                    
                    {problema.status === 'Resolvido' && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Resolvido no prazo</p>
                        <p className={`text-sm flex items-center ${
                          problema.resolvido_no_prazo ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {problema.resolvido_no_prazo ? 'Sim' : 'Não'}
                          {problema.resolvido_no_prazo && (
                            <Check className="w-4 h-4 ml-1 text-green-600" />
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {problema.status === 'Resolvido' && problema.descricao_resolvido && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
                      <p className="text-sm text-green-700 font-medium mb-1">Solução Implementada</p>
                      <p className="text-sm">{problema.descricao_resolvido}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">Nenhum problema encontrado com os filtros atuais.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          
          <Button 
            onClick={onConfirmarExportacao} 
            className="bg-green-500 hover:bg-green-600"
          >
            Confirmar Exportação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VisualizacaoRelatorio;
