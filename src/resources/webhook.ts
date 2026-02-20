import { verifyWebhookSignature } from "../webhook/verify.js";
import { parseWebhookPayload } from "../webhook/parse.js";
import type { WebhookEventBase } from "../types/webhooks.js";

/** Request-like object with raw body and Contiguity-Signature header */
export interface WebhookRequestLike {
    body?: string | Buffer;
    rawBody?: string | Buffer;
    headers?: Record<string, string | undefined> | { get(name: string): string | null };
}

function getHeader(req: WebhookRequestLike, name: string): string | null | undefined {
    const h = req.headers;
    if (!h) return undefined;
    if (typeof (h as { get(name: string): string | null }).get === "function") {
        return (h as { get(name: string): string | null }).get(name) ?? (h as Record<string, string>)[name];
    }
    const key = Object.keys(h).find((k) => k.toLowerCase() === name.toLowerCase());
    return key ? (h as Record<string, string>)[key] : (h as Record<string, string>)["contiguity-signature"];
}

function getRawBody(req: WebhookRequestLike): string | Buffer | undefined {
    return req.rawBody ?? req.body;
}

export class WebhookResource {
    /**
     * Verify webhook signature.
     * Call as verify(req, secret, toleranceSeconds?) or verify(rawBody, signatureHeader, secret, toleranceSeconds?).
     */
    verify(
        rawBodyOrReq: string | Buffer | WebhookRequestLike,
        signatureHeaderOrSecret?: string,
        secretOrTolerance?: string | number,
        toleranceSeconds?: number
    ): boolean {
        if (
            typeof rawBodyOrReq === "string" ||
            (typeof rawBodyOrReq === "object" && rawBodyOrReq != null && Buffer.isBuffer(rawBodyOrReq))
        ) {
            const secretStr = typeof secretOrTolerance === "string" ? secretOrTolerance : null;
            const tol = typeof secretOrTolerance === "number" ? secretOrTolerance : toleranceSeconds;
            return verifyWebhookSignature(
                rawBodyOrReq as string | Buffer,
                signatureHeaderOrSecret ?? null,
                secretStr,
                tol
            );
        }
        const req = rawBodyOrReq as WebhookRequestLike;
        const raw = getRawBody(req);
        const sig = getHeader(req, "contiguity-signature");
        if (raw == null) return false;
        const secretVal = signatureHeaderOrSecret ?? null;
        const toleranceVal = typeof secretOrTolerance === "number" ? secretOrTolerance : toleranceSeconds;
        return verifyWebhookSignature(raw, sig ?? null, secretVal, toleranceVal);
    }

    /**
     * Parse raw webhook body to a typed event (v2 format).
     */
    parse(rawBody: string | Buffer): WebhookEventBase {
        return parseWebhookPayload(rawBody);
    }
}
