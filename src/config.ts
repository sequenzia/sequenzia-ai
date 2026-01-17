// Environment config (NEXT_PUBLIC_ prefix makes these available on client)
export const DEFAULT_MODEL_ID = process.env.NEXT_PUBLIC_DEFAULT_MODEL_ID || 'openai/gpt-oss-120b';
export const DEBUG_ON = process.env.NEXT_PUBLIC_DEBUG_ON === 'true';
