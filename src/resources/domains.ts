import { request } from "../utils/request.js";
import { domainsRegisterSchema, type DomainsRegisterOptions } from "../schemas/domains.js";
import type { RequestConfig } from "../utils/request.js";

export class DomainsResource {
  constructor(private readonly config: RequestConfig) {}

  async list() {
    return request(this.config, "/");
  }

  async get(domain: string) {
    return request(this.config, `/${encodeURIComponent(domain)}`, { method: "GET" });
  }

  async register(domain: string, options?: DomainsRegisterOptions) {
    const body = options ? domainsRegisterSchema.parse(options) : {};
    return request(this.config, `/${encodeURIComponent(domain)}`, {
      method: "POST",
      body: body as Record<string, unknown>,
    });
  }

  async delete(domain: string) {
    return request(this.config, `/${encodeURIComponent(domain)}`, { method: "DELETE" });
  }
}
