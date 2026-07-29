import { request } from "../utils/request.js";
import { renderReactEmail } from "../utils/react-email.js";
import { emailSendSchema, type EmailSendParams } from "../schemas/email.js";
import type { RequestConfig } from "../utils/request.js";

async function emailContent(params: EmailSendParams): Promise<{ html?: string; text?: string }> {
    const react = params.react ?? params.body?.react;
    if (react) {
        return renderReactEmail(react);
    }

    return {
        html: params.html ?? params.body?.html ?? undefined,
        text: params.text ?? params.body?.text ?? undefined,
    };
}

export class EmailResource {
    constructor(private readonly config: RequestConfig) { }

    async send(params: EmailSendParams) {
        const parsed = emailSendSchema.parse(params);
        const content = await emailContent(parsed);
        const { body: _body, html: _html, text: _text, react: _react, ...rest } = parsed;
        return request<{ email_id: string }>(this.config, "/email", {
            method: "POST",
            body: { ...rest, ...content } as Record<string, unknown>,
        });
    }
}
