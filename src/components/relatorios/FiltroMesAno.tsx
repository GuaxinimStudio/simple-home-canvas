
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltroMesAnoProps {
  mes: string | null;
  ano: string | null;
  onChangeMes: (mes: string | null) => void;
  onChangeAno: (ano: string | null) => void;
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

const FiltroMesAno: React.FC<FiltroMesAnoProps> = ({ 
  mes, 
  ano, 
  onChangeMes, 
  onChangeAno 
}) => {
  const anos = gerarAnos();

  const getNomeMes = (mesNumero: string | null) => {
    if (!mesNumero) return "Selecione o mês";
    return meses.find(mes => mes.value === mesNumero)?.label || "Selecione o mês";
  };

  const handleChangeMes = (value: string) => {
    onChangeMes(value || null);
  };

  const handleChangeAno = (value: string) => {
    onChangeAno(value || null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Select 
          value={mes || undefined} 
          onValueChange={handleChangeMes}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={getNomeMes(mes)} />
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
          value={ano || undefined} 
          onValueChange={handleChangeAno}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={ano || 'Selecione o ano'} />
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
  );
};

export default FiltroMesAno;
