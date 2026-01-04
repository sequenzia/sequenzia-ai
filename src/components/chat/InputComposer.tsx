'use client';

import { useState, useCallback } from 'react';
import { CheckIcon, BotIcon } from 'lucide-react';
import { useChat } from './ChatProvider';
import { SuggestionsHoverCard } from '@/components/ai-elements/suggestion';
import { MODELS, getChefs, getModelById } from '@/lib/ai/models';
import { AGENTS, getAgentMetadataById } from '@/lib/ai/agents.client';
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
} from '@/components/ai-elements/model-selector';
import {
  AgentSelector,
  AgentSelectorTrigger,
  AgentSelectorContent,
  AgentSelectorInput,
  AgentSelectorList,
  AgentSelectorEmpty,
  AgentSelectorItem,
  AgentSelectorName,
  AgentSelectorDescription,
} from '@/components/ai-elements/agent-selector';
import { Button } from '@/components/ui/button';

interface InputComposerProps {
  hideAgentSelector?: boolean;
  hideSuggestions?: boolean;
  compact?: boolean;
}

export function InputComposer({ hideAgentSelector, hideSuggestions, compact }: InputComposerProps = {}) {
  const {
    sendMessage,
    status,
    modelId,
    setModelId,
    agentId,
    setAgentId,
    agentSelectorEnabled,
    agentSelectorOpen,
    setAgentSelectorOpen,
    stop,
    isLoading,
    suggestions,
  } = useChat();
  const [input, setInput] = useState('');
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);

  const handleSuggestionClick = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage],
  );

  const selectedModelData = getModelById(modelId);
  const selectedAgentData = getAgentMetadataById(agentId);
  const chefs = getChefs();

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    if (status === 'streaming') {
      stop();
      return;
    }

    sendMessage(message.text);
    setInput('');
  };

  return (
    <div className="p-4 pb-8 pb-[calc(2rem+var(--safe-area-inset-bottom))]">
      <div className={compact ? "max-w-2xl lg:max-w-3xl mx-auto" : "max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"}>
        {/* Glassmorphism container */}
        <div className="relative group pointer-events-auto">
          {/* Glassmorphism background layer with backdrop blur */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-card/80 dark:bg-card/60 border border-border/30 dark:border-border/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200 group-focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.16)] dark:group-focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.5)] group-focus-within:border-border/50 dark:group-focus-within:border-border/70" />
          </div>
          {/* Content layer */}
          <div className="relative">
            <PromptInput onSubmit={handleSubmit} className="rounded-2xl [&_[data-slot=input-group]]:border-0 [&_[data-slot=input-group]]:rounded-2xl [&_[data-slot=input-group]]:shadow-none">
              <PromptInputBody>
                <PromptInputTextarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Send a message..."
                  className="min-h-[60px] resize-none bg-transparent"
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  {agentSelectorEnabled && (
                    <AgentSelector open={agentSelectorOpen} onOpenChange={setAgentSelectorOpen}>
                      {!hideAgentSelector && (
                        <AgentSelectorTrigger asChild>
                          <Button className="h-8 gap-2 justify-start" variant="outline" size="sm">
                            <BotIcon className="size-4" />
                            <AgentSelectorName className="max-w-[120px]">
                              {selectedAgentData?.name ?? 'Select agent'}
                            </AgentSelectorName>
                          </Button>
                        </AgentSelectorTrigger>
                      )}
                      <AgentSelectorContent>
                        <AgentSelectorInput placeholder="Search agents..." />
                        <AgentSelectorList>
                          <AgentSelectorEmpty>No agents found.</AgentSelectorEmpty>
                          {AGENTS.map((agent) => (
                            <AgentSelectorItem
                              key={agent.id}
                              value={agent.id}
                              onSelect={() => {
                                setAgentId(agent.id);
                                setAgentSelectorOpen(false);
                              }}
                              className="flex flex-col items-start gap-1 py-2"
                            >
                              <div className="flex items-center gap-2 w-full">
                                <AgentSelectorName>{agent.name}</AgentSelectorName>
                                {agentId === agent.id && (
                                  <CheckIcon className="size-4 shrink-0 ml-auto" />
                                )}
                              </div>
                              {agent.description && (
                                <AgentSelectorDescription>
                                  {agent.description}
                                </AgentSelectorDescription>
                              )}
                            </AgentSelectorItem>
                          ))}
                        </AgentSelectorList>
                      </AgentSelectorContent>
                    </AgentSelector>
                  )}
                  <ModelSelector open={modelSelectorOpen} onOpenChange={setModelSelectorOpen}>
                    <ModelSelectorTrigger asChild>
                      <Button className="h-8 gap-2 justify-start" variant="outline" size="sm">
                        {selectedModelData?.chefSlug && (
                          <ModelSelectorLogo provider={selectedModelData.chefSlug} />
                        )}
                        <ModelSelectorName className="max-w-[140px]">
                          {selectedModelData?.name ?? 'Select model'}
                        </ModelSelectorName>
                      </Button>
                    </ModelSelectorTrigger>
                    <ModelSelectorContent>
                      <ModelSelectorInput placeholder="Search models..." />
                      <ModelSelectorList>
                        <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                        {chefs.map((chef) => (
                          <ModelSelectorGroup key={chef} heading={chef}>
                            {MODELS.filter((model) => model.chef === chef).map((model) => (
                              <ModelSelectorItem
                                key={model.id}
                                value={model.id}
                                onSelect={() => {
                                  setModelId(model.id);
                                  setModelSelectorOpen(false);
                                }}
                                className="flex items-center gap-2"
                              >
                                <ModelSelectorLogo provider={model.chefSlug} />
                                <ModelSelectorName>{model.name}</ModelSelectorName>
                                <ModelSelectorLogoGroup className="ml-auto">
                                  {model.providers.map((provider) => (
                                    <ModelSelectorLogo key={provider} provider={provider} />
                                  ))}
                                </ModelSelectorLogoGroup>
                                {modelId === model.id ? (
                                  <CheckIcon className="size-4 shrink-0" />
                                ) : (
                                  <div className="size-4 shrink-0" />
                                )}
                              </ModelSelectorItem>
                            ))}
                          </ModelSelectorGroup>
                        ))}
                      </ModelSelectorList>
                    </ModelSelectorContent>
                  </ModelSelector>
                </PromptInputTools>
                <div className="flex items-center gap-1">
                  {!hideSuggestions && (
                    <SuggestionsHoverCard
                      suggestions={suggestions ?? []}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  )}
                  <PromptInputSubmit status={status} disabled={!input.trim() && !isLoading} />
                </div>
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
