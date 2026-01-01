/**
 * Shared agent metadata
 *
 * Single source of truth for agent metadata (id, name, description, suggestions).
 * This file has no server-only dependencies and can be imported anywhere.
 */

export interface AgentMetadata {
  id: string;
  name: string;
  description?: string;
  suggestions?: Array<{ label: string; prompt?: string }>;
}

export const defaultAgentMeta: AgentMetadata = {
  id: "default",
  name: "Sequenzia",
  description: "Default AI Agent with interactive content generation",
  suggestions: [
    {
      label: "Create a feedback form",
      prompt:
        "Create a feedback form for my website with fields for name, email, rating, and comments.",
    },
    {
      label: "Show me a chart",
      prompt: "Show me a bar chart example with sample data for monthly sales.",
    },
    {
      label: "Generate TypeScript code",
      prompt:
        "Generate a TypeScript utility function that debounces function calls.",
    },
    {
      label: "Create a product card",
      prompt:
        "Create a product card with an image, title, description, price, and add to cart button.",
    },
  ],
};

export const coderAgentMeta: AgentMetadata = {
  id: "coder",
  name: "Coding Agent",
  description: "Specialized Coding Agent",
  suggestions: [
    {
      label: "React data fetching hook",
      prompt:
        "Write a React hook for fetching data with loading and error states, using TypeScript.",
    },
    {
      label: "TypeScript utility function",
      prompt:
        "Create a TypeScript utility function for deep cloning objects with proper type inference.",
    },
    {
      label: "Python class example",
      prompt:
        "Show me a Python class example with inheritance, properties, and type hints.",
    },
    {
      label: "Express.js route handler",
      prompt:
        "Generate an Express.js route handler with input validation and error handling.",
    },
  ],
};

export const portfolioAgentMeta: AgentMetadata = {
  id: "portfolio",
  name: "Portfolio Agent",
  description:
    "Interactive Portfolio Agent",
  suggestions: [
    {
      label: "Bio",
      prompt: "Show me your bio",
    },
    {
      label: "Experience",
      prompt: "Show me your experience",
    },
    {
      label: "Projects",
      prompt: "Show me your projects",
    },
    {
      label: "Education",
      prompt: "Show me your education",
    },
    {
      label: "Skills",
      prompt: "Show me your skills",
    },
    {
      label: "Contact",
      prompt: "Show me your contact information",
    },
  ],
};

export const AGENTS: AgentMetadata[] = [
  defaultAgentMeta,
  coderAgentMeta,
  portfolioAgentMeta,
];

export const DEFAULT_AGENT_ID = "default";

export function getAgentMetadataById(id: string): AgentMetadata | undefined {
  return AGENTS.find((agent) => agent.id === id);
}

export function listAgentMetadata(): AgentMetadata[] {
  return AGENTS;
}
