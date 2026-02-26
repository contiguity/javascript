import type { EntitlementsResource } from "./entitlements.js";

export class AgreementsResource {
    constructor(private readonly entitlements: EntitlementsResource) { }

    accept(agreement_url: string) {
        const name = agreement_url.replace("https://api.contiguity.com/entitlements/", "");
        return this.entitlements.apply(name);
    }
}
