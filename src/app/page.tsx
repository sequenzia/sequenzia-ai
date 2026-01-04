import { ChatProvider } from "@/components/chat/ChatProvider";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { Sidebar, SidebarProvider } from "@/components/sidebar";
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
      <SidebarProvider>
        <div className="flex h-dvh w-full bg-background">
          <Sidebar />
          <main className="flex-1 flex flex-col relative h-full min-w-0 overflow-hidden">
            <ChatLayout />
            {/* Background gradient decorations */}
            <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/2 bg-gradient-to-bl from-muted/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/3 bg-gradient-to-tr from-muted/10 to-transparent pointer-events-none" />
          </main>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}
