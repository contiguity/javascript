import { afterEach, describe, expect, test, vi } from "vitest"
import { Contiguity } from "../dist/client.js"

function apiResponse(data) {
	return new Response(JSON.stringify({
		id: "req_test",
		timestamp: 1785362400000,
		api_version: "v2026.7.29",
		object: "response",
		data,
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	})
}

afterEach(function restoreFetch() {
	vi.unstubAllGlobals()
})

describe("SDK regressions", function sdkRegressions() {
	test("lease.available accepts the current API response", async function leaseAvailable() {
		vi.stubGlobal("fetch", vi.fn(async function fetchLease() {
			return apiResponse({
				available: 1,
				numbers: [{
					id: "+13059478667",
					status: "available",
					number: { e164: "+13059478667", formatted: "+1 (305) 947-8667" },
					location: { country: "US", region: "FL", city: "Miami" },
					carrier: "Contiguity",
					capabilities: { intl_sms: false, channels: ["sms"] },
					health: { reputation: 0.9, previous_owners: 1 },
					data: {},
					created_at: "2026-07-29T12:00:00.000Z",
					pricing: { currency: "USD", upfront_fee: 2.99, monthly_rate: 19.99 },
				}],
			})
		}))

		const response = await new Contiguity("contiguity_sk_test").lease.available()

		expect(response.numbers[0].data.requirements).toBeUndefined()
		expect(response.numbers[0].data.e911_capable).toBeUndefined()
		expect(response.numbers[0].created_at).toBe("2026-07-29T12:00:00.000Z")
	})

	test("email sends documented content at the top level", async function emailTopLevel() {
		const fetch_mock = vi.fn(async function fetchEmail() {
			return apiResponse({ email_id: "email_test" })
		})
		vi.stubGlobal("fetch", fetch_mock)

		await new Contiguity("contiguity_sk_test").email.send({
			to: "customer@example.com",
			from: "Test <test@example.com>",
			subject: "Test",
			html: "<p>Hello</p>",
			text: "Hello",
		})

		const request_body = JSON.parse(fetch_mock.mock.calls[0][1].body)
		expect(request_body.html).toBe("<p>Hello</p>")
		expect(request_body.text).toBe("Hello")
		expect(request_body.body).toBeUndefined()
	})

	test("email still accepts deprecated body content", async function emailBody() {
		const fetch_mock = vi.fn(async function fetchEmail() {
			return apiResponse({ email_id: "email_test" })
		})
		vi.stubGlobal("fetch", fetch_mock)

		await new Contiguity("contiguity_sk_test").email.send({
			to: "customer@example.com",
			from: "Test <test@example.com>",
			subject: "Test",
			body: { text: "Hello" },
		})

		const request_body = JSON.parse(fetch_mock.mock.calls[0][1].body)
		expect(request_body.text).toBe("Hello")
		expect(request_body.body).toBeUndefined()
	})

	test("otp.send is canonical and name is optional", async function otpSend() {
		const fetch_mock = vi.fn(async function fetchOtp() {
			return apiResponse({ otp_id: "otp_test" })
		})
		vi.stubGlobal("fetch", fetch_mock)

		const response = await new Contiguity("contiguity_sk_test").otp.send({
			to: "+13059478667",
			language: "en",
		})

		expect(response.otp_id).toBe("otp_test")
		expect(fetch_mock.mock.calls[0][0]).toBe("https://api.contiguity.com/otp/new")
	})
})
