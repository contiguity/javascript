<p align='center'><img src="https://contiguity.co/assets/icon-black.png" height="150px"/></p>
<h1 align='center'>Contiguity JavaScript SDK</h1>

<p align='center'>
    <img display="inline-block" src="https://img.shields.io/npm/v/contiguity?style=for-the-badge" />
    <img display="inline-block" src="https://img.shields.io/badge/Made%20with-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

<p align='center'>The official TypeScript/JavaScript SDK for Contiguity's APIs.</p>

## Installation

```bash
# Using npm
npm install contiguity

# Using pnpm  
pnpm add contiguity

# Using bun
bun add contiguity
```

## Getting Started

```typescript
import { Contiguity } from 'contiguity';

const contiguity = new Contiguity('contiguity_sk_...your_token...');
```

Get your API token from the [Contiguity Console](https://console.contiguity.com/).

### Send a text message

```typescript
const response = await contiguity.text.send({
    to: "+1234567890",
    message: "Hello from Contiguity!"
});
```

### Send an email  

```typescript
const response = await contiguity.email.send({
    to: "user@example.com", 
    from: "Your App <no-reply@yourapp.com>",
    subject: "Welcome!",
    body: { text: "Welcome to our platform!" }
});
```

### Send and verify OTP

```typescript
const otpResponse = await contiguity.otp.send({
    to: "+1234567890",
    language: "en",
    name: "MyApp"
});

const verification = await contiguity.otp.verify({
    otp_id: otpResponse.otp_id,
    otp: "123456"
});
```

## Documentation

For complete documentation, examples, and API reference, visit [docs.contiguity.com](https://docs.contiguity.com/sdk/js/overview).

## Resources

- [API Reference](https://docs.contiguity.com/api-reference/) - Complete API documentation
- [Console](https://console.contiguity.com/) - Manage your account and API keys  
- [Discord Community](https://discord.gg/Z9K5XAsS7H) - Get support and connect with other developers
- [GitHub Repository](https://github.com/contiguity/javascript) - Source code and issue tracking