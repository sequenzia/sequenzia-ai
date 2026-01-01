"use client";

import { useState, useCallback } from "react";
import { CheckIcon } from "lucide-react";
import { useChat } from "./ChatProvider";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { MODELS, getChefs, getModelById } from "@/lib/ai/models";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
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
} from "@/components/ai-elements/model-selector";
import { Button } from "@/components/ui/button";

export function InputComposer() {
  const {
    sendMessage,
    status,
    modelId,
    setModelId,
    stop,
    isLoading,
    messages,
    suggestions,
  } = useChat();
  const [input, setInput] = useState("");
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage(suggestion);
    },
    [sendMessage]
  );

  const showSuggestions =
    suggestions && suggestions.length > 0 && messages.length > 0;

  const selectedModelData = getModelById(modelId);
  const chefs = getChefs();

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    if (status === "streaming") {
      stop();
      return;
    }

    sendMessage(message.text);
    setInput("");
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {showSuggestions && (
          <div className="mb-3">
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
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              className="min-h-[60px] resize-none"
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <ModelSelector
                open={modelSelectorOpen}
                onOpenChange={setModelSelectorOpen}
              >
                <ModelSelectorTrigger asChild>
                  <Button
                    className="h-8 gap-2 justify-start"
                    variant="outline"
                    size="sm"
                  >
                    {selectedModelData?.chefSlug && (
                      <ModelSelectorLogo provider={selectedModelData.chefSlug} />
                    )}
                    <ModelSelectorName className="max-w-[140px]">
                      {selectedModelData?.name ?? "Select model"}
                    </ModelSelectorName>
                  </Button>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {chefs.map((chef) => (
                      <ModelSelectorGroup key={chef} heading={chef}>
                        {MODELS.filter((model) => model.chef === chef).map(
                          (model) => (
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
                                  <ModelSelectorLogo
                                    key={provider}
                                    provider={provider}
                                  />
                                ))}
                              </ModelSelectorLogoGroup>
                              {modelId === model.id ? (
                                <CheckIcon className="size-4 shrink-0" />
                              ) : (
                                <div className="size-4 shrink-0" />
                              )}
                            </ModelSelectorItem>
                          )
                        )}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <PromptInputSubmit
              status={status}
              disabled={!input.trim() && !isLoading}
            />
          </PromptInputFooter>
        </PromptInput>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
