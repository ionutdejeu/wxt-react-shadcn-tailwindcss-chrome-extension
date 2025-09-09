import { z } from 'zod';

// Shared context type for tRPC routers
export interface TRPCContext {
	timestamp: number;
	sender?: chrome.runtime.MessageSender;
}

export const factSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const MemoryActionSchema = z.object({
  type: z.enum(['ADD', 'UPDATE', 'DELETE', 'UNCHANGED']),
  id: z.string().optional(),
  text: z.string(),
  oldFact: z.string().optional(),
});