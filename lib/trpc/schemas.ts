import { z } from 'zod';

// Shared context type for tRPC routers
export interface TRPCContext {
	timestamp: number;
	sender?: chrome.runtime.MessageSender;
}

const FactSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const MemoryActionSchema = z.object({
  type: z.enum(['ADD', 'UPDATE', 'DELETE', 'UNCHANGED']),
  id: z.string().optional(),
  text: z.string(),
  oldFact: z.string().optional(),
});