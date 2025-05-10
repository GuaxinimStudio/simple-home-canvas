
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Municipio {
  id: number;
  nome: string;
}

const useLocalizacao = () => {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedEstado, setSelectedEstado] = useState<string>('');

  // Carregar estados do Brasil via API do IBGE
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        if (!response.ok) {
          throw new Error('Falha ao carregar estados');
        }
        const data = await response.json();
        // Ordenar estados por nome
        const estadosOrdenados = data.sort((a: Estado, b: Estado) => a.nome.localeCompare(b.nome));
        setEstados(estadosOrdenados);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
        toast.error('Não foi possível carregar a lista de estados.');
      }
    };

    fetchEstados();
  }, []);

  // Carregar municípios quando um estado for selecionado
  useEffect(() => {
    if (!selectedEstado) {
      setMunicipios([]);
      return;
    }

    const fetchMunicipios = async () => {
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios`);
        if (!response.ok) {
          throw new Error('Falha ao carregar municípios');
        }
        const data = await response.json();
        // Ordenar municípios por nome
        const municipiosOrdenados = data.sort((a: Municipio, b: Municipio) => a.nome.localeCompare(b.nome));
        setMunicipios(municipiosOrdenados);
      } catch (error) {
        console.error('Erro ao buscar municípios:', error);
        toast.error('Não foi possível carregar a lista de municípios.');
      }
    };

    fetchMunicipios();
  }, [selectedEstado]);

  return {
    estados,
    municipios,
    selectedEstado,
    setSelectedEstado
  };
};

export default useLocalizacao;
