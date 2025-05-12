
import type { ProblemaData } from "./types.ts";

/**
 * Verifica e valida o gabinete_id fornecido
 * @param supabaseClient - Cliente Supabase
 * @param gabineteId - ID do gabinete a ser validado
 * @returns O ID do gabinete validado ou null se inválido
 */
export async function verificarGabinete(supabaseClient: any, gabineteId?: string): Promise<string | null> {
  // Se não tiver gabineteId, retorna null diretamente
  if (!gabineteId) {
    console.log("Nenhum gabinete_id fornecido na requisição");
    return null;
  }
  
  try {
    console.log(`Verificando existência do gabinete com ID: ${gabineteId}`);
    
    const { data: gabineteData, error: gabineteError } = await supabaseClient
      .from('gabinetes')
      .select('id, gabinete')
      .eq('id', gabineteId)
      .single();
      
    if (gabineteError) {
      console.error("Erro ao verificar gabinete:", gabineteError);
      return null;
    }
    
    if (!gabineteData) {
      console.warn("Gabinete não encontrado:", gabineteId);
      return null;
    }
    
    console.log("Gabinete encontrado, associando ao problema:", gabineteData.id, gabineteData.gabinete);
    return gabineteData.id;
  } catch (gabErr) {
    console.warn("Erro ao verificar gabinete:", gabErr);
    return null;
  }
}

/**
 * Insere o problema no banco de dados
 * @param supabaseClient - Cliente Supabase
 * @param dadosProblema - Dados do problema a ser inserido
 * @returns O problema inserido
 */
export async function inserirProblema(supabaseClient: any, dadosProblema: ProblemaData) {
  console.log("Inserindo problema com dados:", dadosProblema);
  
  const { data: problema, error } = await supabaseClient
    .from("problemas")
    .insert(dadosProblema)
    .select()
    .single();
  
  if (error) {
    console.error("Erro ao inserir problema:", error);
    throw new Error(`Erro ao inserir problema: ${error.message}`);
  }
  
  console.log("Problema inserido com sucesso:", problema);
  return problema;
}
