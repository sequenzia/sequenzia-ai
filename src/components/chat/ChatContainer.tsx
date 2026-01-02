"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "./ChatProvider";
import { ChatMessage } from "./ChatMessage";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Sparkles } from "@/components/ai-elements/sparkles";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/motion";

interface ChatContainerProps {
  className?: string;
}

export function ChatContainer({ className }: ChatContainerProps) {
  const { messages, status } = useChat();

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
      <ConversationContent className="max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 py-6">
        {visibleMessages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLast={index === visibleMessages.length - 1}
          />
        ))}

        <AnimatePresence>
          {showLoading && (
            <motion.div
              key="loading"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInUp}
              className="flex items-center gap-2 text-accent text-sm"
            >
              <Loader size={16} className="text-accent" />
              <Sparkles size={16} />
              <span>Thinking...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
