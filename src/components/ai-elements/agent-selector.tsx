"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ReactNode, ComponentProps } from "react";

export type AgentSelectorProps = ComponentProps<typeof Dialog>;

export const AgentSelector = (props: AgentSelectorProps) => (
  <Dialog {...props} />
);

export type AgentSelectorTriggerProps = ComponentProps<typeof DialogTrigger>;

export const AgentSelectorTrigger = (props: AgentSelectorTriggerProps) => (
  <DialogTrigger {...props} />
);

export type AgentSelectorContentProps = ComponentProps<typeof DialogContent> & {
  title?: ReactNode;
};

export const AgentSelectorContent = ({
  className,
  children,
  title = "Agent Selector",
  ...props
}: AgentSelectorContentProps) => (
  <DialogContent className={cn("p-0", className)} {...props}>
    <DialogTitle className="sr-only">{title}</DialogTitle>
    <Command className="**:data-[slot=command-input-wrapper]:h-auto">
      {children}
    </Command>
  </DialogContent>
);

export type AgentSelectorInputProps = ComponentProps<typeof CommandInput>;

export const AgentSelectorInput = ({
  className,
  ...props
}: AgentSelectorInputProps) => (
  <CommandInput className={cn("h-auto py-3.5", className)} {...props} />
);

export type AgentSelectorListProps = ComponentProps<typeof CommandList>;

export const AgentSelectorList = (props: AgentSelectorListProps) => (
  <CommandList {...props} />
);

export type AgentSelectorEmptyProps = ComponentProps<typeof CommandEmpty>;

export const AgentSelectorEmpty = (props: AgentSelectorEmptyProps) => (
  <CommandEmpty {...props} />
);

export type AgentSelectorItemProps = ComponentProps<typeof CommandItem>;

export const AgentSelectorItem = ({
  className,
  ...props
}: AgentSelectorItemProps) => (
  <CommandItem className={cn("group", className)} {...props} />
);

export type AgentSelectorNameProps = ComponentProps<"span">;

export const AgentSelectorName = ({
  className,
  ...props
}: AgentSelectorNameProps) => (
  <span className={cn("flex-1 truncate text-left", className)} {...props} />
);

export type AgentSelectorDescriptionProps = ComponentProps<"span">;

export const AgentSelectorDescription = ({
  className,
  ...props
}: AgentSelectorDescriptionProps) => (
  <span
    className={cn(
      "text-muted-foreground text-xs truncate",
      "group-data-[selected=true]:text-accent-foreground/80",
      className
    )}
    {...props}
  />
);
