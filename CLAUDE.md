# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sequenzia AI is a streaming AI chat application functioning as an interactive portfolio showcase. The AI assistant helps visitors explore professional background, experience, projects, and skills through conversation and inline portfolio content blocks.

## Tech Stack

- **Framework:** Next.js 16.1 + React 19.2 + TypeScript
- **AI:** Vercel AI SDK v6 + AI Gateway
- **UI:** Custom AI Elements + shadcn/ui (New York style)
- **Styling:** Tailwind CSS v4 with OKLch color system
- **Animation:** Framer Motion / Motion
- **Validation:** Zod v4
- **State:** React Context + TanStack Query
- **Markdown:** Streamdown (streaming markdown renderer)

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── config.ts                  # Centralized environment config (NEXT_PUBLIC_* vars)
├── app/
│   ├── api/chat/route.ts      # Streaming chat endpoint
│   ├── globals.css            # OKLch theme tokens + Tailwind v4
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main chat page
├── components/
│   ├── ai-elements/           # AI-specific UI components
│   │   ├── code-block.tsx     # Syntax-highlighted code
│   │   ├── conversation.tsx   # Conversation container
│   │   ├── loader.tsx         # Loading indicators
│   │   ├── message.tsx        # Message + attachments + branching
│   │   ├── model-selector.tsx # Model picker dialog (cmdk-based)
│   │   ├── prompt-input.tsx   # Message input field
│   │   ├── reasoning.tsx      # Collapsible reasoning display
│   │   ├── shimmer.tsx        # Skeleton loading animation
│   │   ├── suggestion.tsx     # Quick action suggestions
│   │   └── tool.tsx           # Tool invocation display
│   ├── blocks/                # Content block renderers
│   │   ├── CardContent.tsx    # Rich cards with actions
│   │   ├── ChartContent.tsx   # Recharts visualizations
│   │   ├── CodeContent.tsx    # Shiki syntax highlighting
│   │   ├── ContentBlock.tsx   # Router component
│   │   ├── FormContent.tsx    # Dynamic forms
│   │   ├── PortfolioBlock.tsx # Portfolio section renderer
│   │   └── portfolio/         # Portfolio sub-components
│   │       ├── Bio.tsx        # Bio/about section
│   │       ├── Contact.tsx    # Contact info section
│   │       ├── Education.tsx  # Education section
│   │       ├── Experience.tsx # Work experience section
│   │       ├── Projects.tsx   # Projects section
│   │       ├── Skills.tsx     # Skills section
│   │       └── index.ts       # Barrel export
│   ├── chat/                  # Chat components
│   │   ├── ChatContainer.tsx  # Message list
│   │   ├── ChatMessage.tsx    # Parts-based rendering
│   │   ├── ChatProvider.tsx   # useChat wrapper + model state
│   │   └── InputComposer.tsx  # Input + model selector + suggestions
│   ├── providers/             # React context providers
│   │   ├── QueryProvider.tsx  # TanStack Query
│   │   └── ThemeProvider.tsx  # Light/dark/system theme
│   ├── ui/                    # shadcn/ui components
│   └── Header.tsx             # Theme toggle
├── lib/
│   ├── ai/
│   │   ├── models.server.ts   # Server-only AI Gateway factory
│   │   ├── models.ts          # Client-safe model definitions
│   │   └── tools.ts           # Tool definition (renderPortfolio)
│   ├── motion/                # Animation variants + hooks
│   │   ├── hooks.ts           # Animation hooks
│   │   ├── index.ts           # Barrel export
│   │   └── variants.ts        # Framer Motion variants
│   ├── portfolio/             # Portfolio data system
│   │   ├── config.ts          # Portfolio configuration (greeting, suggestions, instructions)
│   │   ├── data.ts            # Portfolio content data
│   │   ├── index.ts           # Barrel export
│   │   ├── parsePortfolio.ts  # Portfolio data parser
│   │   └── types.ts           # Portfolio TypeScript interfaces
│   └── utils.ts               # cn() helper
└── types/
    ├── index.ts               # Barrel export
    ├── message.ts             # ContentBlock types + Zod schemas
    └── theme.ts               # Theme type
```

## Key Patterns

### AI SDK v6 Streaming with Portfolio
```typescript
// API Route (src/app/api/chat/route.ts)
import { generatePortfolioInstructions, PORTFOLIO_MAX_STEPS } from "@/lib/portfolio/config";
import { renderPortfolio } from "@/lib/ai/tools";

const result = streamText({
  model: createModel(modelId),
  system: generatePortfolioInstructions(),
  messages: await convertToModelMessages(uiMessages),
  tools: { renderPortfolio },
  stopWhen: stepCountIs(PORTFOLIO_MAX_STEPS),
});
return result.toUIMessageStreamResponse({ sendReasoning: true });
```

### Parts-Based Message Rendering
Messages contain parts (text, reasoning, tool-*) that are rendered differently:
- `text` → `<MessageResponse>` (uses Streamdown)
- `reasoning` → `<Reasoning>` collapsible
- `tool-*` → Content blocks when output available, loading indicator otherwise

### AI Elements Components
Custom components for chat UI in `src/components/ai-elements/`:
- `Message`, `MessageContent`, `MessageResponse` - Message display
- `MessageAttachment`, `MessageAttachments` - File attachments
- `MessageBranch`, `MessageBranchSelector` - Response branching
- `ModelSelector*` - Model picker with search (cmdk-based)
- `Suggestion`, `Suggestions` - Quick action buttons

### Model System
```typescript
// src/lib/ai/models.ts
interface Model {
  id: string;          // e.g., "openai/gpt-4o-mini"
  name: string;        // Display name
  chef: string;        // Provider name (OpenAI, Google, etc.)
  chefSlug: string;    // URL-safe provider key
  providers: string[]; // Available providers
  description?: string;
}
```

### Tailwind v4 Dark Mode
Class-based dark mode is enabled via:
```css
@custom-variant dark (&:where(.dark, .dark *));
```
CSS variables in `:root` and `.dark` are referenced in `@theme inline`.

### Adding New Content Block Types
1. Add Zod schema in `src/types/message.ts`
2. Add tool in `src/lib/ai/tools.ts`
3. Create renderer in `src/components/blocks/`
4. Add case in `ContentBlock.tsx` router
5. Update tool list in `ChatMessage.tsx`

### Portfolio Configuration

The application is hardcoded to function as a portfolio assistant. All portfolio-specific configuration is centralized in `src/lib/portfolio/config.ts`.

**Configuration exports:**
```typescript
// src/lib/portfolio/config.ts
export const PORTFOLIO_GREETING = "Let's chat — ask me anything about my work, background, or projects.";

export const PORTFOLIO_SUGGESTIONS = [
  { label: "Bio", prompt: "Show me your bio" },
  { label: "Experience", prompt: "Show me your experience" },
  { label: "Projects", prompt: "Show me your projects" },
  { label: "Education", prompt: "Show me your education" },
  { label: "Skills", prompt: "Show me your skills" },
  { label: "Contact", prompt: "Show me your contact information" },
];

export const PORTFOLIO_MAX_STEPS = 1;

export function generatePortfolioInstructions(): string {
  // Dynamically generates system prompt with embedded portfolio data from data.ts
}
```

**Customizing the portfolio:**
1. Edit greeting in `PORTFOLIO_GREETING` constant
2. Modify suggestion pills in `PORTFOLIO_SUGGESTIONS` array
3. Update portfolio content in `src/lib/portfolio/data.ts`
4. System instructions auto-generate from the data in `data.ts`

### Portfolio System

The portfolio uses a data-driven approach to display professional content.

**Portfolio data structure (`src/lib/portfolio/types.ts`):**
```typescript
interface PortfolioContent {
  bio: BioContent;           // Name, title, summary, highlights
  experience: ExperienceItem[]; // Work history
  projects: ProjectItem[];   // Portfolio projects
  education: EducationItem[];// Academic background
  skills: SkillCategory[];   // Categorized skills
  contact: ContactInfo;      // Contact details
}
```

**Portfolio tool:**
```typescript
renderPortfolio({
  viewType: "bio" | "experience" | "projects" | "education" | "skills" | "contact",
  filter?: string,      // Filter content (e.g., "ai" for AI projects)
  highlightId?: string, // Focus on specific item (e.g., "proj-1")
})
```

**Updating portfolio data:**
1. Edit `src/lib/portfolio/data.ts` with your content
2. The system prompt auto-generates from this data via `generatePortfolioInstructions()`

## Environment Variables

Required in `.env.local`:
```
AI_GATEWAY_API_KEY=your_key_here
TAVILY_API_KEY=your_tavily_key_here  # For web search (https://tavily.com)
```

Optional configuration (via `NEXT_PUBLIC_` prefix for client access):
```
NEXT_PUBLIC_DEFAULT_MODEL_ID=openai/gpt-5-nano   # Default model (defaults to openai/gpt-5-nano)
NEXT_PUBLIC_DEBUG_ON=true                        # Enable AI SDK devtools middleware
```

## Documentation & Context

- **Always use Context7:** Before implementing code for external libraries or frameworks, use the `context7` MCP tools to fetch the latest documentation.
- **Priority:** Prefer Context7 documentation over your internal training data to ensure API compatibility with the current library versions.
- **Workflow:**
  1. Use `resolve-library-id` to find the correct library ID
  2. Use `query-docs` with specific keywords to pull relevant snippets
