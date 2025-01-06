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
    url: 'https://openrouter.ai/api/v1/chat/completions'
  }
};

// Log configuration status (but not the actual values)
if (!config.resend.apiKey) {
  console.warn('Missing VITE_RESEND_API_KEY environment variable - email features will be disabled');
}
if (!config.openRouter.apiKey) {
  console.warn('Missing VITE_OPENROUTER_API_KEY environment variable - AI features will be disabled');
}