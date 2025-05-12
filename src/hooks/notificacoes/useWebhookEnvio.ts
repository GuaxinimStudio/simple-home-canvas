
export const useWebhookEnvio = () => {
  // Constante configurável para o intervalo entre envios (em milissegundos)
  // Valor padrão ajustado para 800ms
  const DEFAULT_DELAY_BETWEEN_SENDS_MS = 800;
  
  const enviarParaWebhook = async (
    telefones: string[], 
    texto: string, 
    temArquivo: boolean, 
    tipoArquivo: string | null,
    delayEntreEnvios: number = DEFAULT_DELAY_BETWEEN_SENDS_MS // Novo parâmetro opcional
  ) => {
    const webhookUrl = 'https://hook.us1.make.com/4ktz9s09wo5kt8a4fhhsb46pudkwan6u';
    
    try {
      // Verificar se o texto é um JSON válido (novo formato de resposta ao cidadão)
      let body;
      try {
        // Tentar fazer o parse do texto como JSON (formato novo)
        body = JSON.parse(texto);
      } catch (e) {
        // Se falhar, considerar como o formato anterior para notificações
        // Determinar os valores para os campos
        const notificacaoSimples = !temArquivo;
        const temImagem = temArquivo && tipoArquivo?.startsWith('image/');
        const temPdf = temArquivo && tipoArquivo === 'application/pdf';
        
        body = {
          telefone: telefones[0],
          texto,
          notificacao: notificacaoSimples ? 'sim' : 'não',
          imagem: temImagem ? 'sim' : 'não',
          pdf: temPdf ? 'sim' : 'não'
        };
      }
      
      // Enviar os dados para cada telefone da lista
      for (const telefone of telefones) {
        // Se já tiver um objeto JSON montado, apenas adicionar o telefone se não existir
        if (!body.telefone && !body.valor_5_telefone) {
          body.telefone = telefone;
        }
        
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        });
        
        // Atraso configurável entre envios para evitar sobrecarga do webhook
        await new Promise(resolve => setTimeout(resolve, delayEntreEnvios));
      }
      
      console.log('Notificação enviada com sucesso para o webhook', body);
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      // Continuamos mesmo com erro no webhook para salvar no banco
    }
  };

  return { enviarParaWebhook };
};
