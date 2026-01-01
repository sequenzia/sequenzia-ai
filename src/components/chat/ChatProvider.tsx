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
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import {
  DEFAULT_AGENT_ID,
  getAgentMetadataById,
} from "@/lib/ai/agents.client";

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
  agentId: string;
  setAgentId: (agentId: string) => void;
  agentSelectorEnabled: boolean;
  agentSelectorOpen: boolean;
  setAgentSelectorOpen: (open: boolean) => void;
  suggestions?: Array<{ label: string; prompt?: string }>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
  suggestions?: Array<{ label: string; prompt?: string }>;
  initialAgentId?: string;
  agentSelectorEnabled?: boolean;
}

export function ChatProvider({
  children,
  suggestions: initialSuggestions,
  initialAgentId,
  agentSelectorEnabled = false,
}: ChatProviderProps) {
  const [modelId, setModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [agentId, setAgentId] = useState<string>(
    initialAgentId ?? DEFAULT_AGENT_ID
  );
  const [agentSelectorOpen, setAgentSelectorOpen] = useState(false);

  // Derive suggestions from selected agent when selector is enabled
  const suggestions = useMemo(() => {
    if (agentSelectorEnabled) {
      const agentMeta = getAgentMetadataById(agentId);
      return agentMeta?.suggestions ?? [];
    }
    return initialSuggestions;
  }, [agentSelectorEnabled, agentId, initialSuggestions]);

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
      aiSendMessage({ text: content }, { body: { modelId, agentId } });
    },
    [aiSendMessage, modelId, agentId]
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
          aiSendMessage({ text: textPart.text }, { body: { modelId, agentId } });
        }, 100);
      }
    }
  }, [messages, setMessages, aiSendMessage, modelId, agentId]);

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
      agentId,
      setAgentId,
      agentSelectorEnabled,
      agentSelectorOpen,
      setAgentSelectorOpen,
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
      agentId,
      agentSelectorEnabled,
      agentSelectorOpen,
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
