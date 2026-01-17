"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useChat as useAIChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage, ChatStatus } from "ai";
import { DEFAULT_MODEL_ID } from "@/config";

interface ChatContextValue {
  messages: UIMessage[];
  status: ChatStatus;
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => void;
  regenerateLastMessage: () => void;
  clearMessages: () => void;
  stop: () => void;
  modelId: string;
  setModelId: (modelId: string) => void;
  suggestions?: Array<{ label: string; prompt?: string }>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
  suggestions?: Array<{ label: string; prompt?: string }>;
}

export function ChatProvider({
  children,
  suggestions,
}: ChatProviderProps) {
  const [modelId, setModelId] = useState<string>(DEFAULT_MODEL_ID);

  const {
    messages,
    status,
    error,
    sendMessage: aiSendMessage,
    stop,
    setMessages,
  } = useAIChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const sendMessage = useCallback(
    (content: string) => {
      aiSendMessage({ text: content }, { body: { modelId } });
    },
    [aiSendMessage, modelId]
  );

  const regenerateLastMessage = useCallback(() => {
    const lastUserMessageIndex = [...messages]
      .reverse()
      .findIndex((m) => m.role === "user");
    if (lastUserMessageIndex >= 0) {
      const index = messages.length - 1 - lastUserMessageIndex;
      const lastUserMessage = messages[index];
      const textPart = lastUserMessage.parts?.find(
        (p): p is { type: "text"; text: string } => p.type === "text"
      );
      if (textPart) {
        setMessages(messages.slice(0, index));
        setTimeout(() => {
          aiSendMessage({ text: textPart.text }, { body: { modelId } });
        }, 100);
      }
    }
  }, [messages, setMessages, aiSendMessage, modelId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const contextValue: ChatContextValue = useMemo(
    () => ({
      messages,
      status,
      isLoading,
      error: error ?? null,
      sendMessage,
      regenerateLastMessage,
      clearMessages,
      stop,
      modelId,
      setModelId,
      suggestions,
    }),
    [
      messages,
      status,
      isLoading,
      error,
      sendMessage,
      regenerateLastMessage,
      clearMessages,
      stop,
      modelId,
      suggestions,
    ]
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
