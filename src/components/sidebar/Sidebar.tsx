"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PanelLeftClose,
  PanelLeft,
  SquarePen,
} from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import { UserMenu } from "./UserMenu";
import { SettingsModal } from "./SettingsModal";
import { useChat } from "@/components/chat/ChatProvider";
import { Sparkles } from "@/components/ai-elements/sparkles";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { sidebarSpring } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

// Sidebar widths
const SIDEBAR_WIDTH_COLLAPSED = 72;
const SIDEBAR_WIDTH_EXPANDED = 280;
const SIDEBAR_WIDTH_MOBILE = "min(85vw, 320px)";

export function Sidebar() {
  const {
    isOpen,
    toggleSidebar,
    openMobile,
    setOpenMobile,
    isMobile,
    isTablet,
  } = useSidebar();
  const { clearMessages, messages } = useChat();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const hasMessages = messages.length > 0;

  const handleNewChat = useCallback(() => {
    clearMessages();
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [clearMessages, isMobile, setOpenMobile]);

  const getSidebarWidth = useCallback(() => {
    if (isMobile) return 0;
    return isOpen ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;
  }, [isMobile, isOpen]);

  // Mobile sidebar (Sheet)
  if (isMobile) {
    return (
      <>
        {/* Mobile toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(true)}
          className="fixed top-3 left-3 z-40 min-h-[44px] min-w-[44px]"
          aria-label="Open sidebar"
        >
          <PanelLeft className="size-5" />
        </Button>

        {/* Mobile Sheet */}
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side="left"
            className="w-[min(85vw,320px)] p-0 flex flex-col"
            showCloseButton={false}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>

            <SidebarContent
              isCollapsed={false}
              onToggle={() => setOpenMobile(false)}
              onNewChat={handleNewChat}
              hasMessages={hasMessages}
              onSettingsClick={() => setSettingsOpen(true)}
              isMobile
            />
          </SheetContent>
        </Sheet>

        <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      </>
    );
  }

  // Desktop/Tablet sidebar
  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: getSidebarWidth() }}
        transition={sidebarSpring}
        className={cn(
          "relative flex-shrink-0 h-full bg-sidebar border-r border-sidebar-border",
          "sidebar-landscape-constraint"
        )}
        aria-label="Sidebar"
      >
        <SidebarContent
          isCollapsed={!isOpen}
          onToggle={toggleSidebar}
          onNewChat={handleNewChat}
          hasMessages={hasMessages}
          onSettingsClick={() => setSettingsOpen(true)}
        />
      </motion.aside>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

interface SidebarContentProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  hasMessages: boolean;
  onSettingsClick: () => void;
  isMobile?: boolean;
}

function SidebarContent({
  isCollapsed,
  onToggle,
  onNewChat,
  hasMessages,
  onSettingsClick,
  isMobile = false,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          "flex items-center h-14 px-3 border-b border-sidebar-border flex-shrink-0",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles size={28} />
            <span className="font-semibold text-lg text-sidebar-foreground truncate">
              Sequenzia
            </span>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="min-h-[44px] min-w-[44px] flex-shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className={cn("p-3 flex-shrink-0", isCollapsed && "px-2")}>
        {hasMessages ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full gap-2 min-h-[44px]",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <SquarePen className="size-4" />
                {!isCollapsed && <span>New Chat</span>}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Start new chat?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear the current conversation. This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onNewChat}>
                  New chat
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            variant="outline"
            className={cn(
              "w-full gap-2 min-h-[44px]",
              isCollapsed && "justify-center px-0"
            )}
            onClick={onNewChat}
          >
            <SquarePen className="size-4" />
            {!isCollapsed && <span>New Chat</span>}
          </Button>
        )}
      </div>

      {/* Main Content Area - Empty for now (no chat history) */}
      <div className="flex-1 overflow-hidden" />

      {/* User Menu */}
      <div
        className={cn(
          "p-3 border-t border-sidebar-border flex-shrink-0",
          isCollapsed && "px-2"
        )}
      >
        <UserMenu onSettingsClick={onSettingsClick} />
      </div>
    </div>
  );
}
