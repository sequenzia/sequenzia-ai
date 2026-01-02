'use client';

import { MessageSquare, Bot as BotIcon } from 'lucide-react';
import { useChat } from './ChatProvider';
import { InputComposer } from './InputComposer';
import { Sparkles } from '@/components/ai-elements/sparkles';
import { getAgentMetadataById } from '@/lib/ai/agents.client';

export function EmptyState() {
  const { agentId, agentSelectorEnabled, setAgentSelectorOpen } = useChat();
  const agentMetadata = getAgentMetadataById(agentId);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl space-y-8">
        {/* Empty state content */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-accent">
            <MessageSquare className="size-16" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-xl flex items-center justify-center gap-2">
              <Sparkles size={20} />
              <span>Let's chat</span>
            </h3>
            <p className="text-muted-foreground">
              {agentMetadata?.greeting ?? 'Ask me anything!'}
            </p>
          </div>
          {agentSelectorEnabled && agentMetadata && (
            <button
              onClick={() => setAgentSelectorOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50 border border-border/50 text-sm hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <BotIcon className="size-4 text-accent" />
              <span className="text-muted-foreground">
                Chatting with{' '}
                <span className="font-medium text-foreground">{agentMetadata.name}</span>
              </span>
            </button>
          )}
        </div>

        {/* Input composer */}
        <InputComposer hideAgentSelector />
      </div>
    </div>
  );
}
