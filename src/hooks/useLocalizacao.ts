
import { useState, useEffect } from 'react';

// Interface para estados
interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

// Interface para municípios
interface Municipio {
  id: number;
  nome: string;
}

const useLocalizacao = () => {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        const data = await response.json();
        setEstados(data);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstados();
  }, []);

  useEffect(() => {
    if (selectedEstado) {
      fetchMunicipios(selectedEstado);
    } else {
      setMunicipios([]);
    }
  }, [selectedEstado]);

  const fetchMunicipios = async (estadoSigla: string) => {
    if (!estadoSigla) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios?orderBy=nome`);
      const data = await response.json();
      setMunicipios(data);
    } catch (error) {
      console.error('Erro ao carregar municípios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    estados, 
    municipios, 
    selectedEstado, 
    setSelectedEstado, 
    isLoading,
    fetchMunicipios 
  };
};

export default useLocalizacao;
