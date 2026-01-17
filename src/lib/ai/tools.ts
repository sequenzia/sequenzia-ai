import { tool } from "ai";
import { PortfolioContentDataSchema } from "@/types/message";

export const renderPortfolio = tool({
  description: `Display interactive portfolio content blocks in the chat UI.

WHEN TO USE:
✅ User says "show", "see", "view", "display" + portfolio content
✅ User asks "what projects", "which companies", "what skills"
✅ Visual presentation would significantly enhance the answer
❌ Simple yes/no questions (e.g., "do you know Python?")
❌ Greetings, thanks, clarifications
❌ Questions answerable from system prompt metadata

PARAMETERS:

viewType (required): Portfolio section to display
  - "bio": About section with highlights
  - "experience": Work history with achievements
  - "projects": Project showcase with tech stacks
  - "education": Academic background
  - "skills": Technical skills with proficiency levels
  - "contact": Contact information and social links

filter (optional): Case-insensitive substring search
  How it works:
    - Projects: Searches name, category, description, technologies[]
    - Experience: Searches company, role, description, technologies[]
    - Skills: Searches skill names

  Examples:
    - "ai" → Matches AI-related items
    - "React" → Matches items with React in technologies
    - "TechCorp" → Matches TechCorp experience
    - "featured" → Matches featured projects

  Best practices:
    - Technology names work well: "Python", "Kubernetes"
    - Avoid terms not in portfolio (check system prompt)
    - Prefer broader filters (single-step constraint)

highlightId (optional): Focus on specific item
  Format: "[type]-[number]"
  Examples:
    - "proj-1" → AI Assistant Platform (featured)
    - "proj-2" → Real-time Collaboration SDK (featured)
    - "exp-1" → TechCorp AI (current position)

  Use when discussing a specific item in detail

CRITICAL - SINGLE STEP CONSTRAINT:
ONE tool call per turn. Choose carefully.
Uncertain filters → Use broader viewType without filter

EXAMPLES:

User: "Show me your AI projects"
✅ { viewType: "projects", filter: "ai" }

User: "What did you do at TechCorp?"
✅ { viewType: "experience", filter: "TechCorp" }

User: "Do you know TypeScript?"
❌ DON'T USE TOOL - Answer directly then offer to show projects

User: "Show me your background"
⚠️ AMBIGUOUS - Clarify first OR use bio as default`,
  inputSchema: PortfolioContentDataSchema,
  strict: true,
  execute: async (params) => {
    const { viewType, filter, highlightId } = params;

    // Import portfolio data for validation
    const { portfolioContent } = await import("@/lib/portfolio/data");

    // Initialize validation result
    let validationResult: {
      estimatedCount?: number;
      suggestion?: string;
      filterEffective?: boolean;
    } = {};

    // Validate filter effectiveness
    if (filter) {
      const filterLower = filter.toLowerCase();

      switch (viewType) {
        case "projects": {
          const matches = portfolioContent.projects.filter(
            (p) =>
              p.name.toLowerCase().includes(filterLower) ||
              p.category.toLowerCase().includes(filterLower) ||
              p.description.toLowerCase().includes(filterLower) ||
              p.technologies.some((t) => t.toLowerCase().includes(filterLower))
          );
          validationResult.estimatedCount = matches.length;

          if (matches.length === 0) {
            const categories = [
              ...new Set(portfolioContent.projects.map((p) => p.category)),
            ];
            validationResult.suggestion = `No projects match "${filter}". Available categories: ${categories.join(", ")}`;
            validationResult.filterEffective = false;
          } else {
            validationResult.filterEffective = true;
          }
          break;
        }

        case "experience": {
          const matches = portfolioContent.experience.filter(
            (e) =>
              e.company.toLowerCase().includes(filterLower) ||
              e.role.toLowerCase().includes(filterLower) ||
              e.description.toLowerCase().includes(filterLower) ||
              e.technologies.some((t) => t.toLowerCase().includes(filterLower))
          );
          validationResult.estimatedCount = matches.length;

          if (matches.length === 0) {
            const companies = portfolioContent.experience.map((e) => e.company);
            validationResult.suggestion = `No experience matches "${filter}". Companies: ${companies.join(", ")}`;
            validationResult.filterEffective = false;
          } else {
            validationResult.filterEffective = true;
          }
          break;
        }

        case "skills": {
          const matches = portfolioContent.skills.flatMap((cat) =>
            cat.skills.filter((s) =>
              s.name.toLowerCase().includes(filterLower)
            )
          );
          validationResult.estimatedCount = matches.length;

          if (matches.length === 0) {
            validationResult.suggestion = `No skills match "${filter}". Try a broader technology term.`;
            validationResult.filterEffective = false;
          } else {
            validationResult.filterEffective = true;
          }
          break;
        }

        default:
          // Bio, education, contact don't have effective filtering
          validationResult.filterEffective = false;
      }
    }

    // Validate highlightId exists
    if (highlightId) {
      let idExists = false;

      switch (viewType) {
        case "projects":
          idExists = portfolioContent.projects.some(
            (p) => p.id === highlightId
          );
          break;
        case "experience":
          idExists = portfolioContent.experience.some(
            (e) => e.id === highlightId
          );
          break;
        case "education":
          idExists = portfolioContent.education.some(
            (e) => e.id === highlightId
          );
          break;
      }

      if (!idExists) {
        validationResult.suggestion = `highlightId "${highlightId}" not found in ${viewType}`;
      }
    }

    // Return params with metadata (LLM can read _meta, UI ignores it)
    return {
      ...params,
      _meta: validationResult,
    };
  },
});
