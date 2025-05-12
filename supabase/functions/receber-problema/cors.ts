
// Configuração dos headers CORS
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Manipula requisições OPTIONS para CORS preflight
 */
export function handleOptionsRequest(): Response {
  return new Response(null, { headers: corsHeaders });
}
