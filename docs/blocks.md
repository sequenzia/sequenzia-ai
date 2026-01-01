# Content Blocks

Content blocks are interactive UI components that render inline within assistant messages. The AI can generate forms, charts, code snippets, and cards that users can interact with directly in the chat interface.

## Architecture

### Overview

The blocks system follows a tool-based architecture:

1. **AI Tools** (`src/lib/ai/tools.ts`) - Define the schema and capabilities the AI can invoke
2. **Type Definitions** (`src/types/message.ts`) - Zod schemas that validate block data
3. **Router Component** (`src/components/blocks/ContentBlock.tsx`) - Routes block types to renderers
4. **Renderers** (`src/components/blocks/*.tsx`) - Individual components for each block type

### Data Flow

```
AI Response → Tool Call → ContentBlock Router → Specific Renderer
```

When the AI decides to create a block, it calls a tool (e.g., `generateChart`). The tool output is validated against the Zod schema and passed through the `ContentBlock` router, which renders the appropriate component.

### Message Integration

Blocks appear within assistant messages via the parts-based rendering system in `ChatMessage.tsx`. When a tool part has `state: "output-available"`, the output is rendered as a `ContentBlock`.

### Agent Integration

Tools are organized into agents (`src/lib/ai/agents/`). Each agent defines which tools are available:

- **default agent**: All tools (form, chart, code, card)
- **coder agent**: Only the code tool

Set `ACTIVE_AGENT` environment variable to select an agent.

---

## Block Types

### Form Block

Interactive forms for collecting structured user input.

**Tool:** `generateForm`

**Schema:**

```typescript
{
  type: "form",
  title: string,
  description?: string,
  fields: FormField[],
  submitLabel?: string
}
```

**Field Types:**

| Type | Description | Additional Props |
|------|-------------|------------------|
| `text` | Single-line text input | `placeholder` |
| `textarea` | Multi-line text input | `placeholder` |
| `email` | Email input with validation | `placeholder` |
| `number` | Numeric input | `placeholder`, `min`, `max`, `step` |
| `select` | Dropdown selection | `options`, `placeholder` |
| `checkbox` | Boolean toggle | - |
| `radio` | Single selection from options | `options` |
| `slider` | Range slider | `min`, `max`, `step` |
| `date` | Date picker | - |
| `file` | File upload | - |

**Field Schema:**

```typescript
{
  id: string,           // Unique identifier
  type: FieldType,      // One of the types above
  label: string,        // Display label
  placeholder?: string, // Placeholder text
  required?: boolean,   // Validation flag
  defaultValue?: string | number | boolean,
  options?: { label: string, value: string }[], // For select/radio
  min?: number,         // For number/slider
  max?: number,         // For number/slider
  step?: number         // For number/slider
}
```

**Use Cases:**

- **User Registration** - Collect name, email, preferences
- **Feedback Surveys** - Gather user opinions with ratings and comments
- **Configuration Forms** - Let users set parameters for a task
- **Contact Forms** - Capture inquiry details
- **Booking Forms** - Collect reservation information

**Example:**

```json
{
  "type": "form",
  "title": "Feedback Survey",
  "description": "Help us improve our service",
  "fields": [
    {
      "id": "rating",
      "type": "slider",
      "label": "Overall Satisfaction",
      "min": 1,
      "max": 10,
      "defaultValue": 5
    },
    {
      "id": "category",
      "type": "select",
      "label": "Category",
      "required": true,
      "options": [
        { "label": "Product", "value": "product" },
        { "label": "Service", "value": "service" },
        { "label": "Support", "value": "support" }
      ]
    },
    {
      "id": "comments",
      "type": "textarea",
      "label": "Additional Comments",
      "placeholder": "Tell us more..."
    }
  ],
  "submitLabel": "Send Feedback"
}
```

---

### Chart Block

Data visualizations using Recharts.

**Tool:** `generateChart`

**Schema:**

```typescript
{
  type: "chart",
  chartType: "line" | "bar" | "pie" | "area",
  title: string,
  description?: string,
  data: { label: string, value: number }[]
}
```

**Chart Types:**

| Type | Best For |
|------|----------|
| `line` | Trends over time, continuous data |
| `bar` | Comparing categories, discrete data |
| `pie` | Showing proportions, part-to-whole |
| `area` | Cumulative values, volume over time |

**Use Cases:**

- **Sales Reports** - Visualize revenue by month or product
- **Analytics Dashboards** - Display user metrics or engagement data
- **Survey Results** - Show distribution of responses
- **Comparisons** - Compare performance across categories
- **Progress Tracking** - Display completion rates or milestones

**Example:**

```json
{
  "type": "chart",
  "chartType": "bar",
  "title": "Q4 Sales by Region",
  "description": "Revenue in thousands USD",
  "data": [
    { "label": "North America", "value": 450 },
    { "label": "Europe", "value": 320 },
    { "label": "Asia Pacific", "value": 280 },
    { "label": "Latin America", "value": 150 }
  ]
}
```

---

### Code Block

Syntax-highlighted code with copy functionality.

**Tool:** `generateCode`

**Schema:**

```typescript
{
  type: "code",
  language: string,
  filename?: string,
  code: string,
  editable?: boolean,
  showLineNumbers?: boolean
}
```

**Supported Languages:**

Common aliases are automatically normalized:
- `js` → `javascript`
- `ts` → `typescript`
- `py` → `python`
- `rb` → `ruby`
- `sh`/`shell` → `bash`
- `yml` → `yaml`
- `md` → `markdown`

Any Shiki-supported language is available.

**Use Cases:**

- **Code Examples** - Show implementation snippets
- **Configuration Files** - Display setup instructions
- **API Responses** - Format JSON/XML data
- **Scripts** - Share executable code
- **Documentation** - Explain code with syntax highlighting

**Example:**

```json
{
  "type": "code",
  "language": "typescript",
  "filename": "api/users.ts",
  "code": "export async function getUser(id: string) {\n  const response = await fetch(`/api/users/${id}`);\n  return response.json();\n}",
  "showLineNumbers": true
}
```

---

### Card Block

Rich content cards with optional media and actions.

**Tool:** `generateCard`

**Schema:**

```typescript
{
  type: "card",
  title: string,
  description?: string,
  content?: string,
  media?: {
    type: "image" | "video",
    url: string,
    alt?: string
  },
  actions?: {
    label: string,
    action: string,
    variant?: "default" | "secondary" | "destructive" | "outline"
  }[]
}
```

**Use Cases:**

- **Product Showcases** - Display items with images and buy buttons
- **Article Previews** - Show summaries with read more actions
- **Notifications** - Present alerts with dismiss/action buttons
- **User Profiles** - Display user info with contact actions
- **Event Cards** - Show event details with RSVP options
- **Recommendations** - Present suggestions with selection actions

**Example:**

```json
{
  "type": "card",
  "title": "Premium Plan",
  "description": "Best for growing teams",
  "content": "Includes unlimited projects, priority support, and advanced analytics.",
  "media": {
    "type": "image",
    "url": "https://example.com/premium.jpg",
    "alt": "Premium plan features"
  },
  "actions": [
    { "label": "Subscribe", "action": "subscribe", "variant": "default" },
    { "label": "Learn More", "action": "details", "variant": "outline" }
  ]
}
```

---

## Adding New Block Types

To add a new content block type:

### 1. Define the Schema

Add Zod schema in `src/types/message.ts`:

```typescript
export const MyBlockDataSchema = z.object({
  type: z.literal("myblock"),
  // ... your fields
});

export type MyBlockData = z.infer<typeof MyBlockDataSchema>;
```

Update the `ContentBlock` union:

```typescript
export type ContentBlock =
  | FormContentData
  | ChartContentData
  | CodeContentData
  | CardContentData
  | MyBlockData; // Add here

export const ContentBlockSchema = z.discriminatedUnion("type", [
  FormContentDataSchema,
  ChartContentDataSchema,
  CodeContentDataSchema,
  CardContentDataSchema,
  MyBlockDataSchema, // Add here
]);
```

### 2. Create the Tool

Add to `src/lib/ai/tools.ts`:

```typescript
export const generateMyBlock = tool({
  description: "Description of what this block does",
  inputSchema: MyBlockDataSchema,
  strict: true,
  execute: async (params) => params,
});

export const chatTools = {
  generateForm,
  generateChart,
  generateCode,
  generateCard,
  generateMyBlock, // Add here
};
```

### 3. Create the Renderer

Create `src/components/blocks/MyBlockContent.tsx`:

```typescript
"use client";

import type { MyBlockData } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MyBlockContentProps {
  data: MyBlockData;
}

export function MyBlockContent({ data }: MyBlockContentProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your content here */}
      </CardContent>
    </Card>
  );
}
```

### 4. Register in Router

Update `src/components/blocks/ContentBlock.tsx`:

```typescript
import { MyBlockContent } from "./MyBlockContent";

// In renderContent():
case "myblock":
  return <MyBlockContent data={content} />;
```

### 5. Update ChatMessage

Add the tool name to the block tools list in `src/components/chat/ChatMessage.tsx`:

```typescript
if (
  [
    "generateForm",
    "generateChart",
    "generateCode",
    "generateCard",
    "generateMyBlock", // Add here
  ].includes(toolName)
) {
  // ...
}
```

### 6. Add to Agent (Optional)

If you want the tool available to specific agents, update the agent configuration in `src/lib/ai/agents/`:

```typescript
// In your agent file
import { generateMyBlock } from "../tools";

export const myAgent: AgentConfig = {
  id: "myagent",
  name: "My Agent",
  instructions: "...",
  tools: {
    generateMyBlock,
    // ... other tools
  },
};
```

---

## Styling

All blocks use shadcn/ui components and follow the application's theme system:

- **Card containers** provide consistent structure
- **CSS variables** enable light/dark mode support
- **Framer Motion** animations create smooth entrances
- **Tailwind classes** handle responsive layouts

Charts use CSS variables for colors (`--color-chart-1` through `--color-chart-5`) defined in `globals.css`.

---

## Best Practices

1. **Keep schemas strict** - Use Zod validation to ensure data integrity
2. **Handle loading states** - Show indicators while tools process
3. **Provide feedback** - Use toast notifications for user actions
4. **Animate thoughtfully** - Use subtle animations that don't distract
5. **Support themes** - Use CSS variables for colors, not hardcoded values
6. **Make accessible** - Include labels, ARIA attributes, and keyboard support
7. **Consider agent scope** - Only include tools relevant to the agent's purpose
