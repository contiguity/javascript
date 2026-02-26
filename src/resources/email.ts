import { request } from "../utils/request.js";
import { renderReactEmail } from "../utils/react-email.js";
import { emailSendSchema, type EmailSendParams } from "../schemas/email.js";
import type { RequestConfig } from "../utils/request.js";

async function normalizeEmailBody(params: EmailSendParams): Promise<{ html?: string; text?: string }> {
    let html = params.html ?? params.body?.html ?? null;
    let text = params.text ?? params.body?.text ?? null;
    const react = params.react ?? params.body?.react;
    if (react) {
        const rendered = await renderReactEmail(react);
        html = rendered.html;
        text = rendered.text;
    }
    return { html: html ?? undefined, text: text ?? undefined };
}

export class EmailResource {
    constructor(private readonly config: RequestConfig) { }

    async send(params: EmailSendParams) {
        const parsed = emailSendSchema.parse(params);
        const body = await normalizeEmailBody(parsed);
        const { body: _body, html: _html, text: _text, react: _react, ...rest } = parsed;
        return request<{ email_id: string }>(this.config, "/email", {
            method: "POST",
            body: { ...rest, body } as Record<string, unknown>,
        });
    }
}
