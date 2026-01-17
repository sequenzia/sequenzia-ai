import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createModel } from "@/lib/ai/models.server";
import {
  generatePortfolioInstructions,
  PORTFOLIO_MAX_STEPS,
} from "@/lib/portfolio/config";
import { renderPortfolio } from "@/lib/ai/tools";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages: uiMessages, modelId } = await req.json();

  const model = createModel(modelId);
  const messages = await convertToModelMessages(uiMessages);

  const result = streamText({
    model,
    system: generatePortfolioInstructions(),
    messages,
    tools: { renderPortfolio },
    stopWhen: stepCountIs(PORTFOLIO_MAX_STEPS),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
