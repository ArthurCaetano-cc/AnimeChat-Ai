import { z } from 'zod';

export const createChatSchema = z.object({
  agentId: z.string().uuid().describe("Agent's id"),
  userId: z.string().uuid().describe("User's id"),
});
