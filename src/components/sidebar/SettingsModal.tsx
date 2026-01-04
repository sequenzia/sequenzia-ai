"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import type { Theme } from "@/types";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { theme, setTheme, highContrast, setHighContrast } = useTheme();

  const themeOptions: { value: Theme; label: string; icon: typeof Sun; description: string }[] = [
    { value: "light", label: "Light", icon: Sun, description: "Light mode" },
    { value: "dark", label: "Dark", icon: Moon, description: "Dark mode" },
    { value: "system", label: "System", icon: Monitor, description: "Follow system" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Appearance</label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, label, icon: Icon, description }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all min-h-[88px]",
                    theme === value
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50 hover:bg-accent/5"
                  )}
                  aria-label={`Set theme to ${label}`}
                  aria-pressed={theme === value}
                >
                  <div
                    className={cn(
                      "size-10 rounded-lg flex items-center justify-center transition-colors",
                      theme === value
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="high-contrast" className="text-sm font-medium">
                High Contrast
              </label>
              <p className="text-xs text-muted-foreground">
                Increase color contrast for better visibility
              </p>
            </div>
            <button
              id="high-contrast"
              role="switch"
              aria-checked={highContrast}
              onClick={() => setHighContrast(!highContrast)}
              className={cn(
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                highContrast ? "bg-accent" : "bg-input"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                  highContrast ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
