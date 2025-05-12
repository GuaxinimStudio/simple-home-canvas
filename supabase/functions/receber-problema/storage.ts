
/**
 * Cria ou verifica a existência do bucket para armazenamento de imagens
 * @param supabaseClient - Cliente Supabase
 */
export async function verificarOuCriarBucket(supabaseClient: any): Promise<void> {
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
export async function processarImagemExterna(supabaseClient: any, imageUrl: string): Promise<string> {
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
export async function processarImagemBase64(supabaseClient: any, base64Data: string): Promise<string | null> {
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
export async function enviarImagemParaBucket(supabaseClient: any, imageData: Uint8Array): Promise<string | null> {
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
