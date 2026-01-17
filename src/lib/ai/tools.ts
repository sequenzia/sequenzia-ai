import { tool } from "ai";
import { PortfolioContentDataSchema } from "@/types/message";

export const renderPortfolio = tool({
  description: `Display portfolio content in the chat. Use when:
- User asks about bio, experience, projects, education, skills, or contact info
- User wants to "see" or "show" portfolio information
- Visual content would enhance understanding of the portfolio

Parameters:
- viewType: The portfolio section to display (bio, experience, projects, education, skills, contact)
- filter: Optional search filter (e.g., "ai" for AI projects, company name for experience)
- highlightId: Optional ID of specific item to focus on (e.g., "proj-1", "exp-2")`,
  inputSchema: PortfolioContentDataSchema,
  strict: true,
  execute: async (params) => params,
});
