interface Config {
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  openRouter: {
    apiKey: string;
    url: string;
  };
}

export const config: Config = {
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
  },
  openRouter: {
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    systemPrompt: 'Sei un assistente virtuale del Centro Medico Plus. Rispondi in modo conciso ma professionale, fornendo informazioni accurate sui servizi medici, gli orari e le prenotazioni. Rispondi sempre in italiano. Limita le risposte a massimo 2-3 frasi.'
  }
};

// Log configuration status (but not the actual values)
if (!config.emailjs.publicKey) {
  console.warn('Missing EmailJS configuration - email features will be disabled');
}
if (!config.openRouter.apiKey) {
  console.warn('Missing OpenRouter API key - AI chat will be disabled');
}