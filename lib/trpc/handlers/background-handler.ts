/**
 * Handler functions for background tRPC procedures
 * Separated to avoid circular dependencies
 */

import { MemoryData } from "@/lib/types";
import { loadAIConfigFromStorage } from "@/lib/ai/ai-config";
import { AIProviderConfig } from "@/lib/ai/ai-interface";
import { createEmptyMemory, loadMemoryFromStorage, saveMemoryToStorage } from "@/lib/memory/memory";
import { TRPCContext } from "../schemas";

 
 
export async function handleGetAIConfig(): Promise<AIProviderConfig> {
	return loadAIConfigFromStorage();
}

export async function handleReadMemory() {
	const memory = await loadMemoryFromStorage();
	return { memory };
}

export async function handleWriteMemory(
	input: { memory: MemoryData },
	ctx?: TRPCContext,
) {
	try {
		// Ensure the memory object has the required structure
		const emptyMemory = createEmptyMemory();
		const memory: MemoryData = {
			...emptyMemory,
			...input.memory,
		};

		await saveMemoryToStorage(memory);
		return { success: true };
	} catch (error) {
		console.error("[Background] Failed to write memory:", {
			error: error instanceof Error ? error.message : String(error),
			context: ctx,
			inputMemory: input,
		});
		throw error; // Re-throw to maintain error propagation
	}
}
