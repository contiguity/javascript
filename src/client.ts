import { TextResource } from "./resources/text.js";
import { EmailResource } from "./resources/email.js";
import { OtpResource } from "./resources/otp.js";
import { DomainsResource } from "./resources/domains.js";
import { LeaseResource } from "./resources/lease.js";
import { EntitlementsResource } from "./resources/entitlements.js";
import { AgreementsResource } from "./resources/agreements.js";
import { ImessageResource } from "./resources/imessage.js";
import { WhatsappResource } from "./resources/whatsapp.js";
// import { VoiceResource } from "./resources/voice.js";
import { WebhookResource } from "./resources/webhook.js";
import type { RequestConfig } from "./utils/request.js";

export interface ContiguityConfig {
    debug?: boolean;
}

export class Contiguity {
    readonly text: TextResource;
    readonly email: EmailResource;
    readonly otp: OtpResource;
    readonly domains: DomainsResource;
    readonly lease: LeaseResource;
    readonly entitlements: EntitlementsResource;
    readonly agreements: AgreementsResource;
    readonly imessage: ImessageResource;
    readonly whatsapp: WhatsappResource;
    // readonly voice: VoiceResource;
    readonly webhook: WebhookResource;

    constructor(token?: string, config: ContiguityConfig = {}) {
        const env = typeof process !== "undefined" ? process.env : undefined;
        const resolved = token ?? env?.CONTIGUITY_API_KEY ?? env?.CONTIGUITY_TOKEN;
        if (!resolved) {
            throw new Error(
                "Contiguity token required. Pass it to the constructor or set an environment variable (CONTIGUITY_API_KEY or CONTIGUITY_TOKEN)"
            );
        }
        if (!resolved.includes("contiguity_sk_")) {
            throw new Error("Invalid Contiguity token: key must start with contiguity_sk_.");
        }
        const request_config: RequestConfig = {
            token: resolved,
            base: "send",
            debug: config.debug ?? false,
        };
        this.text = new TextResource(request_config);
        this.email = new EmailResource(request_config);
        this.otp = new OtpResource({ ...request_config, base: "otp" });
        this.domains = new DomainsResource({ ...request_config, base: "domains" });
        this.lease = new LeaseResource({ ...request_config, base: "numbers" });
        this.entitlements = new EntitlementsResource({ ...request_config, base: "entitlements" });
        this.agreements = new AgreementsResource(this.entitlements);
        this.imessage = new ImessageResource(request_config);
        this.whatsapp = new WhatsappResource(request_config);
        // this.voice = new VoiceResource({ ...request_config, base: "voice" });
        this.webhook = new WebhookResource();
    }
}
