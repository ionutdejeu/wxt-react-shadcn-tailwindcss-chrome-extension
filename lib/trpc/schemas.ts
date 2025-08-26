import { z } from 'zod';

const MemoryActionSchema = z.object({
  type: z.enum(['ADD', 'UPDATE', 'DELETE', 'UNCHANGED']),
  id: z.string().optional(),
  text: z.string(),
  oldFact: z.string().optional(),
});