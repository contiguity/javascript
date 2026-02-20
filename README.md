# Contiguity JavaScript/TypeScript SDK

Official SDK for [Contiguity](https://contiguity.com). Send SMS, email, OTPs, iMessage, WhatsApp, manage domains and number leases, and verify webhooks.

## Install

Works with Node 18+, Bun, and bundlers. ESM only.

```bash
bun add contiguity
# or
pnpm add contiguity
# or
npm install contiguity
# or
yarn add contiguity
```

## Init

```ts
import { Contiguity } from "contiguity";

const contiguity = new Contiguity("contiguity_sk_...your_token...");

// Or omit the token and use env: CONTIGUITY_API_KEY or CONTIGUITY_TOKEN
const contiguity = new Contiguity();

// With options
const contiguity = new Contiguity("contiguity_sk_...", {
  debug: false,  // set true for request logging
});
```

## Quick start

### Text (SMS)

```ts
const res = await contiguity.text.send({
  to: "+1234567890",
  message: "Hello from Contiguity!",
  // from: "+15555555555",  // optional, if you lease a number
});
// res.message_id, res.metadata

await contiguity.text.get("text_abc123");
await contiguity.text.history({ to: "+1…", from: "+1…", limit: 20 });
await contiguity.text.react("add", { message_id: "text_abc", reaction: "love" });
```

### Email

```ts
const res = await contiguity.email.send({
  to: "user@example.com",
  from: "Your App <no-reply@yourapp.com>",
  subject: "Welcome!",
  body: { text: "Welcome to our platform!" },
});
// res.email_id, res.metadata
```

### OTP

```ts
const res = await contiguity.otp.new({
  to: "+1234567890",
  language: "en",
  name: "MyApp",
});
// res.otp_id

const verified = await contiguity.otp.verify({ otp_id: res.otp_id, otp: "123456" });
// verified.verified === true | false

await contiguity.otp.resend({ otp_id: res.otp_id });
```

### Domains

```ts
const list = await contiguity.domains.list();
const one = await contiguity.domains.get("example.com");
await contiguity.domains.register("example.com", { region: "us-east-1", custom_return_path: "mail" });
await contiguity.domains.delete("example.com");
```

### Lease (numbers)

```ts
const available = await contiguity.lease.available();
const details = await contiguity.lease.get("+1234567890");
await contiguity.lease.create("+1234567890", { billing_method: "monthly" });
const leased = await contiguity.lease.leased();
const leaseDetails = await contiguity.lease.details("+1234567890");
await contiguity.lease.terminate("+1234567890");
```

### iMessage / WhatsApp

```ts
await contiguity.imessage.send({ to: "+1234567890", message: "Hello via iMessage!" });
await contiguity.imessage.typing({ to: "+1234567890", action: "start" });
await contiguity.imessage.get("imessage_abc123");
await contiguity.imessage.history({ to: "+1…", from: "+1…", limit: 20 });
await contiguity.imessage.react("add", { to: "+1…", from: "+1…", tapback: "love", message: "Hello!" });
await contiguity.imessage.read({ to: "+1234567890", from: "+15555555555" });

await contiguity.whatsapp.send({ to: "+1234567890", message: "Hello via WhatsApp!" });
await contiguity.whatsapp.typing({ to: "+1234567890", action: "stop" });
await contiguity.whatsapp.react("add", { to: "+1234567890", reaction: "👍", message: "wa_123" });
```

### Webhooks

Verify signature (use raw body and `Contiguity-Signature` header):

```ts
// With request-like object (e.g. Express req with raw body)
const ok = contiguity.webhook.verify(req, process.env.WEBHOOK_SECRET, 300);

// Or with raw values
const ok = contiguity.webhook.verify(rawBody, signatureHeader, secret, 300);
```

Parse webhook body (v2 format):

```ts
const event = contiguity.webhook.parse(rawBody);
// event.id, event.type, event.timestamp, event.data
```

### Pass-through options

Request params accept extra JSON; unknown fields are sent to the API as-is. Types are defined for known fields; you can add more for new API options.

## Response format

All responses return a clean shape: method-specific fields at the top level plus `metadata`:

```ts
{
  message_id?: string;
  email_id?: string;
  otp_id?: string;
  // ... etc
  metadata: { id: string; timestamp: string; api_version: string; object: string; }
}
```

## Errors

On API errors the SDK throws `ContiguityError` with `message`, `status`, and optional `code`.

```ts
import { ContiguityError } from "contiguity";
try {
  await contiguity.text.send({ ... });
} catch (e) {
  if (e instanceof ContiguityError) {
    console.error(e.status, e.message);
  }
}
```

## Docs

- [SDK overview](https://docs.contiguity.com/sdk/js/overview)
- [API reference](https://docs.contiguity.com/llms.txt)

## Development

Use Bun for local dev and publishing:

- `bun install` / `bun run build` — install and compile
- `bun run test` — build and run Vitest (Vitest loads `.env` from project root; unit tests always run; live API tests when `CONTIGUITY_TEST_API_KEY` is set; send tests need `CONTIGUITY_TEST_TO`, optional `CONTIGUITY_TEST_FROM`, `CONTIGUITY_TEST_EMAIL`, optional `CONTIGUITY_TEST_EMAIL_FROM_NAME`)
- `bun run pack` — create the tarball (e.g. `contiguity-1.0.0.tgz`) without publishing
- `bun run publish:dry` — build and simulate publish (no upload)
- `bun publish` — build (via prepublishOnly) and publish to the registry

The published package is runtime-agnostic ESM and works for everyone.

## License

MIT
