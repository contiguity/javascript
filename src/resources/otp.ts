import { request } from "../utils/request.js";
import type { RequestConfig } from "../utils/request.js";
import {
  otpSendSchema,
  otpVerifySchema,
  otpResendSchema,
  otpReverseInitiateSchema,
  type OtpSendParams,
  type OtpVerifyParams,
  type OtpResendParams,
  type OtpReverseInitiateParams,
  type OtpReverseInitiateResponse,
  type OtpReverseVerifyResponse,
  type OtpReverseCancelResponse,
} from "../schemas/otp.js";

export class OtpResource {
  constructor(private readonly config: RequestConfig) {}

  async send(params: OtpSendParams) {
    const parsed = otpSendSchema.parse(params);
    return request<{ otp_id: string }>(this.config, "/new", {
      method: "POST",
      body: parsed as Record<string, unknown>,
    });
  }

  /** @deprecated Use send() instead. */
  async new(params: OtpSendParams) {
    return this.send(params);
  }

  async verify(params: OtpVerifyParams) {
    const parsed = otpVerifySchema.parse(params);
    return request<{ verified: boolean }>(this.config, "/verify", {
      method: "POST",
      body: parsed as Record<string, unknown>,
    });
  }

  async resend(params: OtpResendParams) {
    const parsed = otpResendSchema.parse(params);
    return request<{ resent: boolean }>(this.config, "/resend", {
      method: "POST",
      body: parsed as Record<string, unknown>,
    });
  }

  readonly reverse = {
    initiate: (params: OtpReverseInitiateParams) => {
      const parsed = otpReverseInitiateSchema.parse(params);
      return request<OtpReverseInitiateResponse>(this.config, "/reverse/initiate", {
        method: "POST",
        body: parsed as Record<string, unknown>,
      });
    },
    verify: (otp_id: string) => {
      return request<OtpReverseVerifyResponse>(
        this.config,
        `/reverse/verify/${encodeURIComponent(otp_id)}`,
        { method: "GET" }
      );
    },
    cancel: (otp_id: string) => {
      return request<OtpReverseCancelResponse>(
        this.config,
        `/reverse/cancel/${encodeURIComponent(otp_id)}`,
        { method: "POST" }
      );
    },
  };
}
