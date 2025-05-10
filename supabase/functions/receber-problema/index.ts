
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configuração dos headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface para o request do problema
interface ProblemaRequest {
  telefone: string;
  descricao: string;
  gabinete_id?: string;
  foto_url?: string;
  municipio?: string;
}

serve(async (req) => {
  // Tratamento para requisições OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
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
    
    // Preparando o objeto para inserção
    const novoProblema = {
      telefone: problemaData.telefone,
      descricao: problemaData.descricao,
      gabinete_id: problemaData.gabinete_id || null,
      foto_url: problemaData.foto_url || null,
      municipio: problemaData.municipio || null,
      status: "Pendente"
    };
    
    console.log("Recebendo novo problema:", novoProblema);
    
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
