import { ContiguityClient } from "@/client/fetch.ts";
import { _iMessageSend } from "@/services/imessage/send.ts";
import { _iMessageTyping } from "@/services/imessage/typing.ts";
import { z } from "zod";
import { 
    iMessageSendRequest, 
    iMessageResponse
} from "@/services/imessage/send.ts";
import { iMessageTypingRequest, iMessageTypingResponse } from "@/services/imessage/typing.ts";
import type { WithMetadata } from "@/types/metadata.ts";

export type iMessageSendParams = z.infer<typeof iMessageSendRequest>;
export type iMessageSendResponse = z.infer<typeof iMessageResponse>;
export type iMessageTypingParams = z.infer<typeof iMessageTypingRequest>;
export type iMessageTypingResponseType = z.infer<typeof iMessageTypingResponse>;

/**
 * iMessage service for sending iMessages and managing typing indicators
 */
export class iMessageService extends ContiguityClient {
    constructor(token: string) {
        super(token);
    }

    /**
     * Send an iMessage
     */
    async send(params: iMessageSendParams): Promise<WithMetadata<iMessageSendResponse>> {
        return _iMessageSend.call(this, params);
    }

    /**
     * Start or stop sending typing indicators over iMessage
     */
    async typing(params: iMessageTypingParams): Promise<WithMetadata<iMessageTypingResponseType>> {
        return _iMessageTyping.call(this, params);
    }
}
