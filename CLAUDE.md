# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sequenzia AI is a streaming AI chat application with inline interactive content blocks. The AI can generate forms, charts, code snippets, and cards that render directly within assistant messages.

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
├── app/
│   ├── api/chat/route.ts      # Streaming chat endpoint
│   ├── globals.css            # OKLch theme tokens + Tailwind v4
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main chat page
├── components/
│   ├── ai-elements/           # AI-specific UI components
│   │   ├── conversation.tsx   # Conversation container
│   │   ├── message.tsx        # Message + attachments + branching
│   │   ├── model-selector.tsx # Model picker dialog (cmdk-based)
│   │   ├── suggestion.tsx     # Quick action suggestions
│   │   ├── prompt-input.tsx   # Message input field
│   │   ├── reasoning.tsx      # Collapsible reasoning display
│   │   ├── tool.tsx           # Tool invocation display
│   │   ├── loader.tsx         # Loading indicators
│   │   ├── shimmer.tsx        # Skeleton loading animation
│   │   └── code-block.tsx     # Syntax-highlighted code
│   ├── blocks/                # Content block renderers
│   │   ├── ContentBlock.tsx   # Router component
│   │   ├── FormContent.tsx    # Dynamic forms
│   │   ├── ChartContent.tsx   # Recharts visualizations
│   │   ├── CodeContent.tsx    # Shiki syntax highlighting
│   │   └── CardContent.tsx    # Rich cards with actions
│   ├── chat/                  # Chat components
│   │   ├── ChatProvider.tsx   # useChat wrapper + model state
│   │   ├── ChatContainer.tsx  # Message list
│   │   ├── ChatMessage.tsx    # Parts-based rendering
│   │   └── InputComposer.tsx  # Input + model selector + suggestions
│   ├── providers/             # React context providers
│   │   ├── ThemeProvider.tsx  # Light/dark/system theme
│   │   └── QueryProvider.tsx  # TanStack Query
│   ├── ui/                    # shadcn/ui components
│   └── Header.tsx             # Theme toggle
├── lib/
│   ├── ai/
│   │   ├── agents/            # Agent configurations
│   │   │   ├── index.ts       # Registry + getActiveAgent()
│   │   │   ├── types.ts       # AgentConfig interface
│   │   │   ├── default.agent.ts  # Default agent (all tools)
│   │   │   └── coder.agent.ts    # Code-focused agent
│   │   ├── models.ts          # Client-safe model definitions
│   │   ├── models.server.ts   # Server-only AI Gateway factory
│   │   ├── tools.ts           # Tool definitions (form, chart, code, card)
│   │   └── prompts.ts         # System prompt (legacy)
│   ├── motion/                # Animation variants + hooks
│   │   ├── variants.ts        # Framer Motion variants
│   │   ├── hooks.ts           # Animation hooks
│   │   └── index.ts           # Barrel export
│   └── utils.ts               # cn() helper
└── types/
    ├── index.ts               # Barrel export
    ├── message.ts             # ContentBlock types + Zod schemas
    └── theme.ts               # Theme type
```

## Key Patterns

### AI SDK v6 Streaming with Agents
```typescript
// API Route (src/app/api/chat/route.ts)
const agent = getActiveAgent(); // Selected via ACTIVE_AGENT env var

const result = streamText({
  model: createModel(modelId),
  system: agent.instructions,
  messages: await convertToModelMessages(uiMessages),
  tools: agent.tools,
  stopWhen: stepCountIs(agent.maxSteps ?? 1),
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

### Agents

Agents organize system prompts, tools, and suggestions. One agent is active at a time, selected via the `ACTIVE_AGENT` environment variable.

**AgentConfig interface:**
```typescript
interface AgentConfig {
  id: string;           // Matches ACTIVE_AGENT env var
  name: string;         // Human-readable name
  instructions: string; // System prompt
  tools: ToolSet;       // Available tools
  maxSteps?: number;    // Multi-step iterations (default: 1)
  description?: string; // Optional description
  suggestions?: Array<{
    label: string;      // Short label for UI
    prompt?: string;    // Full prompt (defaults to label)
  }>;
}
```

**Adding a new agent:**
1. Create `src/lib/ai/agents/myagent.agent.ts`
2. Define the agent config with id, name, instructions, tools, and suggestions
3. Register in `src/lib/ai/agents/index.ts` agents record
4. Set `ACTIVE_AGENT=myagent` in `.env.local`

**Available agents:**
- `default` - Full assistant with all tools (form, chart, code, card) and suggestions
- `coder` - Code-focused agent with only the code tool

## Environment Variables

Required in `.env.local`:
```
AI_GATEWAY_API_KEY=your_key_here
ACTIVE_AGENT=default  # Options: default, coder
```

## Documentation & Context

- **Always use Context7:** Before implementing code for external libraries or frameworks, use the `context7` MCP tools to fetch the latest documentation.
- **Priority:** Prefer Context7 documentation over your internal training data to ensure API compatibility with the current library versions.
- **Workflow:**
  1. Use `resolve-library-id` to find the correct library ID
  2. Use `query-docs` with specific keywords to pull relevant snippets
