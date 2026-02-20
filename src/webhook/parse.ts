import type { WebhookEventBase, WebhookEventType } from "../types/webhooks.js";

/**
 * Parse raw webhook body (v2 format) into a typed event.
 */
export function parseWebhookPayload(raw_body: string | Buffer): WebhookEventBase {
    const str = typeof raw_body === "string" ? raw_body : raw_body.toString("utf-8");
    const event = JSON.parse(str) as WebhookEventBase;
    if (typeof event.id !== "string" || typeof event.type !== "string" || typeof event.timestamp !== "number") {
        throw new Error("Invalid webhook payload: missing id, type, or timestamp");
    }
    return event as WebhookEventBase;
}
