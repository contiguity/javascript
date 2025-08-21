<p align='center'><img src="https://contiguity.co/assets/icon-black.png" height="150px"/></p>
<h1 align='center'>contiguity</h1>

<p align='center'>
    <img display="inline-block" src="https://img.shields.io/npm/v/contiguity?style=for-the-badge" />
    <img display="inline-block" src="https://img.shields.io/badge/Made%20with-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>
<p align='center'>Contiguity's official TypeScript SDK.</p>

## 🚀 Quick Start

### Installation

```bash
# Using Bun (recommended)
bun add contiguity

# Using npm
npm install contiguity

# Using pnpm
pnpm add contiguity
```

### Initialize

```typescript
import { Contiguity } from 'contiguity';

const client = new Contiguity('your-api-token');
```

Get your API token from the [Contiguity Console](https://console.contiguity.com/).

## 📚 Documentation

For complete documentation, examples, and API reference:

**👉 [Visit our full documentation](https://docs.contiguity.com/sdk/js)**

## 🔗 Links

- **[Full Documentation](https://docs.contiguity.com/sdk/js)** - Complete guides and examples
- **[API Reference](https://docs.contiguity.com/api-reference/)** - Detailed API documentation
- **[Dashboard](https://console.contiguity.com/)** - Manage your account
- **[Discord](https://discord.gg/Z9K5XAsS7H)** - Join our community!
- **[GitHub](https://github.com/contiguity/javascript)** - Source code and issues

## ⚡ Quick Examples

```typescript
// Send a text message
const textResponse = await client.text.send({
    to: "+1234567890",
    message: "Hello from Contiguity!"
});
```

```typescript
// Send an email
const emailResponse = await client.email.send({
    to: "user@example.com",
    from: "Your App",
    subject: "Welcome!",
    html: "<h1>Hello from Contiguity!</h1>"
});
```

```typescript
// Send and verify OTP
const otpResponse = await client.otp.new({
    to: "+1234567890",
    language: "en",
    name: "MyApp"
});

const verification = await client.otp.verify({
    otp_id: otpResponse.otp_id,
    otp: "123456"
});
```

For more examples and detailed usage, check out our [complete documentation](https://docs.contiguity.com/sdk/js).

---

<p align='center'>Made with ❤️ by Contiguity</p>