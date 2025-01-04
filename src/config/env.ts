interface Config {
  resend: {
    apiKey: string;
    fromEmail: string;
  };
}

export const config: Config = {
  resend: {
    apiKey: import.meta.env.VITE_RESEND_API_KEY || '',
    fromEmail: 'onboarding@resend.dev'  // Default Resend sender email
  }
};

// Log configuration status (but not the actual values)
if (!config.resend.apiKey) {
  console.warn('Missing VITE_RESEND_API_KEY environment variable - email features will be disabled');
}