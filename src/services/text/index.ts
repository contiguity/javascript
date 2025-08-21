import { ContiguityClient } from "@/client/fetch.ts";
import { _textSend } from "@/services/text/send.ts";
import { z } from "zod";
import { TextSendRequest, TextResponse } from "@/services/text/send.ts";
import type { WithMetadata } from "@/types/metadata.ts";

export type TextSendParams = z.infer<typeof TextSendRequest>;
export type TextSendResponse = z.infer<typeof TextResponse>;

/**
 * Text service for sending messages
 */
export class TextService extends ContiguityClient {
    constructor(token: string) {
        super(token);
    }

    /**
     * Send a text message
     */
    async send(params: TextSendParams): Promise<WithMetadata<TextSendResponse>> {
        return _textSend.call(this, params);
    }
}
