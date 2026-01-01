import { ChatProvider } from "@/components/chat/ChatProvider";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { InputComposer } from "@/components/chat/InputComposer";
import { Header } from "@/components/Header";
import { getActiveAgent } from "@/lib/ai/agents";

export default function Home() {
  const agent = getActiveAgent();

  return (
    <ChatProvider suggestions={agent.suggestions}>
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <ChatContainer className="flex-1 overflow-hidden" />
        <InputComposer />
      </div>
    </ChatProvider>
  );
}
