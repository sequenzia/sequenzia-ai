import { ChatProvider } from "@/components/chat/ChatProvider";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { Header } from "@/components/Header";
import { getActiveAgent } from "@/lib/ai/agents";
import { AGENT_SELECTOR_ON } from "@/config";

export default function Home() {
  const agent = getActiveAgent();

  return (
    <ChatProvider
      suggestions={agent.suggestions}
      initialAgentId={agent.id}
      agentSelectorEnabled={AGENT_SELECTOR_ON}
    >
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <ChatLayout />
      </div>
    </ChatProvider>
  );
}
