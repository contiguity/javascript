import { request } from "../utils/request.js";
import type { RequestConfig } from "../utils/request.js";

export class EntitlementsResource {
    constructor(private readonly config: RequestConfig) { }

    list() {
        return request(this.config, "/");
    }

    get(name: string) {
        return request(this.config, `/${encodeURIComponent(name)}`, { method: "GET" });
    }

    apply(name: string) {
        return request(this.config, `/${encodeURIComponent(name)}`, { method: "POST" });
    }

    revoke(name: string) {
        return request(this.config, `/${encodeURIComponent(name)}`, { method: "DELETE" });
    }
}
