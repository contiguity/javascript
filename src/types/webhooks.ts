/** Webhook event types (v2 format) */
export type WebhookEventType =
    | "text.incoming.sms"
    | "text.incoming.mms"
    | "text.delivery.confirmed"
    | "text.delivery.failed"
    | "imessage.incoming"
    | "numbers.substitution"
    | "otp.reverse.verified"
    | "email.incoming"
    | "identity.verification_session.started"
    | "identity.verification_session.processing"
    | "identity.verification_session.verified"
    | "identity.verification_session.failed"
    | "identity.verification_session.requires_input"
    | "identity.verification_session.manually_approved"
    | "identity.verification_session.manually_denied"
    | "identity.verification_report.generated";

export interface WebhookEventBase {
    id: string;
    type: WebhookEventType;
    timestamp: number;
    api_version: string;
    data: Record<string, unknown>;
}

/** text.incoming.sms / text.incoming.mms */
export interface TextIncomingData {
    from: string;
    to: string;
    body: string;
    timestamp: number;
    attachments?: Array<{ url: string; mime: string; filename: string }>;
}

/** imessage.incoming */
export interface ImessageIncomingData {
    from: string;
    to: string;
    body: string;
    timestamp: number;
    attachments?: Array<{ url?: string; mime?: string; filename?: string }>;
}

/** text.delivery.confirmed / text.delivery.failed */
export interface TextDeliveryData {
    from: string;
    to: string;
    message_id: string;
    timestamp: number;
    error?: string;
}

/** Minimal data for reply() - has to/from. Used by text, imessage, whatsapp. */
export interface IncomingMessageData {
    to: string;
    from: string;
    [key: string]: unknown;
}
