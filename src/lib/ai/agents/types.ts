import type { ToolSet } from "ai";

export interface AgentConfig {
  /** Unique identifier, matches ACTIVE_AGENT env var */
  id: string;

  /** Human-readable name */
  name: string;

  /** System prompt / instructions for the agent */
  instructions: string;

  /** Tools available to this agent */
  tools: ToolSet;

  /** Maximum multi-step iterations (default: 1) */
  maxSteps?: number;

  /** Optional description for documentation */
  description?: string;

  /** Optional suggestion prompts for quick actions */
  suggestions?: string[];
}
