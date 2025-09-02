/**
 * Background service worker specific router
 * Only includes procedures that should be available in the background context
 */

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import type { AnalysisMemory } from "../types";
import type { AIProviderConfig } from "../utils/broadcast";
import {
	type TRPCContext,
} from "./schemas";
import { handleStartManualAnalysis } from "./handlers/background-handler";

// Initialize tRPC with SuperJSON transformer
const t = initTRPC.context<TRPCContext>().create({
	isServer: false,
	allowOutsideOfServer: true,
	transformer: superjson,
});

// Background procedures
export const backgroundRouter = t.router({
	// Analysis procedures
	analysis: t.router({
		startManual: t.procedure
			.input(),
			}))
			.mutation(async ({ input, ctx }) => {
				return handleStartManualAnalysis(input, ctx);
			}),

		 
	}),

	// Settings
	settings: t.router({
		toggleAutoAnalysis: t.procedure
			.input(z.object({ enabled: z.boolean() }))
			.mutation(async ({ input, ctx }) => {
				return handleToggleAutoAnalysis(input, ctx);
			}),
	}),

	// Ambient analysis
	ambient: t.router({
		queryStatus: t.procedure.query(async () => {
			return handleQueryStatus();
		}),

		queryNextAlarm: t.procedure.query(async () => {
			return handleQueryNextAlarm();
		}),

		verifyAlarmHealth: t.procedure.query(async () => {
			return handleVerifyAlarmHealth();
		}),
	}),

	// AI
	ai: t.router({
		initialize: t.procedure.mutation(async () => {
			return handleInitializeAI();
		}),

		getConfig: t.procedure.query(async (): Promise<AIProviderConfig> => {
			return handleGetAIConfig();
		}),
	}),

	// Memory operations
	memory: t.router({
		read: t.procedure.query(async () => {
			const result = await handleReadMemory();
			return result.memory;
		}),

		write: t.procedure
			.input(z.object({ memory: z.any() as z.ZodType<AnalysisMemory> }))
			.mutation(async ({ input, ctx }) => {
				return handleWriteMemory(input, ctx);
			}),

		clearPatterns: t.procedure.mutation(async () => {
			return handleClearPatterns();
		}),
	}),

	// Internal reporting (called by offscreen)
	_internal: t.router({
		
		keepalive: t.procedure.mutation(async () => {
			return { success: true };
		}),
	}),
});

export type BackgroundRouter = typeof backgroundRouter;
