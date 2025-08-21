import { ContiguityClient } from "@/client/fetch.ts";
import { _textSend } from "@/services/text/send.ts";
import { z } from "zod";
import { TextSendRequest, TextResponse } from "@/services/text/send.ts";

export type TextSendParams = z.infer<typeof TextSendRequest>;
export type TextSendResponse = z.infer<typeof TextResponse>;

/**
 * Text service for sending SMS messages
 */
export class TextService extends ContiguityClient {
    constructor(token: string) {
        super(token);
    }

    /**
     * Send a text message
     */
    async send(params: TextSendParams): Promise<TextSendResponse & { metadata: { id: string; timestamp: number; api_version: string; object: string; } }> {
        return _textSend.call(this, params);
    }
}
