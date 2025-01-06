interface Config {
  resend: {
    apiKey: string;
    fromEmail: string;
  };
  deepseek: {
    apiKey: string;
  };
}

export const config: Config = {
  resend: {
    apiKey: import.meta.env.VITE_RESEND_API_KEY || '',
    fromEmail: 'onboarding@resend.dev'
  },
  deepseek: {
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || ''
  }
};

// Log configuration status (but not the actual values)
if (!config.resend.apiKey) {
  console.warn('Missing VITE_RESEND_API_KEY environment variable - email features will be disabled');
}
if (!config.deepseek.apiKey) {
  console.warn('Missing VITE_DEEPSEEK_API_KEY environment variable - AI features will be disabled');
}