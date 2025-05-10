
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

serve(async (req) => {
  // Tratamento para requisições OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Verificação do token de autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ erro: "Token de autenticação ausente ou inválido" }),
        { 
          status: 401, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        }
      );
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
    } catch (error) {
      console.error("Erro na verificação do token:", error);
      return new Response(
        JSON.stringify({ erro: "Token inválido ou expirado" }),
        { 
          status: 401, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        }
      );
    }

    // Criação do cliente Supabase com as credenciais do ambiente
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extraindo os dados do corpo da requisição
    const problemaData: ProblemaRequest = await req.json();
    
    // Validações básicas dos campos obrigatórios
    if (!problemaData.telefone || !problemaData.descricao) {
      return new Response(
        JSON.stringify({ 
          erro: "Os campos telefone e descrição são obrigatórios" 
        }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        }
      );
    }
    
    let foto_url = null;
    
    // Verificar se o bucket existe, caso contrário, criá-lo
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
    
    // CASO 1: Se receber uma URL externa de imagem
    if (problemaData.foto_url) {
      try {
        console.log("Processando URL externa da imagem:", problemaData.foto_url);
        
        // Fazer download da imagem externa
        const imageResponse = await fetch(problemaData.foto_url);
        
        if (!imageResponse.ok) {
          throw new Error(`Falha ao baixar imagem: ${imageResponse.status}`);
        }
        
        const imageBlob = await imageResponse.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        const imageBytes = new Uint8Array(arrayBuffer);
        
        // Gerar um nome único para o arquivo
        const timestamp = new Date().getTime();
        const rand = Math.floor(Math.random() * 1000);
        const fileName = `problema-${timestamp}-${rand}.jpg`;
        
        // Fazer o upload da imagem para o bucket
        const { data: uploadData, error: uploadError } = await supabaseClient
          .storage
          .from('problema-imagens')
          .upload(fileName, imageBytes, {
            contentType: 'image/jpeg',
            upsert: false
          });
          
        if (uploadError) {
          console.error("Erro ao fazer upload da imagem externa:", uploadError);
          // Usa a URL original como fallback
          foto_url = problemaData.foto_url;
        } else {
          // Obter URL pública da imagem
          const { data: publicUrlData } = supabaseClient
            .storage
            .from('problema-imagens')
            .getPublicUrl(fileName);
            
          foto_url = publicUrlData.publicUrl;
          console.log("URL da imagem externa salva no bucket:", foto_url);
        }
      } catch (downloadErr) {
        console.error("Erro ao processar download/upload de imagem externa:", downloadErr);
        // Usa a URL original como fallback
        foto_url = problemaData.foto_url;
        console.log("Usando URL original como fallback:", foto_url);
      }
    }
    // CASO 2: Se receber uma imagem em base64
    else if (problemaData.foto_base64) {
      try {
        console.log("Processando imagem em base64");
        
        // Extrair dados do base64 e converter para Uint8Array
        const base64Data = problemaData.foto_base64.split(',')[1] || problemaData.foto_base64;
        const byteString = atob(base64Data);
        const arrayBuffer = new Uint8Array(byteString.length);
        
        for (let i = 0; i < byteString.length; i++) {
          arrayBuffer[i] = byteString.charCodeAt(i);
        }
        
        // Gerar um nome único para o arquivo
        const timestamp = new Date().getTime();
        const rand = Math.floor(Math.random() * 1000);
        const fileName = `problema-${timestamp}-${rand}.jpg`;
        
        // Fazer o upload da imagem para o bucket
        const { data: uploadData, error: uploadError } = await supabaseClient
          .storage
          .from('problema-imagens')
          .upload(fileName, arrayBuffer, {
            contentType: 'image/jpeg',
            upsert: false
          });
          
        if (uploadError) {
          console.error("Erro ao fazer upload da imagem base64:", uploadError);
        } else {
          // Obter URL pública da imagem
          const { data: publicUrlData } = supabaseClient
            .storage
            .from('problema-imagens')
            .getPublicUrl(fileName);
            
          foto_url = publicUrlData.publicUrl;
          console.log("URL da imagem base64 salva no bucket:", foto_url);
        }
      } catch (uploadErr) {
        console.error("Erro ao processar upload de imagem base64:", uploadErr);
      }
    }
    
    // Verificar se o gabinete_id é um UUID válido ou null
    const gabineteId = problemaData.gabinete_id && problemaData.gabinete_id !== "id-do-gabinete" 
      ? problemaData.gabinete_id 
      : null;
    
    // Preparando o objeto para inserção
    const novoProblema = {
      telefone: problemaData.telefone,
      descricao: problemaData.descricao,
      gabinete_id: gabineteId,
      foto_url: foto_url,
      municipio: problemaData.municipio || null,
      status: "Pendente"
    };
    
    console.log("Inserindo problema com dados:", novoProblema);
    
    // Inserção do problema na tabela
    const { data: problema, error } = await supabaseClient
      .from("problemas")
      .insert(novoProblema)
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao inserir problema:", error);
      return new Response(
        JSON.stringify({ erro: "Erro ao inserir problema", detalhes: error.message }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        }
      );
    }
    
    console.log("Problema inserido com sucesso:", problema);
    
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
  } catch (error) {
    console.error("Erro na função receber-problema:", error);
    
    return new Response(
      JSON.stringify({ 
        erro: "Erro interno no servidor", 
        detalhes: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      }
    );
  }
});
