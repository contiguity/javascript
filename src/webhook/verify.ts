import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verify webhook signature (HMAC-SHA256, format t=timestamp,v1=hex).
 * Use raw body as received — do not re-serialize JSON.
 */
export function verifyWebhookSignature(
    raw_body: string | Buffer,
    signature_header: string | null | undefined,
    secret: string | null | undefined,
    tolerance_seconds?: number
): boolean {
    if (!secret || !signature_header || raw_body == null) return false;
    const match = signature_header.match(/t=(\d+),v1=([a-f0-9]+)/);
    if (!match) return false;
    const [, t, v1] = match;
    if (!t || !v1) return false;
    const body_str = typeof raw_body === "string" ? raw_body : raw_body.toString("utf-8");
    const signed_payload = `${t}.${body_str}`;
    const expected = createHmac("sha256", secret).update(signed_payload).digest("hex");
    if (v1.length !== expected.length) return false;
    try {
        if (!timingSafeEqual(Buffer.from(v1, "hex"), Buffer.from(expected, "hex"))) return false;
    } catch {
        return false;
    }
    if (tolerance_seconds != null) {
        const ts = parseInt(t, 10);
        if (Number.isNaN(ts)) return false;
        const now = Math.floor(Date.now() / 1000);
        if (Math.abs(now - ts) > tolerance_seconds) return false;
    }
    return true;
}
