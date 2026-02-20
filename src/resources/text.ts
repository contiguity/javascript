import { z } from "zod";
import { request } from "../utils/request.js";
import {
  textSendSchema,
  textReactSchema,
  type TextSendParams,
  type TextReactParams,
} from "../schemas/text.js";
import {
  conversationHistorySchema,
  type ConversationHistoryParams,
} from "../schemas/conversations.js";
import type { RequestConfig } from "../utils/request.js";

export class TextResource {
  constructor(private readonly config: RequestConfig) {}

  async send(params: TextSendParams) {
    const parsed = textSendSchema.parse(params);
    return request<{ message_id: string }>(this.config, "/text", {
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
      `/history/text/${encodeURIComponent(parsed.to)}/${encodeURIComponent(parsed.from)}/${limit}`,
      { method: "GET" }
    );
  }

  async react(action: "add" | "remove", params: TextReactParams) {
    const _action = z.enum(["add", "remove"]).parse(action);
    const parsed = textReactSchema.parse(params);
    return request<{ message_id: string }>(this.config, "/text/reactions", {
      method: "POST",
      body: { ...parsed, action: _action } as Record<string, unknown>,
    });
  }
}
