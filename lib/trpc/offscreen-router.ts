/**
 * Offscreen document specific router
 * Only includes procedures that should be available in the offscreen context
 */

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
 
import { MemoryActionSchema, type TRPCContext } from "./schemas";

// Initialize tRPC with SuperJSON transformer
const t = initTRPC.context<TRPCContext>().create({
	isServer: false,
	allowOutsideOfServer: true,
	transformer: superjson,
});

// Offscreen procedures
export const offscreenRouter = t.router({
	offscreen: t.router({
		manualAction: t.procedure
			.input(MemoryActionSchema)
			.mutation(async ({ input, ctx }) => {
                console.log("Manual action input:", input);
			}),
	}),
});

export type OffscreenRouter = typeof offscreenRouter;
