"use client";

import { useState, type ComponentProps } from "react";
import { LightbulbIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PromptInputHoverCard,
  PromptInputHoverCardTrigger,
  PromptInputHoverCardContent,
} from "@/components/ai-elements/prompt-input";

export type SuggestionsProps = ComponentProps<"div">;

export function Suggestions({ className, children, ...props }: SuggestionsProps) {
  return (
    <div
      className={cn("flex flex-wrap justify-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Get emoji prefix based on suggestion content
function getSuggestionEmoji(text: string): string {
  const lowerText = text.toLowerCase();

  // Portfolio-specific suggestions
  if (lowerText.includes("bio") || lowerText.includes("about me")) return "👤";
  if (lowerText.includes("experience") || lowerText.includes("work history")) return "💼";
  if (lowerText.includes("project")) return "🚀";
  if (lowerText.includes("education") || lowerText.includes("degree")) return "🎓";
  if (lowerText.includes("skill")) return "⚡";
  if (lowerText.includes("contact") || lowerText.includes("email") || lowerText.includes("reach")) return "📧";

  // General suggestions
  if (lowerText.includes("code") || lowerText.includes("function") || lowerText.includes("build")) return "💻";
  if (lowerText.includes("chart") || lowerText.includes("graph") || lowerText.includes("visualiz")) return "📊";
  if (lowerText.includes("form") || lowerText.includes("input") || lowerText.includes("survey")) return "📝";
  if (lowerText.includes("help") || lowerText.includes("explain") || lowerText.includes("how")) return "💡";
  if (lowerText.includes("write") || lowerText.includes("create") || lowerText.includes("generate")) return "✍️";
  if (lowerText.includes("analyze") || lowerText.includes("review") || lowerText.includes("check")) return "🔍";
  return "✨";
}

export type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export function Suggestion({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}: SuggestionProps) {
  const handleClick = () => {
    onClick?.(suggestion);
  };

  const emoji = getSuggestionEmoji(suggestion);

  return (
    <Button
      className={cn(
        "cursor-pointer rounded-full px-4 transition-all duration-200",
        "hover:border-accent hover:bg-accent/10 hover:scale-[1.02]",
        className
      )}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      <span className="mr-1.5">{emoji}</span>
      {children || suggestion}
    </Button>
  );
}

export type SuggestionsHoverCardProps = {
  suggestions: Array<{ label: string; prompt?: string }>;
  onSuggestionClick: (prompt: string) => void;
  className?: string;
};

export function SuggestionsHoverCard({
  suggestions,
  onSuggestionClick,
  className,
}: SuggestionsHoverCardProps) {
  const [open, setOpen] = useState(false);

  const handleClick = (prompt: string) => {
    setOpen(false);
    onSuggestionClick(prompt);
  };

  if (!suggestions?.length) return null;

  return (
    <PromptInputHoverCard
      open={open}
      onOpenChange={setOpen}
      openDelay={200}
      closeDelay={100}
    >
      <PromptInputHoverCardTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8 gap-2", className)}
          type="button"
        >
          <LightbulbIcon className="size-4" />
          <span className="sr-only md:not-sr-only">Suggestions</span>
        </Button>
      </PromptInputHoverCardTrigger>
      <PromptInputHoverCardContent
        side="top"
        align="start"
        className="w-auto max-w-md p-3"
      >
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Quick prompts
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Suggestion
                key={s.label}
                suggestion={s.prompt ?? s.label}
                onClick={handleClick}
              >
                {s.label}
              </Suggestion>
            ))}
          </div>
        </div>
      </PromptInputHoverCardContent>
    </PromptInputHoverCard>
  );
}
