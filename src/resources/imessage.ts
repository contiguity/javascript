import { z } from "zod";
import { request } from "../utils/request.js";
import {
    imessageSendSchema,
    imessageTypingSchema,
    imessageReactSchema,
    imessageReadSchema,
    type ImessageSendParams,
    type ImessageTypingParams,
    type ImessageReactParams,
    type ImessageReadParams,
} from "../schemas/imessage.js";
import {
    conversationHistorySchema,
    type ConversationHistoryParams,
} from "../schemas/conversations.js";
import type { RequestConfig } from "../utils/request.js";
import type { WebhookEventBase } from "../types/webhooks.js";

export class ImessageResource {
    constructor(private readonly config: RequestConfig) { }

    /** Reply to an incoming imessage webhook. Prefills to/from from event.data. */
    async reply(event: WebhookEventBase, params: Omit<ImessageSendParams, "to" | "from">) {
        const data = event.data as { to?: string; from?: string };
        if (typeof data.to !== "string" || typeof data.from !== "string") {
            throw new Error("Webhook event data must have to and from for reply");
        }
        return this.send({ ...params, to: data.from, from: data.to } as ImessageSendParams);
    }

    async send(params: ImessageSendParams) {
        const parsed = imessageSendSchema.parse(params);
        return request<{ message_id: string }>(this.config, "/imessage", {
            method: "POST",
            body: parsed as Record<string, unknown>,
        });
    }

    async typing(params: ImessageTypingParams) {
        const parsed = imessageTypingSchema.parse(params);
        return request(this.config, "/imessage/typing", {
            method: "POST",
            body: parsed as Record<string, unknown>,
        });
    }

    async get(id: string) {
        return request(
            { ...this.config, base: "conversations" as const },
            `/history/message/${encodeURIComponent(id)}`,
            { method: "GET" }
        );
    }

    async history(params: ConversationHistoryParams) {
        const parsed = conversationHistorySchema.parse(params);
        const limit = parsed.limit ?? 20;
        return request(
            { ...this.config, base: "conversations" as const },
            `/history/imessage/${encodeURIComponent(parsed.to)}/${encodeURIComponent(parsed.from)}/${limit}`,
            { method: "GET" }
        );
    }

    async react(action: "add" | "remove", params: ImessageReactParams) {
        const _action = z.enum(["add", "remove"]).parse(action);
        const parsed = imessageReactSchema.parse(params);
        return request(this.config, "/imessage/reactions", {
            method: "POST",
            body: { ...parsed, action: _action } as Record<string, unknown>,
        });
    }

    async read(params: ImessageReadParams) {
        const parsed = imessageReadSchema.parse(params);
        return request(this.config, "/imessage/read", {
            method: "POST",
            body: parsed as Record<string, unknown>,
        });
    }
}
