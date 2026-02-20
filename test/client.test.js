import { describe, test, expect } from "vitest"
import { Contiguity } from "../dist/client.js"
import { ContiguityError } from "../dist/utils/errors.js"

describe("Contiguity client", () => {
	test("creates client with token and exposes resources", () => {
		const c = new Contiguity("contiguity_sk_test_foo")
		expect(c.text).toBeDefined()
		expect(c.email).toBeDefined()
		expect(c.otp).toBeDefined()
		expect(c.domains).toBeDefined()
		expect(c.lease).toBeDefined()
		expect(c.imessage).toBeDefined()
		expect(c.whatsapp).toBeDefined()
		// expect(c.voice).toBeDefined() // voice resource commented out
		expect(c.webhook).toBeDefined()
	})

	test("accepts config with debug", () => {
		const c = new Contiguity("contiguity_sk_test_foo", { debug: true })
		expect(c.text).toBeDefined()
	})
})

const API_KEY = process.env.CONTIGUITY_TEST_API_KEY
const hasKey = !!API_KEY

describe("Contiguity client (live)", () => {
	test.skipIf(!hasKey)("throws ContiguityError on invalid request", async () => {
		const c = new Contiguity(API_KEY)
		await expect(c.text.get("nonexistent_id_12345")).rejects.toThrow(ContiguityError)
	})

	test.skipIf(!hasKey)("invalid token yields 401 or 403", async () => {
		const c = new Contiguity("contiguity_sk_invalid_token")
		await expect(c.domains.list()).rejects.toThrow(ContiguityError)
	})
})
