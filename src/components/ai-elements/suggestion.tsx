"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import {
  LightbulbIcon,
  UserIcon,
  BriefcaseIcon,
  RocketIcon,
  GraduationCapIcon,
  ZapIcon,
  MailIcon,
  CodeIcon,
  BarChartIcon,
  FileTextIcon,
  PenLineIcon,
  SearchIcon,
  SparklesIcon,
  GlobeIcon,
} from "lucide-react";
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

// Get icon based on suggestion content
function getSuggestionIcon(text: string): ReactNode {
  const lowerText = text.toLowerCase();
  const iconClass = "size-4 text-accent";

  // Portfolio-specific suggestions
  if (lowerText.includes("bio") || lowerText.includes("about me"))
    return <UserIcon className={iconClass} />;
  if (lowerText.includes("experience") || lowerText.includes("work history"))
    return <BriefcaseIcon className={iconClass} />;
  if (lowerText.includes("project"))
    return <RocketIcon className={iconClass} />;
  if (lowerText.includes("education") || lowerText.includes("degree"))
    return <GraduationCapIcon className={iconClass} />;
  if (lowerText.includes("skill"))
    return <ZapIcon className={iconClass} />;
  if (lowerText.includes("contact") || lowerText.includes("email") || lowerText.includes("reach"))
    return <MailIcon className={iconClass} />;

  // General suggestions
  if (lowerText.includes("web") || lowerText.includes("search") || lowerText.includes("internet") || lowerText.includes("news") || lowerText.includes("latest"))
    return <GlobeIcon className={iconClass} />;
  if (lowerText.includes("code") || lowerText.includes("function") || lowerText.includes("build"))
    return <CodeIcon className={iconClass} />;
  if (lowerText.includes("chart") || lowerText.includes("graph") || lowerText.includes("visualiz"))
    return <BarChartIcon className={iconClass} />;
  if (lowerText.includes("form") || lowerText.includes("input") || lowerText.includes("survey"))
    return <FileTextIcon className={iconClass} />;
  if (lowerText.includes("help") || lowerText.includes("explain") || lowerText.includes("how"))
    return <LightbulbIcon className={iconClass} />;
  if (lowerText.includes("write") || lowerText.includes("create") || lowerText.includes("generate"))
    return <PenLineIcon className={iconClass} />;
  if (lowerText.includes("analyze") || lowerText.includes("review") || lowerText.includes("check"))
    return <SearchIcon className={iconClass} />;

  return <SparklesIcon className={iconClass} />;
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

  const icon = getSuggestionIcon(suggestion);

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
      <span className="mr-1.5">{icon}</span>
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
          variant="ghost"
          size="icon"
          className={cn("size-8", className)}
          type="button"
        >
          <LightbulbIcon className="size-5" />
          <span className="sr-only">Suggestions</span>
        </Button>
      </PromptInputHoverCardTrigger>
      <PromptInputHoverCardContent
        side="top"
        align="center"
        className="w-auto max-w-md p-3"
      >
        <div className="flex flex-wrap justify-center gap-2">
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
      </PromptInputHoverCardContent>
    </PromptInputHoverCard>
  );
}
