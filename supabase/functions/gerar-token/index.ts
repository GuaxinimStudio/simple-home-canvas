
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.8/mod.ts";

// Configuração dos headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Chave secreta para assinatura do token
// Em produção, seria melhor armazenar isso como uma variável de ambiente
const SECRET_KEY = "resolve-leg-api-secret-key";

serve(async (req) => {
  // Tratamento para requisições OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Geração simples de um token JWT
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    
    // Definição das claims do token (payload)
    const payload = {
      iss: "resolve-leg-api",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Expira em 30 dias
      iat: Math.floor(Date.now() / 1000),
    };
    
    // Criação do token JWT
    const token = await create({ alg: "HS256", typ: "JWT" }, payload, key);
    
    console.log("Token gerado com sucesso");
    
    // Retorna o token no formato adequado para uso com o cabeçalho Authorization
    return new Response(
      JSON.stringify({ 
        token: token,
        authorization_header: `Bearer ${token}` 
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      }
    );
  } catch (error) {
    console.error("Erro ao gerar token:", error);
    
    return new Response(
      JSON.stringify({ 
        erro: "Erro ao gerar token", 
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
