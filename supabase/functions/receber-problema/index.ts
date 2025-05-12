
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ProblemaRequest } from "./types.ts";
import { corsHeaders, handleOptionsRequest } from "./cors.ts";
import { verificarToken } from "./auth.ts";
import { 
  verificarOuCriarBucket, 
  processarImagemExterna, 
  processarImagemBase64 
} from "./storage.ts";
import { verificarGabinete, inserirProblema } from "./database.ts";

/**
 * Função principal para processar o recebimento de um problema
 */
async function processarProblema(req: Request) {
  // Verificação do token de autenticação
  await verificarToken(req.headers.get("Authorization"));
  
  // Criação do cliente Supabase com as credenciais do ambiente
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Extraindo os dados do corpo da requisição
  const problemaData: ProblemaRequest = await req.json();
  
  // Validações básicas dos campos obrigatórios
  if (!problemaData.telefone || !problemaData.descricao) {
    throw new Error("Os campos telefone e descrição são obrigatórios");
  }
  
  // Verificar e criar o bucket se necessário
  await verificarOuCriarBucket(supabaseClient);
  
  let foto_url = null;
  
  // Processamento da imagem (URL externa ou base64)
  if (problemaData.foto_url) {
    foto_url = await processarImagemExterna(supabaseClient, problemaData.foto_url);
  } else if (problemaData.foto_base64) {
    foto_url = await processarImagemBase64(supabaseClient, problemaData.foto_base64);
  }
  
  // Verificação do gabinete - Agora passando diretamente o ID do gabinete da requisição
  const gabineteId = await verificarGabinete(supabaseClient, problemaData.gabinete_id);
  
  // Preparando o objeto para inserção
  const novoProblema = {
    telefone: problemaData.telefone,
    descricao: problemaData.descricao,
    gabinete_id: gabineteId,
    foto_url: foto_url,
    municipio: problemaData.municipio || null,
    status: "Pendente"
  };
  
  // Inserção do problema na tabela
  const problema = await inserirProblema(supabaseClient, novoProblema);
  
  // Resposta de sucesso
  return new Response(
    JSON.stringify({ 
      mensagem: "Problema registrado com sucesso", 
      problema 
    }),
    { 
      status: 201, 
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders 
      }
    }
  );
}

/**
 * Handler principal da Edge Function
 */
serve(async (req) => {
  // Tratamento para requisições OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }
  
  try {
    return await processarProblema(req);
  } catch (error) {
    console.error("Erro na função receber-problema:", error);
    
    const status = error.message.includes("Token") ? 401 : 500;
    const mensagemErro = error.message || "Erro interno no servidor";
    
    return new Response(
      JSON.stringify({ 
        erro: mensagemErro, 
        detalhes: error.message 
      }),
      { 
        status,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      }
    );
  }
});
