'use client';

import { useMemo } from 'react';
import { useChat } from './ChatProvider';
import { ChatContainer } from './ChatContainer';
import { InputComposer } from './InputComposer';
import { EmptyState } from './EmptyState';

export function ChatLayout() {
  const { messages } = useChat();

  // Check if there are any visible messages
  const hasMessages = useMemo(() => {
    return messages.some((message) => {
      if (message.role === 'user') return true;
      return message.parts?.some((part) => {
        if (part.type === 'text') {
          return (part as { type: 'text'; text: string }).text.length > 0;
        }
        if (part.type === 'reasoning') return true;
        if (part.type.startsWith('tool-')) return true;
        return false;
      });
    });
  }, [messages]);

  if (!hasMessages) {
    return <EmptyState />;
  }

  return (
    <>
      <ChatContainer className="flex-1 overflow-hidden" />
      <InputComposer />
    </>
  );
}
