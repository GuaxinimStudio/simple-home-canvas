
// Chave secreta para verificação do token
const SECRET_KEY = "resolve-leg-api-secret-key";

/**
 * Verifica a validade do token JWT
 * @param authHeader - Cabeçalho de autorização
 * @returns true se o token for válido, lança erro caso contrário
 */
export async function verificarToken(authHeader: string | null): Promise<boolean> {
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

import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
