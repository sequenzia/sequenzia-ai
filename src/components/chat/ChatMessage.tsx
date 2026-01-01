"use client";

import { memo } from "react";
import { motion } from "motion/react";
import type { UIMessage } from "ai";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Tool, ToolHeader, ToolContent, ToolOutput } from "@/components/ai-elements/tool";
import type { ToolUIPart } from "ai";
import { ContentBlock } from "@/components/blocks/ContentBlock";
import { useChat } from "./ChatProvider";
import { messageItemUser, messageItemAssistant } from "@/lib/motion";
import { CopyIcon, RefreshCwIcon } from "lucide-react";
import type { ContentBlock as ContentBlockType } from "@/types";

interface ChatMessageProps {
  message: UIMessage;
  isLast?: boolean;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isLast = false,
}: ChatMessageProps) {
  const { regenerateLastMessage, status } = useChat();
  const isUser = message.role === "user";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Get all text content for copying
  const getAllText = () => {
    return (
      message.parts
        ?.filter(
          (p): p is { type: "text"; text: string } => p.type === "text"
        )
        .map((p) => p.text)
        .join("\n") || ""
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={isUser ? messageItemUser : messageItemAssistant}
    >
      <Message from={message.role}>
        <MessageContent>
          {message.parts?.map((part, index) => {
            const key = `${message.id}-${index}`;

            switch (part.type) {
              case "text":
                return <MessageResponse key={key}>{part.text}</MessageResponse>;

              case "reasoning":
                return (
                  <Reasoning
                    key={key}
                    isStreaming={
                      status === "streaming" &&
                      isLast &&
                      index === (message.parts?.length ?? 0) - 1
                    }
                  >
                    <ReasoningTrigger />
                    <ReasoningContent>{part.text}</ReasoningContent>
                  </Reasoning>
                );

              default:
                // Handle tool parts
                if (part.type.startsWith("tool-")) {
                  const toolName = part.type.replace("tool-", "");
                  const toolPart = part as {
                    type: string;
                    state: string;
                    output?: unknown;
                  };

                  const fullToolPart = part as ToolUIPart;

                  // Check if this is one of our content block tools
                  if (
                    [
                      "generateForm",
                      "generateChart",
                      "generateCode",
                      "generateCard",
                    ].includes(toolName)
                  ) {
                    if (
                      toolPart.state === "output-available" &&
                      toolPart.output
                    ) {
                      return (
                        <ContentBlock
                          key={key}
                          content={toolPart.output as ContentBlockType}
                          messageId={message.id}
                        />
                      );
                    }
                    // Show error or loading state for tools
                    return (
                      <Tool key={key}>
                        <ToolHeader
                          title={toolName}
                          type={part.type as ToolUIPart["type"]}
                          state={toolPart.state as ToolUIPart["state"]}
                        />
                        {toolPart.state === "output-error" && (
                          <ToolContent>
                            <ToolOutput
                              output={fullToolPart.output}
                              errorText={fullToolPart.errorText}
                            />
                          </ToolContent>
                        )}
                      </Tool>
                    );
                  }

                  // Generic tool display
                  return (
                    <Tool key={key}>
                      <ToolHeader
                        title={toolName}
                        type={part.type as ToolUIPart["type"]}
                        state={toolPart.state as ToolUIPart["state"]}
                      />
                    </Tool>
                  );
                }
                return null;
            }
          })}
        </MessageContent>

        {!isUser && isLast && (
          <MessageActions>
            <MessageAction
              onClick={() => handleCopy(getAllText())}
              label="Copy"
              tooltip="Copy message"
            >
              <CopyIcon className="size-3" />
            </MessageAction>
            <MessageAction
              onClick={regenerateLastMessage}
              label="Regenerate"
              tooltip="Regenerate response"
            >
              <RefreshCwIcon className="size-3" />
            </MessageAction>
          </MessageActions>
        )}
      </Message>
    </motion.div>
  );
});
