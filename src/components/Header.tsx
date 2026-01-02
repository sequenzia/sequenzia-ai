"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sun, Moon, Monitor, SquarePen } from "lucide-react";
import { useChat } from "./chat/ChatProvider";
import { Sparkles } from "./ai-elements/sparkles";
import type { Theme } from "@/types";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { clearMessages, messages } = useChat();
  const hasMessages = messages.length > 0;

  const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const CurrentIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles size={36} />
          <h1 className="font-semibold text-2xl bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text text-transparent">
            Sequenzia AI
          </h1>
        </div>

        <div className="flex items-center gap-1">
          {hasMessages && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/20 hover:text-accent"
                >
                  <SquarePen className="size-5" />
                  <span className="sr-only">New chat</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start new chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear the current conversation. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearMessages}>
                    New chat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-accent/20 hover:text-accent">
                <CurrentIcon className="size-5" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => setTheme(value)}
                  className="gap-2"
                >
                  <Icon className="size-4" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
