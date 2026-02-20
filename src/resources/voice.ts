import { request } from "../utils/request.js";
import type { RequestConfig } from "../utils/request.js";

export class VoiceResource {
  constructor(private readonly config: RequestConfig) {}

  async play(call_id: string, params: { audio_url: string; [k: string]: unknown }) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/play`, {
      method: "POST",
      body: params,
    });
  }

  async stream(call_id: string, params: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/stream`, {
      method: "POST",
      body: params,
    });
  }

  async speak(call_id: string, params: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/speak`, {
      method: "POST",
      body: params,
    });
  }

  async gather(call_id: string, params: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/gather`, {
      method: "POST",
      body: params,
    });
  }

  async answer(call_id: string, params?: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/answer`, {
      method: "POST",
      body: params ?? {},
    });
  }

  async reject(call_id: string, params?: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/reject`, {
      method: "POST",
      body: params ?? {},
    });
  }

  async dial(params: Record<string, unknown>) {
    return request(this.config, "/calls/dial", {
      method: "POST",
      body: params,
    });
  }

  async status(call_id: string) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/status`, { method: "GET" });
  }

  async get(call_id: string) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}`, { method: "GET" });
  }

  async hangup(call_id: string, params?: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/hangup`, {
      method: "POST",
      body: params ?? {},
    });
  }

  async transfer(call_id: string, params: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/transfer`, {
      method: "POST",
      body: params,
    });
  }

  async sendDTMF(call_id: string, params: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/send_dtmf`, {
      method: "POST",
      body: params,
    });
  }

  async gatherStop(call_id: string, params?: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/gather/stop`, {
      method: "POST",
      body: params ?? {},
    });
  }

  async transcription(call_id: string, action: string, params?: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/transcription/${encodeURIComponent(action)}`, {
      method: "POST",
      body: params ?? {},
    });
  }

  async recording(call_id: string, action: string, params?: Record<string, unknown>) {
    return request(this.config, `/calls/${encodeURIComponent(call_id)}/recording/${encodeURIComponent(action)}`, {
      method: "POST",
      body: params ?? {},
    });
  }
}
