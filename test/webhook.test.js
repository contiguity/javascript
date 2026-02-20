import { describe, test, expect } from "vitest"
import { createHmac } from "node:crypto"
import { verifyWebhookSignature } from "../dist/webhook/verify.js"
import { parseWebhookPayload } from "../dist/webhook/parse.js"

const secret = "whsec_test_secret"

function sign(payload, timestamp) {
	const signed = `${timestamp}.${payload}`
	const sig = createHmac("sha256", secret).update(signed).digest("hex")
	return `t=${timestamp},v1=${sig}`
}

describe("verifyWebhookSignature", () => {
	test("returns true for valid signature", () => {
		const body = '{"id":"evt_1","type":"text.sent","timestamp":1234567890}'
		const t = Math.floor(Date.now() / 1000)
		const header = sign(body, t)
		expect(verifyWebhookSignature(body, header, secret, 300)).toBe(true)
	})

	test("returns false when secret is wrong", () => {
		const body = '{"id":"evt_1","type":"text.sent","timestamp":1234567890}'
		const t = Math.floor(Date.now() / 1000)
		const header = sign(body, t)
		expect(verifyWebhookSignature(body, header, "wrong_secret", 300)).toBe(false)
	})

	test("returns false when body is tampered", () => {
		const body = '{"id":"evt_1"}'
		const t = Math.floor(Date.now() / 1000)
		const header = sign(body, t)
		expect(verifyWebhookSignature('{"id":"evt_2"}', header, secret, 300)).toBe(false)
	})

	test("returns false when signature header is missing", () => {
		expect(verifyWebhookSignature("{}", null, secret)).toBe(false)
		expect(verifyWebhookSignature("{}", undefined, secret)).toBe(false)
	})

	test("returns false when secret is empty", () => {
		expect(verifyWebhookSignature("{}", "t=1,v1=ab", "")).toBe(false)
	})

	test("returns false when timestamp is outside tolerance", () => {
		const body = "{}"
		const old = Math.floor(Date.now() / 1000) - 400
		const header = sign(body, old)
		expect(verifyWebhookSignature(body, header, secret, 300)).toBe(false)
	})
})

describe("parseWebhookPayload", () => {
	test("parses valid v2 payload", () => {
		const raw = JSON.stringify({
			id: "evt_123",
			type: "text.sent",
			timestamp: 1234567890,
			data: { message_id: "msg_1" },
		})
		const event = parseWebhookPayload(raw)
		expect(event.id).toBe("evt_123")
		expect(event.type).toBe("text.sent")
		expect(event.timestamp).toBe(1234567890)
		expect(event.data?.message_id).toBe("msg_1")
	})

	test("accepts Buffer", () => {
		const raw = Buffer.from(JSON.stringify({ id: "e", type: "text.sent", timestamp: 1 }))
		const event = parseWebhookPayload(raw)
		expect(event.id).toBe("e")
		expect(event.type).toBe("text.sent")
	})

	test("throws when id missing", () => {
		const raw = JSON.stringify({ type: "text.sent", timestamp: 1 })
		expect(() => parseWebhookPayload(raw)).toThrow("Invalid webhook payload")
	})

	test("throws when type missing", () => {
		const raw = JSON.stringify({ id: "e", timestamp: 1 })
		expect(() => parseWebhookPayload(raw)).toThrow("Invalid webhook payload")
	})

	test("throws when timestamp missing", () => {
		const raw = JSON.stringify({ id: "e", type: "text.sent" })
		expect(() => parseWebhookPayload(raw)).toThrow("Invalid webhook payload")
	})

	test("throws on invalid JSON", () => {
		expect(() => parseWebhookPayload("not json")).toThrow()
	})
})
