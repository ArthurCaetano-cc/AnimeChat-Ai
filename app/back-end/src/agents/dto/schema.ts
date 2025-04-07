import { z } from 'zod';

export const createAgentSchema = z.object({
  name: z.string().min(1).max(50).describe("Agent's name"),
  description: z.string().max(200).describe("Agent's description"),
  defaultInstruction: z
    .string()
    .max(255)
    .describe("Agent's default instruction"),
});
