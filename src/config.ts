// Environment config (NEXT_PUBLIC_ prefix makes these available on client)
export const DEFAULT_MODEL_ID = process.env.NEXT_PUBLIC_DEFAULT_MODEL_ID || 'openai/gpt-oss-120b';
export const DEBUG_ON = process.env.NEXT_PUBLIC_DEBUG_ON === 'true';

// Site configuration
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Sequenzia AI';
export const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'AI-powered chat with interactive content blocks';
