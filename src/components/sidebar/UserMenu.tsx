"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  HelpCircle,
  ExternalLink,
  LogOut,
  ChevronUp,
  User,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";
import { menuEntrance } from "@/lib/motion/variants";
import type { Theme } from "@/types";

interface UserMenuProps {
  onSettingsClick?: () => void;
  className?: string;
}

export function UserMenu({ onSettingsClick, className }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isOpen: sidebarOpen, isMobile } = useSidebar();
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Placeholder user data
  const user = {
    name: "User",
    email: "user@example.com",
    initials: "U",
  };

  const isCollapsed = !sidebarOpen && !isMobile;

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 w-full p-2 rounded-lg",
          "hover:bg-sidebar-accent transition-colors",
          "min-h-[44px] min-w-[44px]",
          isCollapsed ? "justify-center" : "justify-start"
        )}
        aria-label="Open user menu"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        <div className="size-8 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-sidebar-primary-foreground">
            {user.initials}
          </span>
        </div>

        {/* Name and email (hidden when collapsed) */}
        {!isCollapsed && (
          <>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
            <ChevronUp
              className={cn(
                "size-4 text-muted-foreground transition-transform flex-shrink-0",
                isOpen && "rotate-180"
              )}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuEntrance}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "absolute z-50 w-56 rounded-lg border bg-popover p-1 shadow-lg",
              isCollapsed
                ? "bottom-0 left-full ml-2"
                : "bottom-full left-0 mb-2"
            )}
          >
            {/* User Info Header */}
            <div className="px-2 py-2 border-b border-border mb-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>

            {/* Theme Selection */}
            <div className="px-2 py-1.5">
              <p className="text-xs text-muted-foreground mb-2">Theme</p>
              <div className="flex gap-1">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleThemeChange(value)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors min-h-[36px]",
                      theme === value
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 text-muted-foreground"
                    )}
                    aria-label={`Set theme to ${label}`}
                  >
                    <Icon className="size-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border my-1" />

            {/* Menu Items */}
            <MenuItem
              icon={Settings}
              label="Settings"
              onClick={() => {
                setIsOpen(false);
                onSettingsClick?.();
              }}
            />
            <MenuItem
              icon={HelpCircle}
              label="Help & Support"
              onClick={() => setIsOpen(false)}
            />
            <MenuItem
              icon={ExternalLink}
              label="Learn More"
              onClick={() => {
                setIsOpen(false);
                window.open("https://github.com", "_blank");
              }}
            />

            <div className="border-t border-border my-1" />

            <MenuItem
              icon={LogOut}
              label="Sign Out"
              onClick={() => setIsOpen(false)}
              variant="destructive"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-sm transition-colors min-h-[36px]",
        variant === "destructive"
          ? "text-destructive hover:bg-destructive/10"
          : "hover:bg-sidebar-accent"
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
