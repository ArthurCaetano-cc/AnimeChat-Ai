import { z } from 'zod';

export const sendMessageSchema = z.object({
  chatId: z
    .string()
    .uuid()
    .describe('The ID of the chat to send the message to'),
  userId: z
    .string()
    .uuid()
    .optional()
    .describe('The ID of the user sending the message'),
  content: z.string().describe('The content of the message'),
  role: z
    .enum(['USER', 'AGENT'])
    .describe('the role of who is sending the message'),
});
