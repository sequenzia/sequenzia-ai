"use client";

import { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Bot as BotIcon } from "lucide-react";
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
import { getAgentMetadataById } from "@/lib/ai/agents.client";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/motion";

interface ChatContainerProps {
  className?: string;
}

export function ChatContainer({ className }: ChatContainerProps) {
  const { messages, status, suggestions, sendMessage, agentId, agentSelectorEnabled, setAgentSelectorOpen } = useChat();
  const agentMetadata = getAgentMetadataById(agentId);

  const handleSuggestionClick = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
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
      <ConversationContent className="max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 py-6">
        {visibleMessages.length === 0 ? (
          <ConversationEmptyState>
            <div className="text-accent">
              <MessageSquare className="size-16" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="font-semibold text-xl">✨ Let's chat</h3>
              <p className="text-muted-foreground">
                {agentMetadata?.greeting ?? "Ask me anything!"}
              </p>
            </div>
            {agentSelectorEnabled && agentMetadata && (
              <button
                onClick={() => setAgentSelectorOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50 border border-border/50 text-sm hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <BotIcon className="size-4 text-accent" />
                <span className="text-muted-foreground">
                  Chatting with <span className="font-medium text-foreground">{agentMetadata.name}</span>
                </span>
              </button>
            )}
            {suggestions && suggestions.length > 0 && (
              <div className="mt-8 w-full max-w-xl px-4">
                <p className="text-muted-foreground/60 text-sm text-center mb-3">
                  Quick starts — or ask me anything
                </p>
                <Suggestions>
                  {suggestions.map((suggestion) => (
                    <Suggestion
                      key={suggestion.label}
                      suggestion={suggestion.prompt ?? suggestion.label}
                      onClick={handleSuggestionClick}
                    >
                      {suggestion.label}
                    </Suggestion>
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
              className="flex items-center gap-2 text-accent text-sm"
            >
              <Loader size={16} className="text-accent" />
              <span>✨ Thinking...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
