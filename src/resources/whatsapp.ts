import { z } from "zod";
import { request } from "../utils/request.js";
import {
  whatsappSendSchema,
  whatsappTypingSchema,
  whatsappReactSchema,
  type WhatsappSendParams,
  type WhatsappTypingParams,
  type WhatsappReactParams,
} from "../schemas/whatsapp.js";
import type { RequestConfig } from "../utils/request.js";
import type { WebhookEventBase } from "../types/webhooks.js";

export class WhatsappResource {
  constructor(private readonly config: RequestConfig) {}

  /** Reply to an incoming whatsapp webhook. Prefills to/from from event.data. */
  async reply(event: WebhookEventBase, params: Omit<WhatsappSendParams, "to" | "from">) {
    const data = event.data as { to?: string; from?: string };
    if (typeof data.to !== "string" || typeof data.from !== "string") {
      throw new Error("Webhook event data must have to and from for reply");
    }
    return this.send({ ...params, to: data.from, from: data.to } as WhatsappSendParams);
  }

  async send(params: WhatsappSendParams) {
    const parsed = whatsappSendSchema.parse(params);
    return request<{ message_id: string }>(this.config, "/whatsapp", {
      method: "POST",
      body: parsed as Record<string, unknown>,
    });
  }

  async typing(params: WhatsappTypingParams) {
    const parsed = whatsappTypingSchema.parse(params);
    return request(this.config, "/whatsapp/typing", {
      method: "POST",
      body: parsed as Record<string, unknown>,
    });
  }

  async react(action: "add" | "remove", params: WhatsappReactParams) {
    const _action = z.enum(["add", "remove"]).parse(action);
    const parsed = whatsappReactSchema.parse(params);
    return request(this.config, "/whatsapp/reactions", {
      method: "POST",
      body: { ...parsed, action: _action } as Record<string, unknown>,
    });
  }
}
