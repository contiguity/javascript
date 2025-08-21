# Contiguity JavaScript SDK - API

## Install

```bash
bun add contiguity
```

## Initialize

```typescript
import { Contiguity } from "contiguity";
const contiguity = new Contiguity("contiguity_sk_...your_token...");
```

## Responses and Metadata

- All methods return an object that includes a `metadata` field with `{ id, timestamp, api_version, object }`.

---

## Text

### text.send(params)

- **params**: `{ to: string(E.164), message: string, from?: string }`

```typescript
const res = await contiguity.text.send({
  to: "+1234567890",
  message: "Hello from Contiguity!",
  // from: "+15555555555" // optional leased sender
});
// res.message_id; res.metadata
```

---

## Email

### email.send(params)

- **params**: `{ to: string | string[], from: string, subject: string, body: { text?: string, html?: string }, reply_to?: string, cc?: string | string[], bcc?: string | string[], headers?: { name: string, value: string }[] }`

```typescript
const res = await contiguity.email.send({
  to: ["user@example.com", "ops@example.com"],
  from: "Your App <no-reply@yourapp.com>",
  subject: "Welcome!",
  body: { html: "<h1>Hello</h1>", text: "Hello" },
  reply_to: "support@yourapp.com",
  cc: "manager@example.com",
  bcc: ["audit@example.com"],
  headers: [{ name: "X-Campaign", value: "welcome" }]
});
// res.email_id; res.metadata
```

---

## iMessage

### imessage.send(params)

- **params**: `{ to: string(E.164), message: string, from?: string, fallback?: { when: ("imessage_unsupported" | "imessage_fails")[], from?: string }, attachments?: string[] }`

```typescript
const res = await contiguity.imessage.send({
  to: "+1234567890",
  message: "Hello via iMessage!",
  // from: "+15555555555",
  fallback: { when: ["imessage_unsupported", "imessage_fails"], from: "+15555555555" },
  attachments: ["https://example.com/image.png"]
});
// res.message_id; res.metadata
```

### imessage.typing(params)

- **params**: `{ to: string(E.164), action: "start" | "stop", from?: string }`

```typescript
const res = await contiguity.imessage.typing({ to: "+1234567890", action: "start" });
// res.status; res.metadata
```

---

## WhatsApp

### whatsapp.send(params)

- **params**: `{ to: string(E.164), message: string, from?: string, fallback?: { when: ("whatsapp_unsupported" | "whatsapp_fails")[], from?: string }, attachments?: string[] }`

```typescript
const res = await contiguity.whatsapp.send({
  to: "+1234567890",
  message: "Hello via WhatsApp!",
  // from: "+15555555555",
  fallback: { when: ["whatsapp_unsupported", "whatsapp_fails"], from: "+15555555555" },
  attachments: ["https://example.com/image.png"]
});
// res.message_id; res.metadata
```

### whatsapp.typing(params)

- **params**: `{ to: string(E.164), action: "start" | "stop", from?: string }`

```typescript
const res = await contiguity.whatsapp.typing({ to: "+1234567890", action: "stop" });
// res.status; res.metadata
```

---

## OTP

### otp.new(params)

- **params**: `{ to: string(E.164), language: string, name: string }`

```typescript
const res = await contiguity.otp.new({ to: "+1234567890", language: "en", name: "MyApp" });
// res.otp_id; res.metadata
```

### otp.verify(params)

- **params**: `{ otp_id: string, otp: string }`

```typescript
const res = await contiguity.otp.verify({ otp_id: "otp_123", otp: "123456" });
// res.verified; res.metadata
```

### otp.resend(params)

- **params**: `{ otp_id: string }`

```typescript
const res = await contiguity.otp.resend({ otp_id: "otp_123" });
// res.resent; res.metadata
```

---

## Lease

### lease.available()

```typescript
const res = await contiguity.lease.available();
// res.available; res.numbers; res.metadata
```

### lease.get(params)

- **params**: `{ number: string(E.164) }`

```typescript
const res = await contiguity.lease.get({ number: "+1234567890" });
// res.number.formatted; res.capabilities; res.pricing; res.metadata
```

### lease.create(params)

- **params**: `{ number: string(E.164), billing_method?: "monthly" | "service_contract" }`

```typescript
const res = await contiguity.lease.create({ number: "+1234567890" });
// res.lease_id; res.status; res.billing; res.metadata
```

### lease.leased()

```typescript
const res = await contiguity.lease.leased();
// res.leased; res.numbers; res.metadata
```

### lease.details(params)

- **params**: `{ number: string(E.164) }`

```typescript
const res = await contiguity.lease.details({ number: "+1234567890" });
// res.lease_id; res.lease_status; res.billing; res.metadata
```

### lease.terminate(params)

- **params**: `{ number: string(E.164) }`

```typescript
const res = await contiguity.lease.terminate({ number: "+1234567890" });
// res.lease_id; res.status; res.terminated_at; res.metadata
```

---

## Domains

### domains.list()

```typescript
const res = await contiguity.domains.list();
// res.domains; res.metadata
```

### domains.get(params)

- **params**: `{ domain: string }`

```typescript
const res = await contiguity.domains.get({ domain: "example.com" });
// res.status; res.records; res.verifications; res.metadata
```

### domains.register(params)

- **params**: `{ domain: string, region?: string, custom_return_path?: string }`

```typescript
const res = await contiguity.domains.register({ domain: "example.com", region: "us-east-1", custom_return_path: "mail" });
// res.status; res.records; res.metadata
```

### domains.delete(params)

- **params**: `{ domain: string }`

```typescript
const res = await contiguity.domains.delete({ domain: "example.com" });
// res.success; res.message; res.metadata
```
