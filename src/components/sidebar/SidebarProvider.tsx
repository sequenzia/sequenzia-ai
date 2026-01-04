"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useDeviceType } from "@/lib/motion/hooks";

const SIDEBAR_STORAGE_KEY = "sidebar-open";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

interface SidebarContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: SidebarProviderProps) {
  const { isMobile, isTablet, isDesktop } = useDeviceType();

  // Desktop sidebar state (persisted)
  const [isOpen, setIsOpenState] = useState(() => {
    if (typeof window === "undefined") return defaultOpen;
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored !== null ? stored === "true" : defaultOpen;
  });

  // Mobile sidebar state (not persisted)
  const [openMobile, setOpenMobile] = useState(false);

  // Persist desktop sidebar state
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    if (isDesktop && openMobile) {
      setOpenMobile(false);
    }
  }, [isDesktop, openMobile]);

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else {
      setIsOpenState((prev) => !prev);
    }
  }, [isMobile]);

  // Keyboard shortcut (Cmd/Ctrl+B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (e.metaKey || e.ctrlKey) &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleSidebar,
        openMobile,
        setOpenMobile,
        isMobile,
        isTablet,
        isDesktop,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
