// Client-safe model definitions
export interface Model {
  id: string;
  name: string;
  chef: string;
  chefSlug: string;
  providers: string[];
  description?: string;
}

export const MODELS: Model[] = [
  {
    id: "openai/gpt-5-nano",
    name: "GPT-5 Nano",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai"],
    description: "Fast and efficient",
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai"],
    description: "Fast and efficient",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
    description: "Fast and efficient",
  },
  {
    id: "openai/gpt-oss-120b",
    name: "GPT-OSS 120B",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["baseten"],
    description: "Fast and efficient",
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    chef: "Google",
    chefSlug: "google",
    providers: ["google"],
    description: "Fast multimodal model",
  },
  {
    id: "deepseek/deepseek-v3.2",
    name: "DeepSeek V3.2",
    chef: "DeepSeek",
    chefSlug: "deepseek",
    providers: ["deepseek"],
    description: "Fast and efficient",
  },
];

export const DEFAULT_MODEL_ID = "openai/gpt-4o-mini";

export function getModelById(id: string): Model | undefined {
  return MODELS.find((model) => model.id === id);
}

export function isValidModelId(id: string): boolean {
  return MODELS.some((model) => model.id === id);
}

export function getModelsByChef(): Map<string, Model[]> {
  const grouped = new Map<string, Model[]>();
  for (const model of MODELS) {
    const existing = grouped.get(model.chef) || [];
    grouped.set(model.chef, [...existing, model]);
  }
  return grouped;
}

// Get unique chefs in order of appearance
export function getChefs(): string[] {
  return Array.from(new Set(MODELS.map((model) => model.chef)));
}
