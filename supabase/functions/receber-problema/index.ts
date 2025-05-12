
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

// Configuração dos headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Chave secreta para verificação do token (deve ser a mesma usada na geração)
const SECRET_KEY = "resolve-leg-api-secret-key";

// Interface para o request do problema
interface ProblemaRequest {
  telefone: string;
  descricao: string;
  gabinete_id?: string;
  foto_base64?: string;  // Base64 da imagem
  foto_url?: string;     // URL externa da imagem
  municipio?: string;
}

/**
 * Manipula requisições OPTIONS para CORS preflight
 */
function handleOptionsRequest(): Response {
  return new Response(null, { headers: corsHeaders });
}

/**
 * Verifica a validade do token JWT
 * @param authHeader - Cabeçalho de autorização
 * @returns true se o token for válido, lança erro caso contrário
 */
async function verificarToken(authHeader: string | null): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token de autenticação ausente ou inválido");
  }

  const token = authHeader.split(" ")[1];
  
  try {
    // Importa a chave para verificação
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    
    // Verifica o token
    await verify(token, key);
    return true;
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    throw new Error("Token inválido ou expirado");
  }
}

/**
 * Cria ou verifica a existência do bucket para armazenamento de imagens
 * @param supabaseClient - Cliente Supabase
 */
async function verificarOuCriarBucket(supabaseClient: any): Promise<void> {
  try {
    const { data: bucketData, error: bucketError } = await supabaseClient
      .storage
      .getBucket('problema-imagens');
      
    if (bucketError && bucketError.message.includes('not found')) {
      console.log("Bucket não encontrado, criando...");
      await supabaseClient
        .storage
        .createBucket('problema-imagens', {
          public: true,
          fileSizeLimit: 5242880 // 5MB
        });
    }
  } catch (bucketErr) {
    console.error("Erro ao verificar/criar bucket:", bucketErr);
  }
}

/**
 * Processa uma URL externa de imagem
 * @param supabaseClient - Cliente Supabase
 * @param imageUrl - URL externa da imagem
 * @returns URL pública da imagem armazenada ou a URL original em caso de erro
 */
async function processarImagemExterna(supabaseClient: any, imageUrl: string): Promise<string> {
  try {
    console.log("Processando URL externa da imagem:", imageUrl);
    
    // Fazer download da imagem externa
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Falha ao baixar imagem: ${imageResponse.status}`);
    }
    
    const imageBlob = await imageResponse.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const imageBytes = new Uint8Array(arrayBuffer);
    
    return await enviarImagemParaBucket(supabaseClient, imageBytes);
  } catch (downloadErr) {
    console.error("Erro ao processar download/upload de imagem externa:", downloadErr);
    // Usa a URL original como fallback
    console.log("Usando URL original como fallback:", imageUrl);
    return imageUrl;
  }
}

/**
 * Processa uma imagem em formato base64
 * @param supabaseClient - Cliente Supabase
 * @param base64Data - Dados da imagem em base64
 * @returns URL pública da imagem ou null em caso de erro
 */
async function processarImagemBase64(supabaseClient: any, base64Data: string): Promise<string | null> {
  try {
    console.log("Processando imagem em base64");
    
    // Extrair dados do base64 e converter para Uint8Array
    const cleanBase64 = base64Data.split(',')[1] || base64Data;
    const byteString = atob(cleanBase64);
    const arrayBuffer = new Uint8Array(byteString.length);
    
    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }
    
    return await enviarImagemParaBucket(supabaseClient, arrayBuffer);
  } catch (uploadErr) {
    console.error("Erro ao processar upload de imagem base64:", uploadErr);
    return null;
  }
}

/**
 * Envia uma imagem para o bucket de armazenamento
 * @param supabaseClient - Cliente Supabase
 * @param imageData - Dados da imagem em formato Uint8Array
 * @returns URL pública da imagem armazenada ou null em caso de erro
 */
async function enviarImagemParaBucket(supabaseClient: any, imageData: Uint8Array): Promise<string | null> {
  // Gerar um nome único para o arquivo
  const timestamp = new Date().getTime();
  const rand = Math.floor(Math.random() * 1000);
  const fileName = `problema-${timestamp}-${rand}.jpg`;
  
  // Fazer o upload da imagem para o bucket
  const { data: uploadData, error: uploadError } = await supabaseClient
    .storage
    .from('problema-imagens')
    .upload(fileName, imageData, {
      contentType: 'image/jpeg',
      upsert: false
    });
    
  if (uploadError) {
    console.error("Erro ao fazer upload da imagem:", uploadError);
    return null;
  }
  
  // Obter URL pública da imagem
  const { data: publicUrlData } = supabaseClient
    .storage
    .from('problema-imagens')
    .getPublicUrl(fileName);
    
  const publicUrl = publicUrlData.publicUrl;
  console.log("URL da imagem salva no bucket:", publicUrl);
  return publicUrl;
}

/**
 * Verifica e valida o gabinete_id fornecido
 * @param supabaseClient - Cliente Supabase
 * @param gabineteId - ID do gabinete a ser validado
 * @returns O ID do gabinete validado ou null se inválido
 */
async function verificarGabinete(supabaseClient: any, gabineteId?: string): Promise<string | null> {
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
async function inserirProblema(supabaseClient: any, dadosProblema: any) {
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
