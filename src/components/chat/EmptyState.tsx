'use client';

import { useChat } from './ChatProvider';
import { InputComposer } from './InputComposer';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import { Sparkles } from '@/components/ai-elements/sparkles';
import { getAgentMetadataById } from '@/lib/ai/agents.client';

export function EmptyState() {
  const { agentId, suggestions, sendMessage } = useChat();
  const agentMetadata = getAgentMetadataById(agentId);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl space-y-4">
        {/* Empty state content */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Sparkles size={96} />
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              Welcome to Sequenzia AI
            </h1>
            <p className="text-muted-foreground text-lg">
              {agentMetadata?.greeting ?? 'Ask me anything!'}
            </p>
          </div>
          {/* Suggestion pills */}
          {suggestions && suggestions.length > 0 && (
            <Suggestions className="mt-2">
              {suggestions.map((s) => (
                <Suggestion key={s.label} suggestion={s.prompt ?? s.label} onClick={sendMessage}>
                  {s.label}
                </Suggestion>
              ))}
            </Suggestions>
          )}
        </div>

        {/* Input composer */}
        <InputComposer hideSuggestions compact />
      </div>
    </div>
  );
}
