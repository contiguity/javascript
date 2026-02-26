import { describe, test, expect } from "vitest"
import { Contiguity } from "../dist/client.js"
import { ContiguityError } from "../dist/utils/errors.js"

const API_KEY = process.env.CONTIGUITY_TEST_API_KEY
const hasKey = !!API_KEY
const test_to = process.env.CONTIGUITY_TEST_TO
const test_from = process.env.CONTIGUITY_TEST_FROM
const test_email = process.env.CONTIGUITY_TEST_EMAIL
const test_email_from_name = process.env.CONTIGUITY_TEST_EMAIL_FROM_NAME ?? "SDK Test"

const hasReactEmail = await import("@react-email/render").then(() => true).catch(() => false)

let sent_text_message_id

describe("API (live)", () => {
	test.skipIf(!hasKey)("domains.list returns response", async () => {
		const c = new Contiguity(API_KEY)
		const res = await c.domains.list()
		expect(res).toBeDefined()
		expect(Array.isArray(res.domains)).toBe(true)
		expect(res.metadata).toBeDefined()
		expect(res.metadata.id).toBeDefined()
		expect(res.metadata.timestamp).toBeDefined()
		expect(res.metadata.api_version).toBeDefined()
		expect(res.metadata.object).toBe("response")
	})

	test.skipIf(!hasKey)("lease.available returns response", async () => {
		const c = new Contiguity(API_KEY)
		try {
			const res = await c.lease.available()
			expect(res).toBeDefined()
			expect(res.metadata).toBeDefined()
		} catch (e) {
			if (e instanceof ContiguityError && e.status === 404) return // no leases
			throw e
		}
	})

	test.skipIf(!hasKey)("lease.leased returns response", async () => {
		const c = new Contiguity(API_KEY)
		try {
			const res = await c.lease.leased()
			expect(res).toBeDefined()
			expect(res.metadata).toBeDefined()
		} catch (e) {
			if (e instanceof ContiguityError && e.status === 404) return // no leased numbers
			throw e
		}
	})

	test.skipIf(!hasKey)("text.get with bad id throws", async () => {
		const c = new Contiguity(API_KEY)
		await expect(c.text.get("text_nonexistent_000")).rejects.toThrow()
	})

	test.skipIf(!hasKey || !test_to)("text.history with to/from returns response", async () => {
		const c = new Contiguity(API_KEY)
		const res = await c.text.history({
			to: test_to,
			from: test_from ?? test_to,
			limit: 2,
		})
		expect(res).toBeDefined()
		expect(res.metadata).toBeDefined()
	})

	test.skipIf(!hasKey)("imessage.get with bad id throws", async () => {
		const c = new Contiguity(API_KEY)
		await expect(c.imessage.get("imessage_nonexistent_000")).rejects.toThrow()
	})

	test.skipIf(!hasKey || !test_to)("send text", async () => {
		const c = new Contiguity(API_KEY)
		const res = await c.text.send({
			to: test_to,
			message: "Contiguity SDK test",
			...(test_from && { from: test_from }),
		})
		expect(res).toBeDefined()
		expect(res.message_id).toBeDefined()
		expect(typeof res.message_id).toBe("string")
		expect(res.metadata).toBeDefined()
		sent_text_message_id = res.message_id
	})

	test.skipIf(!hasKey || !test_to)("get text by id", async () => {
		const c = new Contiguity(API_KEY)
		const res = await c.text.get(sent_text_message_id)
		expect(res).toBeDefined()
		expect(res.metadata).toBeDefined()
	})

	test.skipIf(!hasKey || !test_to)("react to text", async () => {
		const c = new Contiguity(API_KEY)
		const res = await c.text.react("add", {
			message_id: sent_text_message_id,
			reaction: "love",
		})
		expect(res).toBeDefined()
		expect(res.message_id).toBeDefined()
		expect(res.metadata).toBeDefined()
	})

	test.skipIf(!hasKey || !test_email)("send email", async () => {
		const c = new Contiguity(API_KEY)
		const res = await c.email.send({
			to: test_email,
			from: test_email_from_name,
			subject: "Contiguity SDK test",
			body: { text: "Test email from SDK" },
		})
		expect(res).toBeDefined()
		expect(res.email_id).toBeDefined()
		expect(typeof res.email_id).toBe("string")
		expect(res.metadata).toBeDefined()
	})

	test.skipIf(!hasKey || !test_email || !hasReactEmail)("send email with react", async () => {
		const React = (await import("react")).default
		const c = new Contiguity(API_KEY)
		const res = await c.email.send({
			to: test_email,
			from: test_email_from_name,
			subject: "Contiguity SDK test (React)",
			react: React.createElement("div", null, "Hello from React Email test"),
		})
		expect(res).toBeDefined()
		expect(res.email_id).toBeDefined()
		expect(typeof res.email_id).toBe("string")
		expect(res.metadata).toBeDefined()
	})
})
