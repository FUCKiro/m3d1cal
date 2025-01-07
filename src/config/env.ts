interface Config {
  resend: {
    apiKey: string;
    fromEmail: string;
  };
  openRouter: {
    apiKey: string;
    url: string;
  };
}

export const config: Config = {
  resend: {
    apiKey: import.meta.env.VITE_RESEND_API_KEY || '',
    fromEmail: 'onboarding@resend.dev'
  },
  openRouter: {
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    systemPrompt: 'Sei un assistente virtuale del Centro Medico Plus. Rispondi in modo conciso ma professionale, fornendo informazioni accurate sui servizi medici, gli orari e le prenotazioni. Rispondi sempre in italiano. Limita le risposte a massimo 2-3 frasi.'
  }
};

// Log configuration status (but not the actual values)
if (!config.resend.apiKey) {
  console.warn('Missing VITE_RESEND_API_KEY environment variable - email features will be disabled');
}
if (!config.openRouter.apiKey) {
  console.warn('Missing OpenRouter API key - AI chat will be disabled');
}