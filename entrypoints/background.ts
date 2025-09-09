import { browser } from "wxt/browser";
import ExtMessage, { MessageFrom, MessageType } from "@/entrypoints/types.ts";
import { backgroundRouter } from "@/lib/trpc/background-router";
import { createTRPCMessageHandler } from "@/lib/trpc/transport";
import { ensureOffscreenDocument } from "@/lib/utils/chrome-api";

chrome.runtime.onStartup.addListener( () => {
    console.log(`onStartup()`);
});

export default defineBackground(() => {
    console.log('Hello background!', { id: browser.runtime.id });// background.js

    // @ts-ignore
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error: any) => console.error(error));

    //monitor the event from extension icon click
    browser.action.onClicked.addListener((tab) => {
        // 发送消息给content-script.js
        console.log("click icon")
        console.log(tab)
        browser.tabs.sendMessage(tab.id!, { messageType: MessageType.clickExtIcon });
    });

    // background.js
    browser.runtime.onMessage.addListener(async (message: ExtMessage, sender, sendResponse: (message: any) => void) => {
        console.log("background:")
        console.log(message)
        if (message.messageType === MessageType.clickExtIcon) {
            console.log(message)
            return true;
        } else if (message.messageType === MessageType.changeTheme || message.messageType === MessageType.changeLocale) {
            let tabs = await browser.tabs.query({ active: true, currentWindow: true });
            console.log(`tabs:${tabs.length}`)
            if (tabs) {
                for (const tab of tabs) {
                    await browser.tabs.sendMessage(tab.id!, message);
                }
            }

        }
    });

    // Background service worker for the Squash extension
    /// <reference types="@types/dom-chromium-ai" />


    const ALARM_NAME = "hourly-analysis";

    // Note: Extension icon click now shows popup.html instead of opening side panel directly

    // Side panel is now opened via popup.html, not on action click

    // Listen for installation
    chrome.runtime.onInstalled.addListener(async () => {
        console.log("Squash extension installed");


    });

    // Handle alarm events
    chrome.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === ALARM_NAME) {
            console.log("[Analysis] Alarm triggered");
            try {

            } catch (error) {
                console.error("Failed to run analysis from alarm:", error);
            }
        }
    });

    // Check alarm status on startup
    chrome.runtime.onStartup.addListener(async () => {

    });

    // All message handling now done through tRPC

    // Handle errors
    self.addEventListener("error", (event) => {
        console.error("Background script error:", event.error);
    });

    // ============================================
    // tRPC Handler Setup
    // ============================================

    // Set up tRPC message handler for incoming requests from sidepanel and offscreen
    const messageHandler = createTRPCMessageHandler(
        backgroundRouter,
        (sender) => ({
            timestamp: Date.now(),
            sender,
        }),
        (message) => {
            // Only accept messages targeted to background
            const msg = message as { target?: string };
            return !msg.target || msg.target === "background";
        },
    );

    // Combined message handler for tRPC and SDK messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("[Background] Received message:", message.type);

        // First try SDK message handler
        if (
            message.type?.startsWith("SDK_") ||
            message.type === "PERMISSION_RESPONSE"
        ) {
            console.log("[Background] Routing to SDK handler");

        }

        // Otherwise use tRPC handler
        return messageHandler(message, sender, sendResponse);
    });

    console.log("[Background] Message handlers initialized (tRPC + SDK)");



    // Initialize offscreen document immediately on service worker start
    // This ensures it's available for all operations
    ensureOffscreenDocument().match(
        () => console.log("[Background] Offscreen document ready"),
        (error) =>
            console.error("[Background] Failed to create offscreen document:", error),
    );

});
