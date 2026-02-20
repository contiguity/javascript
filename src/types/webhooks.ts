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
