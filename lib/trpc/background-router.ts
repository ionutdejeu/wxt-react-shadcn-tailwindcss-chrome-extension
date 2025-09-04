/**
 * Background service worker specific router
 * Only includes procedures that should be available in the background context
 */

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import {
    type TRPCContext,
} from "./schemas";
import { factSchema } from "./schemas";
import { handleWriteMemory } from "./handlers/background-handler";

// Initialize tRPC with SuperJSON transformer
const t = initTRPC.context<TRPCContext>().create({
    isServer: false,
    allowOutsideOfServer: true,
    transformer: superjson,
});

// Background procedures
export const backgroundRouter = t.router({
    // Memory procedures
    memory: t.router({
        storeFact: t.procedure
            .input(factSchema)
            .mutation(async ({ input, ctx }) => {
                console.log('store fact router,', input, ctx);
                handleWriteMemory({
                    memory: {
                        facts: [input],
                    },
                }, ctx);
            })
    }),
    // Internal reporting (called by offscreen)
    _internal: t.router({

        keepalive: t.procedure.mutation(async () => {
            return { success: true };
        }),
    }),
});

export type BackgroundRouter = typeof backgroundRouter;
