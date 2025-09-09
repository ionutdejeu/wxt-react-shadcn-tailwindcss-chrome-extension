import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        permissions: ["activeTab", "scripting", "sidePanel", "storage", "tabs","history",
		"alarms",
		"notifications",
		"offscreen"],
        action: {},
        name: '__MSG_extName__',
        description: '__MSG_extDescription__',
        default_locale: "en"
    },
    vite: () => ({
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "."),
            },
        },
    }),
});
