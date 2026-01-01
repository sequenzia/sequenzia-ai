import { tool } from "ai";
import { z } from "zod";
import {
  FormFieldSchema,
  ChartContentDataSchema,
  CodeContentDataSchema,
  CardContentDataSchema,
} from "@/types/message";

export const generateForm = tool({
  description:
    "Generate an interactive form for collecting user input. Use for surveys, registrations, feedback forms, or any structured data collection.",
  inputSchema: z.object({
    type: z.literal("form").describe('Must always be exactly "form"'),
    title: z.string().describe("The form title"),
    description: z.string().optional().describe("Optional description"),
    fields: z.array(FormFieldSchema).describe("Array of form fields"),
    submitLabel: z.string().optional().describe("Custom submit button label"),
  }),
  strict: true,
  execute: async (params) => params,
});

export const generateChart = tool({
  description:
    'Generate a data visualization chart. Include "data" array with {label, value} objects.',
  inputSchema: ChartContentDataSchema,
  strict: true,
  execute: async (params) => params,
});

export const generateCode = tool({
  description: "Generate a code block with syntax highlighting.",
  inputSchema: CodeContentDataSchema,
  strict: true,
  execute: async (params) => params,
});

export const generateCard = tool({
  description:
    "Generate a rich content card for displaying structured information with optional media and actions.",
  inputSchema: CardContentDataSchema,
  strict: true,
  execute: async (params) => params,
});

export const chatTools = {
  generateForm,
  generateChart,
  generateCode,
  generateCard,
};
