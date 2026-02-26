import { describe, test, expect } from "vitest"
import { renderReactEmail } from "../dist/utils/react-email.js"

const hasReactEmail = await import("@react-email/render").then(() => true).catch(() => false)

describe("renderReactEmail", () => {
	test.skipIf(!hasReactEmail)("renders React element to html and text", async () => {
		const React = (await import("react")).default
		const element = React.createElement("div", null, "Hello from test")
		const { html, text } = await renderReactEmail(element)
		expect(typeof html).toBe("string")
		expect(typeof text).toBe("string")
		expect(html).toContain("Hello from test")
		expect(text).toContain("Hello from test")
	})

	test.skipIf(hasReactEmail)("throws when @react-email/render is not installed", async () => {
		await expect(renderReactEmail({})).rejects.toThrow(/Install `@react-email\/render`/)
	})
})
