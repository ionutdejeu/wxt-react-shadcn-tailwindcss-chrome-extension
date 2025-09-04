/**
 * Unified tRPC client configuration
 * All clients now use sendMessage for communication
 */

import { createTRPCClient } from "@trpc/client";
import type { BackgroundRouter } from "./background-router";
import { chromeLinkWithSuperjson } from "./crhome-adapter";

// Client for Sidepanel -> Background communication (used in sidepanel)
// Uses tRPC v11 client for cleaner syntax in UI components
export const sidepanelToBackgroundClient = createTRPCClient<BackgroundRouter>({
	links: [chromeLinkWithSuperjson({ target: "background" })],
});


// Client for Offscreen -> Background communication (used in offscreen document)
// Uses regular client for offscreen document
export const offscreenToBackgroundClient = createTRPCClient<BackgroundRouter>({
	links: [chromeLinkWithSuperjson({ target: "background" })],
});
