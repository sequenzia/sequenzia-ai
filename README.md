# Sequenzia AI

A streaming AI chat application with inline interactive content blocks. The AI can generate forms, charts, code snippets, and cards that render directly within assistant messages.

## Overview

Sequenzia AI implements the **Inline Content Paradigm** - a design philosophy that treats conversation and interactivity as a unified experience. Rather than relegating AI-generated artifacts to separate panels or modals, interactive elements render directly within the message flow, preserving conversational context.

### Key Features

- **Streaming Chat** - Real-time AI responses with token-by-token streaming
- **Multi-Model Support** - Switch between OpenAI, Google, and DeepSeek models
- **Interactive Blocks** - AI-generated forms, charts, code, and cards inline in messages
- **Reasoning Display** - Collapsible thinking/reasoning sections for supported models
- **Dark/Light Themes** - System-aware theming with manual toggle
- **Markdown Rendering** - Full markdown support with syntax highlighting
- **Responsive Design** - Works on desktop and mobile

## Content Blocks

The AI can generate four types of interactive content:

| Block | Description | Use Cases |
|-------|-------------|-----------|
| **Form** | Interactive forms with 10 field types | Surveys, registrations, feedback collection |
| **Chart** | Data visualizations (line, bar, pie, area) | Reports, analytics, comparisons |
| **Code** | Syntax-highlighted code with copy button | Examples, configurations, snippets |
| **Card** | Rich content with media and actions | Products, articles, notifications |

See [docs/blocks.md](docs/blocks.md) for detailed documentation.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1 + React 19.2 |
| AI | Vercel AI SDK v6 + AI Gateway |
| UI | Vercel AI Elements + shadcn/ui |
| Styling | Tailwind CSS v4 (OKLch colors) |
| Animation | Framer Motion / Motion |
| Validation | Zod v4 |
| Charts | Recharts |
| Syntax Highlighting | Shiki |

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sequenzia/sequenzia-ai.git
cd sequenzia-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env.local
```

4. Add your API key to `.env.local`:

```
AI_GATEWAY_API_KEY=your_key_here
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts      # Streaming chat API endpoint
│   ├── globals.css            # Theme tokens + Tailwind config
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main chat page
├── components/
│   ├── ai-elements/           # AI Elements (conversation, message, etc.)
│   ├── blocks/                # Content block renderers
│   │   ├── ContentBlock.tsx   # Block type router
│   │   ├── FormContent.tsx    # Dynamic forms
│   │   ├── ChartContent.tsx   # Recharts visualizations
│   │   ├── CodeContent.tsx    # Shiki syntax highlighting
│   │   └── CardContent.tsx    # Rich cards with actions
│   ├── chat/                  # Chat components
│   │   ├── ChatProvider.tsx   # useChat wrapper + model state
│   │   ├── ChatContainer.tsx  # Message list with auto-scroll
│   │   ├── ChatMessage.tsx    # Parts-based message rendering
│   │   └── InputComposer.tsx  # Input + model selector
│   ├── providers/             # React context providers
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── ai/
│   │   ├── models.ts          # Client-safe model definitions
│   │   ├── models.server.ts   # Server-only AI Gateway factory
│   │   ├── tools.ts           # Tool definitions for blocks
│   │   └── prompts.ts         # System prompt
│   └── motion/                # Animation variants
└── types/
    └── message.ts             # ContentBlock types + Zod schemas
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway API key | Yes |

## Architecture

### Message Flow

```
User Input → API Route → AI Model → Streaming Response → Message Parts → UI
```

### Parts-Based Rendering

Messages contain parts that render differently:

- `text` → Markdown content via Streamdown
- `reasoning` → Collapsible thinking section
- `tool-*` → Content blocks when output available

### Tool System

Content blocks are generated through AI tools:

1. AI calls a tool (e.g., `generateChart`)
2. Tool input is validated against Zod schema
3. Tool output flows through streaming response
4. `ContentBlock` router renders appropriate component

## Documentation

- [Content Blocks](docs/blocks.md) - Detailed block type documentation
- [Technical Spec](docs/SPEC.md) - Full technical specification

## License

MIT
