import "server-only";

import type { AgentConfig } from "./types";
import { defaultAgent } from "./default.agent";
import { coderAgent } from "./coder.agent";
import { portfolioAgent } from "./portfolio.agent";

// Registry of all available agents
const agents: Record<string, AgentConfig> = {
  [defaultAgent.id]: defaultAgent,
  [coderAgent.id]: coderAgent,
  [portfolioAgent.id]: portfolioAgent,
};

// Default fallback agent ID
const DEFAULT_AGENT_ID = "default";

/**
 * Get the currently active agent based on ACTIVE_AGENT env var
 */
export function getActiveAgent(): AgentConfig {
  const agentId = process.env.ACTIVE_AGENT || DEFAULT_AGENT_ID;

  const agent = agents[agentId];

  if (!agent) {
    console.warn(
      `Agent "${agentId}" not found, falling back to "${DEFAULT_AGENT_ID}"`
    );
    return agents[DEFAULT_AGENT_ID];
  }

  return agent;
}

/**
 * Get an agent by ID
 */
export function getAgentById(id: string): AgentConfig | undefined {
  return agents[id];
}

/**
 * List all available agent IDs
 */
export function listAgentIds(): string[] {
  return Object.keys(agents);
}

export type { AgentConfig };
