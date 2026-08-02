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

	test("lease.available filters by status, capabilities, and location", async function availableFilters() {
		const number = {
			id: "+13059478667",
			status: "available",
			capabilities: { channels: ["sms", "imessage"] },
			location: { country: "US", region: "FL", city: "Miami" },
		}
		vi.stubGlobal("fetch", vi.fn(async function fetchAvailable() {
			return apiResponse({
				available: 4,
				numbers: [
					number,
					{ ...number, id: "+13059478668", status: "g-available" },
					{
						...number,
						id: "+13059478669",
						capabilities: { channels: ["sms"] },
					},
					{
						...number,
						id: "+13059478670",
						location: { country: "US", region: "FL", city: "Orlando" },
					},
				],
			})
		}))

		const response = await new Contiguity("contiguity_sk_test").lease.available({
			filter: {
				status: "available",
				capabilities: ["sms", "imessage"],
				location: {
					country: "US",
					region: "FL",
					city: "Miami",
				},
			},
		})

		expect(response.available).toBe(1)
		expect(response.numbers).toEqual([number])
	})

	test("lease.leased filters by status, capabilities, and location", async function leasedFilters() {
		const number = {
			id: "+13059478667",
			status: "leased",
			number: { e164: "+13059478667", formatted: "+1 (305) 947-8667" },
			location: { country: "US", region: "FL", city: "Miami" },
			carrier: "Contiguity",
			capabilities: { intl_sms: false, channels: ["sms", "imessage"] },
			health: { reputation: 0.9, previous_owners: 1 },
			data: {},
			created_at: "2026-07-29T12:00:00.000Z",
			pricing: { currency: "USD", upfront_fee: 2.99, monthly_rate: 19.99 },
			lease_id: "lsd_active",
			lease_status: "active",
		}
		vi.stubGlobal("fetch", vi.fn(async function fetchLeased() {
			return apiResponse({
				leased: 4,
				numbers: [
					number,
					{
						...number,
						id: "+13059478668",
						lease_id: "lsd_expired",
						lease_status: "expired",
					},
					{
						...number,
						id: "+13059478669",
						capabilities: { intl_sms: false, channels: ["sms"] },
						lease_id: "lsd_sms",
					},
					{
						...number,
						id: "+13059478670",
						location: { country: "US", region: "FL", city: "Orlando" },
						lease_id: "lsd_orlando",
					},
				],
			})
		}))

		const response = await new Contiguity("contiguity_sk_test").lease.leased({
			filter: {
				status: "active",
				capabilities: ["sms", "imessage"],
				location: {
					country: "US",
					region: "FL",
					city: "Miami",
				},
			},
		})

		expect(response.leased).toBe(1)
		expect(response.numbers).toEqual([number])
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

	test("reverse OTP supports service and documented responses", async function reverseOtp() {
		const fetch_mock = vi.fn(async function fetchReverseOtp(url) {
			if (url.endsWith("/reverse/initiate")) {
				return apiResponse({
					otp_id: "r_otp_test",
					number: "+15551234567",
					factor: "1234",
					to: "+16465550123",
					service: "imessage",
					expires_at: "2026-07-30T04:00:00.000Z",
					ui: {
						text: "Send 1234 to +1 (646) 555-0123.",
						qr_code: "sms:+16465550123?body=1234",
					},
					success_url: null,
				})
			}
			if (url.includes("/reverse/verify/")) {
				return apiResponse({
					otp_id: "r_otp_test",
					status: "pending",
					expires_at: "2026-07-30T04:00:00.000Z",
				})
			}
			return apiResponse({ otp_id: "r_otp_test", status: "cancelled" })
		})
		vi.stubGlobal("fetch", fetch_mock)

		const reverse = new Contiguity("contiguity_sk_test").otp.reverse
		const initiated = await reverse.initiate({
			number: "+15551234567",
			service: "imessage",
		})
		const verified = await reverse.verify("r_otp_test")
		const cancelled = await reverse.cancel("r_otp_test")

		expect(initiated.service).toBe("imessage")
		expect(initiated.ui.qr_code).toBe("sms:+16465550123?body=1234")
		expect(verified.status).toBe("pending")
		expect(cancelled.status).toBe("cancelled")

		const initiate_body = JSON.parse(fetch_mock.mock.calls[0][1].body)
		expect(initiate_body.service).toBe("imessage")
		expect(fetch_mock.mock.calls[1][0]).toBe("https://api.contiguity.com/otp/reverse/verify/r_otp_test")
		expect(fetch_mock.mock.calls[1][1].method).toBe("GET")
		expect(fetch_mock.mock.calls[2][0]).toBe("https://api.contiguity.com/otp/reverse/cancel/r_otp_test")
		expect(fetch_mock.mock.calls[2][1].method).toBe("POST")
	})

	test("reverse OTP rejects an unsupported service", function reverseOtpService() {
		const fetch_mock = vi.fn()
		vi.stubGlobal("fetch", fetch_mock)

		expect(() => new Contiguity("contiguity_sk_test").otp.reverse.initiate({
			number: "+15551234567",
			service: "whatsapp",
		})).toThrow()
		expect(fetch_mock).not.toHaveBeenCalled()
	})

	test("conversation reads optionally request tracking", async function conversationTracking() {
		const fetch_mock = vi.fn(async function fetchConversation() {
			return apiResponse({})
		})
		vi.stubGlobal("fetch", fetch_mock)
		const contiguity = new Contiguity("contiguity_sk_test")

		await contiguity.text.get("text_test", { tracking: true })
		await contiguity.text.history({
			to: "+13059478667",
			from: "+13059478668",
			tracking: true,
		})
		await contiguity.imessage.get("imessage_test", { tracking: null })
		await contiguity.imessage.history({
			to: "+13059478667",
			from: "+13059478668",
			tracking: false,
		})

		expect(fetch_mock.mock.calls[0][0]).toBe(
			"https://api.contiguity.com/conversations/history/message/text_test?tracking=true"
		)
		expect(fetch_mock.mock.calls[1][0]).toBe(
			"https://api.contiguity.com/conversations/history/text/%2B13059478667/%2B13059478668/20?tracking=true"
		)
		expect(fetch_mock.mock.calls[2][0]).toBe(
			"https://api.contiguity.com/conversations/history/message/imessage_test"
		)
		expect(fetch_mock.mock.calls[3][0]).toBe(
			"https://api.contiguity.com/conversations/history/imessage/%2B13059478667/%2B13059478668/20"
		)
	})
})
