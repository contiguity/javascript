import { request } from "../utils/request.js";
import { emailSendSchema, type EmailSendParams } from "../schemas/email.js";
import type { RequestConfig } from "../utils/request.js";

export class EmailResource {
  constructor(private readonly config: RequestConfig) {}

  async send(params: EmailSendParams) {
    const parsed = emailSendSchema.parse(params);
    return request<{ email_id: string }>(this.config, "/email", {
      method: "POST",
      body: parsed as Record<string, unknown>,
    });
  }
}
