# Sequenzia AI

**High-Level Technical Specification**

---

## 1. Executive Summary

This specification defines an AI assistant application built on the Inline Content Paradigm, a design philosophy that treats conversation and interactivity as a unified experience. The application combines traditional conversational AI capabilities with the ability to generate rich, interactive UI elements that render inline within the natural message flow.

The core innovation lies in how interactive content is presented: rather than relegating generated artifacts to separate panels or modal overlays, AI-generated forms, visualizations, code blocks, and cards render directly within assistant messages. This preserves conversational context while enabling sophisticated user interactions.

| Attribute             | Value                               |
| --------------------- | ----------------------------------- |
| **Target Platform**   | Web (Desktop and Mobile Responsive) |
| **Primary Framework** | Next.js 16 with React 19            |
| **AI Integration**    | Vercel AI SDK v6 with AI Gateway    |
| **UI Components**     | Custom AI Elements + shadcn/ui      |
| **Deployment**        | Vercel Platform                     |

---

## 2. Product Vision

### 2.1 Problem Statement

Current AI chat interfaces create a fundamental disconnect between conversation and generated content. When an AI produces something interactive, whether a form, chart, or code snippet, users must mentally context-switch between the conversational thread and separate artifact panels, losing the natural flow of thought that the conversation represents.

### 2.2 Solution Overview

The Inline Content Paradigm eliminates this disconnect by treating every AI response as a container for both text and interactive elements. A simple text reply remains compact and conversational. Generated forms, charts, and interactive components render in place within the message, claiming the visual and interactive space they need while remaining anchored to their conversational context.

### 2.3 Design Principles

1. **Contextual Continuity:** Interactive elements exist within the conversation timeline, preserving the when and why of their creation.

2. **Immediate Interactivity:** Content blocks render fully interactive without requiring user action to expand or reveal them.

3. **Graceful Animations:** Message entrances and content appearances feel organic through spring-based animations.

4. **Viewport Respect:** Scroll position automatically sticks to the bottom during streaming, with manual scroll override.

---

## 3. Technical Architecture

### 3.1 Technology Stack

| Layer            | Technology                     | Purpose                                           |
| ---------------- | ------------------------------ | ------------------------------------------------- |
| Framework        | Next.js 16.1                   | Full-stack React framework with App Router        |
| UI Core          | React 19.2                     | Component architecture and state management       |
| AI Components    | Custom AI Elements             | Chat UI components (Message, ModelSelector, etc.) |
| UI Primitives    | shadcn/ui (New York style)     | Accessible component primitives via Radix UI      |
| Styling          | Tailwind CSS v4                | Utility-first styling with OKLch color system     |
| Animation        | Framer Motion / Motion         | Spring-based animations and gesture feedback      |
| Validation       | Zod v4                         | Schema validation for AI tool inputs              |
| Markdown         | Streamdown                     | Streaming markdown renderer                       |
| State            | React Context + AI SDK hooks   | Chat state via useChat, theme via ThemeProvider   |
| Server Cache     | TanStack Query                 | Infrastructure for server state caching           |
| AI Integration   | Vercel AI SDK v6               | Streaming, tool calls, and UI generation          |
| AI Models        | Vercel AI Gateway              | Multi-provider model routing                      |
| Deployment       | Vercel                         | Edge functions, CDN, and serverless hosting       |

### 3.2 High-Level Architecture

The application follows a layered architecture that separates concerns while enabling tight integration between the AI backend and the UI system.

#### 3.2.1 Presentation Layer

The presentation layer consists of React components built on custom AI Elements and shadcn/ui. The primary components include a ChatContainer that manages the conversation viewport with sticky scroll, ChatMessage components that render message parts (text, reasoning, tool outputs), and specialized ContentBlock components for each type of interactive element.

#### 3.2.2 State Management Layer

The Vercel AI SDK's `useChat` hook manages chat state including messages, streaming status, and error handling. A ChatProvider context wraps this functionality, adding model selection and convenience methods. ThemeProvider manages theme state with localStorage persistence. TanStack Query is configured as infrastructure for future server state needs.

#### 3.2.3 AI Integration Layer

The Vercel AI SDK v6 provides the bridge between the frontend and AI models. This layer handles streaming responses via Server-Sent Events, tool call orchestration through Zod-validated schemas, and the structured output parsing required to render generated UI components. The AI Gateway enables model routing across multiple providers. The Agent system organizes prompts, tools, and suggestions.

---

## 4. Core Features

### 4.1 Conversational Interface

The foundation of the application is a streaming chat interface that supports real-time AI responses. Users can send text messages and receive responses that stream in token by token. The interface supports markdown rendering via Streamdown, code syntax highlighting via Shiki, and reasoning/thinking display.

### 4.2 Agent System

Agents organize system prompts, available tools, and UI suggestions. One agent is active at a time, selected via the `ACTIVE_AGENT` environment variable.

| Agent     | Description                           | Tools                      |
| --------- | ------------------------------------- | -------------------------- |
| `default` | Full assistant with interactive content | form, chart, code, card   |
| `coder`   | Code-focused assistant                | code                       |

**Agent Configuration:**

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

### 4.3 Model Selection

Users can select from multiple AI models during conversation:

| Provider  | Models                                    |
| --------- | ----------------------------------------- |
| OpenAI    | GPT-5 Nano, GPT-5 Mini, GPT-4o Mini, GPT-OSS 120B |
| Google    | Gemini 2.0 Flash                          |
| DeepSeek  | DeepSeek V3.2                             |

Model selection persists in the ChatProvider context and is passed with each request. The model selector appears in the input composer via a command palette dialog, grouped by provider.

### 4.4 Interactive UI Generation

The AI can generate several categories of interactive elements that render inline within messages.

#### 4.4.1 Forms and Inputs

Dynamic forms with field validation and styled input components. Form submissions generate new messages in the conversation, maintaining cause-and-effect clarity. Supported input types:

- Text fields and text areas
- Select dropdowns with options
- Checkboxes and radio groups
- Date pickers
- Range sliders with live value display
- Number and email inputs
- File upload fields

Forms display a success state with animated checkmark after submission.

#### 4.4.2 Data Visualizations

Charts rendered via Recharts with interactive tooltips. Supported visualization types:

- Line charts
- Bar charts
- Pie charts
- Area charts

Charts render at fixed height (300px) with responsive width and theme-aware colors using CSS custom properties (`--chart-1` through `--chart-5`).

#### 4.4.3 Code Blocks

Syntax-highlighted code blocks using Shiki with dual-theme support (light and dark HTML pre-rendered). Features include:

- Language detection and badge display
- Line numbers (optional)
- Copy-to-clipboard functionality
- Code statistics (line count, character count)

#### 4.4.4 Rich Content Cards

Content cards for displaying structured information with optional media. Features:

- Title and description
- Body content
- Media support (image or video with aspect ratio)
- Action buttons with variants (default, secondary, destructive, outline)

Card actions trigger new messages in the conversation when clicked.

### 4.5 Quick Suggestions

Agents can define suggestion prompts that appear as buttons in the input area when the conversation is empty. Clicking a suggestion sends its associated prompt to the AI.

### 4.6 Reasoning Display

When AI models provide reasoning/thinking content, it renders in a collapsible Reasoning component:

- Auto-opens when reasoning starts streaming
- Shows "Thought for X seconds" duration
- Auto-closes after streaming ends (configurable delay)
- Shimmer animation while streaming
- Markdown rendering via Streamdown

---

## 5. User Interface Specification

### 5.1 Layout Structure

The application uses a single-column centered layout optimized for readability:

- Maximum width of `3xl` (48rem) for chat content
- Full-height flex layout with header, scrollable chat area, and fixed input
- Responsive padding that adapts to viewport size

### 5.2 Message Components

#### 5.2.1 User Messages

User messages slide in from the right with a subtle animation. They display text content and support file attachments via the AI SDK's UIMessage parts structure.

#### 5.2.2 Assistant Messages

Assistant messages slide in from the left. Each assistant message can contain multiple parts:

- **Text parts:** Rendered via MessageResponse component (using Streamdown)
- **Reasoning parts:** Collapsible thinking display
- **Tool parts:** Either ContentBlock (for form/chart/code/card) or generic Tool component

Assistant messages include action buttons:
- Copy text to clipboard (with success feedback)
- Regenerate response

### 5.3 Input Composer

The input area includes:

- Multi-line text input with auto-resize
- Model selector (command palette dialog with search, grouped by provider)
- Submit button with loading state
- Quick suggestion buttons (when conversation is empty)
- Keyboard hints (Enter to send, Shift+Enter for newline)

### 5.4 Animation Specifications

Animations use Framer Motion with spring-based physics for natural feel.

#### 5.4.1 Spring Presets

| Preset   | Stiffness | Damping | Use Case                    |
| -------- | --------- | ------- | --------------------------- |
| Gentle   | 120       | 14      | Content appearance          |
| Snappy   | 400       | 30      | UI feedback                 |
| Bouncy   | 300       | 10      | Success/celebration states  |

#### 5.4.2 Message Animations

- User messages: Slide from right (x: 12 → 0) with 200ms ease-out
- Assistant messages: Slide from left (x: -12 → 0) with 200ms ease-out
- Loading indicator: Fade in with upward movement (y: 8 → 0)

#### 5.4.3 Content Block Animations

- Forms: Staggered field entrance (80ms between fields)
- Charts: Scale entrance (0.96 → 1) with gentle spring
- Code blocks: Slide from left (x: -16 → 0) with snappy spring
- Cards: Slide up (y: 12 → 0) with gentle spring

#### 5.4.4 Gesture Feedback

- Button hover: Scale to 1.02 (desktop only)
- Button tap: Scale to 0.97 (0.95 on mobile)
- Reduced motion: All animations respect `prefers-reduced-motion`

---

## 6. Scroll and Viewport Management

### 6.1 Sticky Scroll Behavior

The chat container uses `use-stick-to-bottom` library for automatic scroll management:

- Automatically scrolls to bottom when new content arrives
- Detaches when user scrolls up manually
- Scroll-to-bottom button appears when detached
- Re-attaches when user scrolls near bottom

### 6.2 Loading State Management

The loading indicator ("Thinking...") appears:
- During 'submitted' status (before first response chunk)
- During early 'streaming' when assistant message has no visible content yet

Messages are filtered to hide empty assistant messages during initial streaming, preventing layout jumps.

---

## 7. Component Architecture

### 7.1 Component Hierarchy

| Component        | Responsibility                                                               |
| ---------------- | ---------------------------------------------------------------------------- |
| _ChatProvider_   | Context providing chat state, actions, model selection via useChat hook      |
| _ChatContainer_  | Conversation wrapper with sticky scroll and message filtering                |
| _ChatMessage_    | Individual message renderer handling parts routing and actions               |
| _ContentBlock_   | Router component dispatching to type-specific renderers                      |
| _FormContent_    | Form rendering with field types, validation, submission, success state       |
| _ChartContent_   | Recharts wrapper with responsive container and theme colors                  |
| _CodeContent_    | Shiki syntax highlighting with dual-theme support and copy button            |
| _CardContent_    | Card display with media, actions, and click handling                         |
| _InputComposer_  | Text input with model selector, suggestions, and keyboard handling           |
| _Reasoning_      | Collapsible reasoning/thinking display with streaming support                |
| _Tool_           | Generic tool invocation display with status badges                           |

### 7.2 AI Elements Components

Custom components in `src/components/ai-elements/`:

| Component              | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| Conversation           | Container with StickToBottom scroll        |
| ConversationContent    | Message list container                     |
| ConversationEmptyState | Empty state with icon and description      |
| ConversationScrollButton | Sticky scroll-to-bottom control          |
| Message                | Role-aware message wrapper                 |
| MessageContent         | Message body container                     |
| MessageResponse        | Text content renderer (Streamdown)         |
| MessageActions         | Action button container                    |
| MessageAttachment      | File attachment display                    |
| MessageBranch*         | Response branching components              |
| PromptInput            | Input composition wrapper                  |
| PromptInputTextarea    | Auto-resizing text input                   |
| ModelSelector*         | Model selection dialog (cmdk-based)        |
| Suggestion(s)          | Quick action buttons                       |
| CodeBlock              | Syntax highlighting with Shiki             |
| Tool                   | Tool invocation display                    |
| Loader                 | Spinning loading indicator                 |
| Shimmer                | Skeleton loading animation                 |
| Reasoning              | Collapsible thinking display               |

### 7.3 State Management Strategy

#### 7.3.1 Chat State (AI SDK + Context)

The ChatProvider wraps `useChat` from `@ai-sdk/react` with `DefaultChatTransport`:

```typescript
interface ChatContextValue {
  messages: UIMessage[];
  status: ChatStatus;  // 'idle' | 'submitted' | 'streaming'
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => void;
  regenerateLastMessage: () => void;
  clearMessages: () => void;
  stop: () => void;
  modelId: string;
  setModelId: (modelId: string) => void;
}
```

#### 7.3.2 Theme State (ThemeProvider)

Custom ThemeProvider managing:
- Theme preference: 'light' | 'dark' | 'system'
- Resolved theme: 'light' | 'dark'
- High contrast mode
- localStorage persistence
- System preference listener

#### 7.3.3 Form State (Local to FormContent)

Generated forms manage their own state locally via useState, with submission triggering `sendMessage` to create a new conversation message.

---

## 8. Data Models

### 8.1 Message Structure (UIMessage from AI SDK)

Messages use the Vercel AI SDK's UIMessage format:

```typescript
interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  parts?: Array<
    | { type: 'text'; text: string }
    | { type: 'reasoning'; text: string }
    | { type: 'file'; filename?: string; mediaType?: string; url?: string }
    | { type: `tool-${string}`; state: ToolState; output?: unknown; errorText?: string }
  >;
}

type ToolState =
  | 'input-streaming'
  | 'input-available'
  | 'approval-requested'
  | 'approval-responded'
  | 'output-available'
  | 'output-error'
  | 'output-denied';
```

### 8.2 Content Block Types

The contentBlock output from tools contains a discriminated union based on the type field:

```typescript
type ContentBlock =
  | FormContentData
  | ChartContentData
  | CodeContentData
  | CardContentData;
```

#### 8.2.1 Form Content

```typescript
interface FormContentData {
  type: 'form';
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
}

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' |
        'date' | 'slider' | 'file' | 'number' | 'email';
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
}
```

#### 8.2.2 Chart Content

```typescript
interface ChartContentData {
  type: 'chart';
  chartType: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  description?: string;
  data: { label: string; value: number }[];
}
```

#### 8.2.3 Code Content

```typescript
interface CodeContentData {
  type: 'code';
  language: string;
  filename?: string;
  code: string;
  editable?: boolean;
  showLineNumbers?: boolean;
}
```

#### 8.2.4 Card Content

```typescript
interface CardContentData {
  type: 'card';
  title: string;
  description?: string;
  content?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
  actions?: {
    label: string;
    action: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }[];
}
```

### 8.3 Model Definition

```typescript
interface Model {
  id: string;           // e.g., "openai/gpt-5-nano"
  name: string;         // e.g., "GPT-5 Nano"
  chef: string;         // e.g., "OpenAI"
  chefSlug: string;     // e.g., "openai"
  providers: string[];  // e.g., ["openai", "azure"]
  description?: string;
}
```

### 8.4 Agent Definition

```typescript
interface AgentConfig {
  id: string;
  name: string;
  instructions: string;
  tools: ToolSet;
  maxSteps?: number;
  description?: string;
  suggestions?: Array<{
    label: string;
    prompt?: string;
  }>;
}
```

---

## 9. AI Integration

### 9.1 Vercel AI SDK Integration

The Vercel AI SDK v6 provides the core AI communication layer.

#### 9.1.1 Client-Side Hook

```typescript
const { messages, status, error, sendMessage, stop, setMessages } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
});
```

#### 9.1.2 Server-Side Streaming

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { messages: uiMessages, modelId } = await req.json();

  const model = createModel(modelId);
  const messages = await convertToModelMessages(uiMessages);
  const agent = getActiveAgent();

  const result = streamText({
    model,
    system: agent.instructions,
    messages,
    tools: agent.tools,
    stopWhen: stepCountIs(agent.maxSteps ?? 1),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
```

### 9.2 Tool Definitions

Four tools are defined using Zod schemas with `strict: true`:

```typescript
export const chatTools = {
  generateForm: tool({
    description: 'Generate an interactive form...',
    inputSchema: z.object({
      type: z.literal('form'),
      title: z.string(),
      fields: z.array(FormFieldSchema),
      // ...
    }),
    strict: true,
    execute: async (params) => params,
  }),
  generateChart: tool({ /* ... */ }),
  generateCode: tool({ /* ... */ }),
  generateCard: tool({ /* ... */ }),
};
```

Tools execute by returning their input parameters directly, which become the tool output rendered by ContentBlock.

### 9.3 Model Creation

Server-side model factory using AI Gateway:

```typescript
// lib/ai/models.server.ts
import "server-only";
import { gateway, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";

export function createModel(modelId?: string): LanguageModel {
  const selectedModelId = isValidModelId(modelId) ? modelId : DEFAULT_MODEL_ID;
  const baseModel = gateway(selectedModelId);

  return process.env.AI_DEBUG === "true"
    ? wrapLanguageModel({ model: baseModel, middleware: devToolsMiddleware() })
    : baseModel;
}
```

### 9.4 Agent System

Agents are defined in `src/lib/ai/agents/` and registered in the agents index:

```typescript
// lib/ai/agents/index.ts
const agents: Record<string, AgentConfig> = {
  [defaultAgent.id]: defaultAgent,
  [coderAgent.id]: coderAgent,
};

export function getActiveAgent(): AgentConfig {
  const agentId = process.env.ACTIVE_AGENT || "default";
  return agents[agentId] ?? agents["default"];
}
```

---

## 10. Non-Functional Requirements

### 10.1 Performance

1. **Initial Load:** Fast time to interactive via Next.js App Router
2. **Animations:** Consistent 60fps during spring-based transitions
3. **Streaming Latency:** First token visible promptly via SSE streaming
4. **Max Duration:** API route configured for 60 second timeout

### 10.2 Accessibility

- Reduced motion mode respecting `prefers-reduced-motion` media query
- Screen reader compatible via AI Elements ARIA attributes
- Keyboard navigation for input and model selection
- Form labels with required field indicators

### 10.3 Responsive Design

- Single-column layout with max-width constraint
- Mobile-optimized gesture feedback (larger tap targets)
- Responsive padding and spacing

### 10.4 Browser Support

The application targets modern evergreen browsers with ES2017+ support.

---

## 11. Theming System

### 11.1 Overview

The application implements a theming system built on Tailwind CSS v4 and CSS custom properties using the OKLch color space for perceptually uniform colors.

### 11.2 Theme Architecture

#### 11.2.1 OKLch Color System

Colors are defined using OKLch (Lightness, Chroma, Hue) for better perceptual uniformity:

```css
@theme inline {
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(9.6% 0.005 286.07);
  --color-primary: oklch(20.5% 0 0);
  --color-primary-foreground: oklch(98.5% 0 0);
  --color-muted: oklch(96.5% 0.001 286.07);
  --color-muted-foreground: oklch(45.2% 0.012 256.07);
  --color-destructive: oklch(57.7% 0.245 27.33);
  --color-border: oklch(91.4% 0.004 286.07);
  --color-ring: oklch(70.5% 0.015 286.07);
}

.dark {
  --color-background: oklch(14.5% 0.005 286.07);
  --color-foreground: oklch(98.5% 0 0);
  /* ... dark mode overrides */
}
```

#### 11.2.2 Tailwind v4 Integration

Tailwind CSS v4 uses the `@theme` directive for configuration, automatically generating utility classes from CSS custom properties.

### 11.3 Theme Tokens

#### 11.3.1 Core Color Tokens

| Token                | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `background`         | Page and container backgrounds               |
| `foreground`         | Primary text color                           |
| `primary`            | Interactive elements, buttons, links         |
| `primary-foreground` | Text on primary-colored backgrounds          |
| `secondary`          | Secondary buttons and less prominent actions |
| `muted`              | Subtle backgrounds, disabled states          |
| `muted-foreground`   | Secondary text, placeholders                 |
| `accent`             | Highlights, hover states                     |
| `destructive`        | Error states, delete actions                 |
| `border`             | Dividers, input borders                      |
| `ring`               | Focus indicators                             |

#### 11.3.2 Chart Color Tokens

Five chart colors for data visualization:

| Token      | Purpose               |
| ---------- | --------------------- |
| `chart-1`  | Primary data series   |
| `chart-2`  | Secondary data series |
| `chart-3`  | Tertiary data series  |
| `chart-4`  | Quaternary series     |
| `chart-5`  | Quinary series        |

#### 11.3.3 Semantic Tokens

| Token     | Purpose                              |
| --------- | ------------------------------------ |
| `success` | Positive feedback, completion states |
| `warning` | Caution states, validation warnings  |
| `error`   | Error messages, failed states        |
| `info`    | Informational highlights             |

### 11.4 Built-in Themes

#### 11.4.1 Light Theme

Clean, high-contrast theme optimized for daytime use. White background with dark text.

#### 11.4.2 Dark Theme

Low-light theme with dark gray background. Reduces eye strain in dim environments.

#### 11.4.3 System Theme (Default)

Automatically switches between light and dark based on OS preference via `prefers-color-scheme` media query.

#### 11.4.4 High Contrast Mode

Optional accessibility mode with enhanced contrast ratios, applied via additional CSS class.

### 11.5 Theme Switching

#### 11.5.1 ThemeProvider Implementation

```typescript
interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}
```

Features:
- localStorage persistence (`sequenzia-theme`, `sequenzia-high-contrast`)
- System preference listener via `matchMedia`
- Applies CSS classes to `<html>` element
- Returns null until mounted to prevent hydration mismatch

#### 11.5.2 User Controls

Theme selection available in the header via dropdown menu with light/dark/system options.

### 11.6 Code Syntax Theming

Code blocks use Shiki with dual-theme rendering:
- Light HTML rendered in light mode
- Dark HTML rendered in dark mode
- Theme switching handled via CSS `hidden`/`dark:block` classes

---

## 12. Animation System

### 12.1 Motion Library

Animations use Framer Motion (imported as `motion/react`) for spring-based physics.

### 12.2 Animation Variants

#### 12.2.1 Entrance Variants

```typescript
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springs.gentle },
};
```

#### 12.2.2 Message Variants

```typescript
export const messageItemUser: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

export const messageItemAssistant: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};
```

#### 12.2.3 Form Variants

```typescript
export const formFieldContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export const formField: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: springs.snappy },
};

export const successBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: springs.bouncy },
};
```

### 12.3 Motion Hooks

```typescript
// Detect reduced motion preference
export function useReducedMotion(): boolean;

// Detect mobile viewport
export function useIsMobile(): boolean;

// Combined animation configuration
export function useAnimationConfig(): {
  shouldAnimate: boolean;
  isMobile: boolean;
  tapGesture: { scale: number };
  hoverGesture: { scale: number } | {};
};
```

### 12.4 Reduced Motion Support

When `prefers-reduced-motion: reduce` is enabled:
- `shouldAnimate` returns false
- Components skip entrance animations
- Gesture feedback remains for accessibility

---

## Appendix A: Glossary

**Agent:** A configuration combining system prompt, available tools, and optional UI suggestions for the AI assistant.

**Content Block:** Structured data representing interactive elements the AI can generate within messages (form, chart, code, card).

**Tool Call:** An AI-initiated function invocation that generates structured output rendered as a ContentBlock.

**AI Gateway:** Vercel's service for routing AI requests across multiple model providers with a unified API.

**Streaming Response:** AI output delivered incrementally via Server-Sent Events as tokens are generated.

**UIMessage:** The message format used by Vercel AI SDK v6, containing parts array with typed content.

**OKLch:** A perceptually uniform color space using Lightness, Chroma, and Hue for more consistent color manipulation.

**Spring Animation:** Physics-based animation using stiffness and damping parameters for natural motion.

**Streamdown:** A streaming markdown renderer that handles incremental content updates.

---

## Appendix B: Future Considerations

The following features from the original spec vision are not yet implemented but could be added:

1. **Expansion States:** Multi-level content expansion (collapsed, partial, expanded, focused)
2. **Anchor-Based Scrolling:** Viewport management during content expansion
3. **Custom Theme Editor:** User-created themes with color pickers
4. **Theme Import/Export:** JSON-based theme sharing
5. **File Attachments:** User file upload support in messages
6. **Conversation Persistence:** Server-side conversation storage
7. **Voice Input:** Speech-to-text message input
8. **Multi-Agent Switching:** Runtime agent selection via UI
