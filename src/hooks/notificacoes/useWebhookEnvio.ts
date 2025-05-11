
export const useWebhookEnvio = () => {
  const enviarParaWebhook = async (
    telefones: string[], 
    texto: string, 
    temArquivo: boolean, 
    tipoArquivo: string | null
  ) => {
    const webhookUrl = 'https://hook.us1.make.com/4ktz9s09wo5kt8a4fhhsb46pudkwan6u';
    
    try {
      // Determinar os valores para os campos
      const notificacaoSimples = !temArquivo;
      const temImagem = temArquivo && tipoArquivo?.startsWith('image/');
      const temPdf = temArquivo && tipoArquivo === 'application/pdf';
      
      for (const telefone of telefones) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telefone,
            texto,
            notificacao: notificacaoSimples ? 'sim' : 'não',
            imagem: temImagem ? 'sim' : 'não',
            pdf: temPdf ? 'sim' : 'não'
          })
        });
        
        // Pequeno atraso para evitar sobrecarga do webhook
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      console.log('Notificação enviada com sucesso para o webhook');
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      // Continuamos mesmo com erro no webhook para salvar no banco
    }
  };

  return { enviarParaWebhook };
};
