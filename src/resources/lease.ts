import { request } from "../utils/request.js";
import { leaseCreateSchema, type LeaseCreateOptions } from "../schemas/leases.js";
import type { RequestConfig } from "../utils/request.js";

export class LeaseResource {
  constructor(private readonly config: RequestConfig) {}

  async available() {
    return request(this.config, "/leases", { method: "GET" });
  }

  async get(number: string) {
    return request(this.config, `/${encodeURIComponent(number)}`, { method: "GET" });
  }

  async create(number: string, options?: LeaseCreateOptions) {
    const body = options ? (leaseCreateSchema.parse(options) as Record<string, unknown>) : {};
    return request(this.config, `/lease/${encodeURIComponent(number)}`, {
      method: "POST",
      body,
    });
  }

  async leased() {
    return request(this.config, "/leased", { method: "GET" });
  }

  async details(number: string) {
    return request(this.config, `/leased/${encodeURIComponent(number)}`, { method: "GET" });
  }

  async terminate(number: string) {
    return request(this.config, `/leased/${encodeURIComponent(number)}`, { method: "DELETE" });
  }
}
