"use client";

import { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare } from "lucide-react";
import { useChat } from "./ChatProvider";
import { ChatMessage } from "./ChatMessage";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Loader } from "@/components/ai-elements/loader";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/motion";

interface ChatContainerProps {
  className?: string;
}

export function ChatContainer({ className }: ChatContainerProps) {
  const { messages, status, suggestions, sendMessage } = useChat();

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage(suggestion);
    },
    [sendMessage]
  );

  const messageHasContent = (message: (typeof messages)[number]) => {
    return message.parts?.some((part) => {
      if (part.type === "text") {
        return (part as { type: "text"; text: string }).text.length > 0;
      }
      if (part.type === "reasoning") {
        return true;
      }
      if (part.type.startsWith("tool-")) {
        return true;
      }
      return false;
    });
  };

  const visibleMessages = useMemo(() => {
    return messages.filter((message) => {
      if (message.role === "user") return true;
      return messageHasContent(message);
    });
  }, [messages]);

  const showLoading = useMemo(() => {
    if (status === "submitted") return true;
    if (status === "streaming") {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        return !messageHasContent(lastMessage);
      }
    }
    return false;
  }, [status, messages]);

  return (
    <Conversation className={cn("flex-1", className)}>
      <ConversationContent className="max-w-3xl mx-auto px-4 py-6">
        {visibleMessages.length === 0 ? (
          <ConversationEmptyState>
            <div className="text-muted-foreground">
              <MessageSquare className="size-12" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm">Start a conversation</h3>
              <p className="text-muted-foreground text-sm">
                Ask me anything. I can also create interactive forms, charts,
                code snippets, and more.
              </p>
            </div>
            {suggestions && suggestions.length > 0 && (
              <div className="mt-6 w-full max-w-xl px-4">
                <Suggestions>
                  {suggestions.map((suggestion) => (
                    <Suggestion
                      key={suggestion}
                      suggestion={suggestion}
                      onClick={handleSuggestionClick}
                    />
                  ))}
                </Suggestions>
              </div>
            )}
          </ConversationEmptyState>
        ) : (
          visibleMessages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLast={index === visibleMessages.length - 1}
            />
          ))
        )}

        <AnimatePresence>
          {showLoading && (
            <motion.div
              key="loading"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInUp}
              className="flex items-center gap-2 text-muted-foreground text-sm"
            >
              <Loader size={16} />
              <span>Thinking...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
