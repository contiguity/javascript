const fetch = require("isomorphic-unfetch");
const { phone } = require("phone");
const minify = require("html-minifier").minify;
const fs = require("fs");

class Contiguity {
	/**
	 * Create a new instance of the Contiguity class.
	 * @param {string} token - The authentication token.
	 * @param {boolean} [debug=false] - (Optional) A flag indicating whether to enable debug mode.
	 */
	constructor(token, debug = false) {
		this.token = token.trim()
		this.debug = debug
		this.baseURL = "https://api.contiguity.co"
		this.orwellBaseURL = "https://orwell.contiguity.co"
	}

	processRequestCode(code) {
		if (code === 200 || code === 201) return 200
		if (code === 401) throw new Error(`Contiguity couldn't authenticate you: 401.`)
		if (code === 500) throw new Error(`Contiguity's unavailable right now.`)
	}

	template = {
		/**
		 * Fetch a local template.
		 * @async
		 * @param {string} file - The file path of the local template.
		 * @throws {Error} - Throws an error if getting contents from files is not supported in the browser.
		 * @returns {Promise<string>} - A promise that resolves to the minified contents of the local template.
		 */
		local: async (file) => {
			if (typeof window !== "undefined") throw new Error("Getting contents from files is not supported in the browser.")
			const fileContent = fs.readFileSync(file).toString()
			const mini = minify(fileContent, { html5: true, continueOnParseError: true })
			return mini
		},

		/**
		 * Fetch an online template. Coming soon.
		 * @async
		 * @param {string} file_name - The file name of the online template.
		 */
		online: async (file_name) => {
			// coming soon
		},
	}

	send = {
		/**
		 * Send a text message.
		 * @async
		 * @param {object} object - The object containing the message details.
		 * @param {string} object.to - The recipient's phone number.
		 * @param {string} object.message - The message to send.
		 * @returns {Promise<object>} Returns the response object.
		 * @throws {Error} Throws an error if required fields are missing or sending the message fails.
		 */
		text: async (object) => {
			// Detailed error messages
			if (!object.to) throw new Error("Contiguity requires a recipient to be specified.")
			if (!object.message) throw new Error("Contiguity requires a message to be provided.")
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")

			const e164 = phone(object.to)
			if (!e164.isValid) throw new Error("Contiguity requires and expects phone numbers to follow the E.164 ([+][country code][subscriber number]) format. @contiguity/javascript attempts to format numbers, however it has failed.")

			const textHandler = await fetch(`${this.baseURL}/send/text`, {
				method: "POST",
				body: JSON.stringify({
					to: e164.phoneNumber,
					message: object.message,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const textHandlerResponse = await textHandler.json()

			if (textHandler.status !== 200) throw new Error(`Contiguity couldn't send your message. Received: ${textHandler.status} with reason: "${textHandlerResponse.message}"`)
			if (this.debug) console.log(`Contiguity successfully sent your text to ${object.to}. Crumbs:\n\n${JSON.stringify(textHandlerResponse)}`)

			return textHandlerResponse
		},

		/**
		 * Send an iMessage. THIS IS RESERVED FOR ENTERPRISE CUSTOMERS! IT IS UNAVAILABLE TO THOSE WITHOUT A PROVISIONED IMESSAGE NODE!
		 * @async
		 * @param {object} object - The object containing the message details.
		 * @param {string} object.to - The recipient's phone number.
		 * @param {string} object.message - The message to send.
		 * @param {boolean} [object.fallback=false] - Should Contiguity fallback onto an SMS number?
		 * @param {string} [object.from] - The number from which the message should be sent.
		 * @param {boolean} [object.intent=false] - Is the message an intent?
		 * @returns {Promise<object>} Returns the response object.
		 * @throws {Error} Throws an error if required fields are missing or sending the message fails.
		 */
		iMessage: async (object) => {
			// Detailed error messages
			if (!object.to) throw new Error("Contiguity requires a recipient to be specified.")
			if (!object.message) throw new Error("Contiguity requires a message to be provided.")
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")

			const e164 = phone(object.to)
			if (!e164.isValid) throw new Error("Contiguity requires and expects phone numbers to follow the E.164 ([+][country code][subscriber number]) format. @contiguity/javascript attempts to format numbers, however it has failed.")

			const textHandler = await fetch(`${this.baseURL}/send/text`, {
				method: "POST",
				body: JSON.stringify({
					to: e164.phoneNumber,
					message: object.message,
					beta_features: {
						imessage: true,
						intent: object.intent,
						fallback: object.fallback,
						from: object.from || undefined,
					},
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const textHandlerResponse = await textHandler.json()

			if (textHandler.status !== 200) throw new Error(`Contiguity couldn't send your iMessage. Received: ${textHandler.status} with reason: "${textHandlerResponse.message}"`)
			if (this.debug) console.log(`Contiguity successfully sent your iMessage to ${object.to}. Crumbs:\n\n${JSON.stringify(textHandlerResponse)}`)

			return textHandlerResponse
		},

		/**
		 * Send an email.
		 * @async
		 * @param {object} object - The object containing the email details.
		 * @param {string} object.to - The recipient's email address.
		 * @param {string} object.from - The sender's name. The email address is selected automatically. Configure at contiguity.co/dashboard
		 * @param {string} object.subject - The email subject.
		 * @param {string} [object.text] - The plain text email body. Provide one body, or HTML will be prioritized if both are present.
		 * @param {string} [object.html] - The HTML email body. Provide one body.
		 * @param {string} [object.replyTo] - (Optional) The reply-to email address.
		 * @param {string} [object.cc] - (Optional) The CC email addresses.
		 * @returns {Promise<object>} Returns the response object.
		 * @throws {Error} Throws an error if required fields are missing or sending the email fails.
		 */
		email: async (object) => {
			// Detailed error messages
			if (!object.to) throw new Error("Contiguity requires a recipient to be specified.")
			if (!object.from) throw new Error("Contiguity requires a sender (from) be specified.")
			if (!object.subject) throw new Error("Contiguity requires a subject to be specified.")
			if (!object.text && !object.html) throw new Error("Contiguity requires an email body (text or HTML) to be provided.")
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")

			const emailHandler = await fetch(`${this.baseURL}/send/email`, {
				method: "POST",
				body: JSON.stringify({
					to: object.to,
					from: object.from,
					subject: object.subject,
					body: object.html ? object.html : object.text,
					contentType: object.html ? "html" : "text",
					// Optional
					replyTo: object.replyTo || undefined,
					cc: object.cc || undefined,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const emailHandlerResponse = await emailHandler.json()

			if (emailHandler.status !== 200) throw new Error(`Contiguity couldn't send your email. Received: ${emailHandler.status} with reason: "${emailHandlerResponse.message}"`)
			if (this.debug) console.log(`Contiguity successfully sent your email to ${object.to}. Crumbs:\n\n${JSON.stringify(emailHandlerResponse)}`)

			return emailHandlerResponse
		},
	}

	verify = {
		/**
		 * Verify a phone number's formatting.
		 * @param {string} number - The phone number to verify.
		 * @returns {boolean} - Returns true if the number is formatted correctly, false otherwise.
		 */
		number: (number) => {
			const validity = phone(number)
			return validity.isValid
		},

		/**
		 * Verify the formatting of an email address.
		 * @param {string} email - The email address to verify.
		 * @returns {boolean} - Returns true if the email address is valid, false otherwise.
		 */
		email: (email) => {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			return emailPattern.test(email)
		},
	}

	generate = {
		/**
		 * Generate an intent. THIS IS RESERVED FOR ENTERPRISE CUSTOMERS!
		 * @async
		 * @param {object} object - The object containing the message details.
		 * @param {string} object.toNumber - The recipient's phone number.
		 * @param {string} object.fromNumber - The number from which the message should be sent. This is important, as your intent's redirection will fail if it's incorrect.
		 * @param {string} object.embedText - The title of the intent.
		 * @param {string} object.imageURL - A URL pointed at a hosted image (ends in .png/.jpg/.jpeg). This is the intent's icon.
		 * @param {string} object.companyName - Your company name.
		 * @param {string} object.option - An internal ID for this intent. This is how you identify which intent was chosen.
		 * @returns {Promise<object>} Returns the response object.
		 * @throws {Error} Throws an error if required fields are missing or sending the message fails.
		 */
		intent: async (object) => {
			// Detailed error messages
			if (!object.toNumber) throw new Error("Contiguity requires a recipient to be specified.")
			if (!object.fromNumber) throw new Error("Contiguity requires a sender to be specified.")
			if (!object.embedText) throw new Error("Contiguity requires embed text to be provided.")
			if (!object.imageURL) throw new Error("Contiguity requires an image URL to be provided.")
			if (!object.companyName) throw new Error("Contiguity requires a company name to be provided.")
			if (!object.option) throw new Error("Contiguity requires an option to be provided.")
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")

			const response = await fetch(`${this.baseURL}/enterprise/message/generate`, {
				method: "POST",
				body: JSON.stringify({
					toNumber: object.toNumber,
					fromNumber: object.fromNumber,
					embedText: object.embedText,
					imageURL: object.imageURL,
					companyName: object.companyName,
					option: object.option,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const responseData = await response.json()

			if (response.status !== 200) throw new Error(`Contiguity couldn't generate your intent. Received: ${response.status} with reason: "${responseData.message}"`)
			if (this.debug) console.log(`Contiguity successfully generated your intent. Response:\n\n${JSON.stringify(responseData)}`)

			return responseData
		},
	}

	email_analytics = {
		/**
		 * Get the delivery status of an email.
		 * @async
		 * @param {string} id - The email ID (returned when an email is sent).
		 * @returns {Promise<object>} Returns the response object containing the delivery status.
		 * @throws {Error} Throws an error if email ID is missing or the email ID is not found.
		 */
		retrieve: async (id) => {
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")
			if (!id) throw new Error("Contiguity Analytics requires an email ID.")

			const status = await fetch(`${this.orwellBaseURL}/email/status/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const json = await status.json()
			if (status.status !== 200) throw new Error(`Contiguity Analytics couldn't find an email with ID ${id}`)
			if (this.debug) console.log(`Contiguity successfully found your email. Data:\n\n${JSON.stringify(json)}`)

			return json
		},
	}

	quota = {
		/**
		 * Get quota information.
		 * @async
		 * @returns {Promise<object>} Returns the response object containing the quota information.
		 * @throws {Error} Throws an error if the token/API key is not provided or if there is an issue retrieving the quota.
		 */
		retrieve: async () => {
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")

			const quota = await fetch(`${this.baseURL}/user/get/quota`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const json = await quota.json()
			if (quota.status !== 200) throw new Error(`Contiguity had an issue finding your quota. Received ${quota.status} with reason: "${json.message}"`)
			if (this.debug) console.log(`Contiguity successfully found your quota. Data:\n\n${JSON.stringify(json)}`)

			return json
		},
	}

	otp = {
		/**
		 * Sends an OTP to the specified recipient.
		 * @async
		 * @param {object} object - The object containing the OTP details.
		 * @param {string} object.to - The recipient's phone number to send the OTP.
		 * @param {string} object.language - The language to use for the OTP message.
		 * @param {string} [object.name] - (Optional) specify who the OTP is for (e.g "Your [Contiguity] code is: 123456")
		 * @returns {Promise<string>} Returns the OTP ID.
		 * @throws {Error} Throws an error if the token, recipient, or language is not provided, or if there is an issue sending the OTP.
		 */
		send: async (object) => {
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")
			if (!object.to) throw new Error("Contiguity requires a recipient to be specified.")
			if (!object.language) throw new Error("Contiguity requires a language to be specified.")

			const e164 = phone(object.to)
			if (!e164.isValid) throw new Error("Contiguity requires and expects phone numbers to follow the E.164 ([+][country code][subscriber number]) format. @contiguity/javascript attempts to format numbers, however it has failed.")

			const otpHandler = await fetch(`${this.baseURL}/otp/new`, {
				method: "POST",
				body: JSON.stringify({
					to: e164.phoneNumber,
					language: object.language,
					name: object.name || undefined,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const otpHandlerResponse = await otpHandler.json()

			if (otpHandler.status !== 200) throw new Error(`Contiguity couldn't send your OTP. Received: ${otpHandler.status} with reason: "${otpHandlerResponse.message}"`)
			if (this.debug) console.log(`Contiguity successfully sent your OTP to ${object.to} with OTP ID ${otpHandlerResponse.otp_id}`)

			return otpHandlerResponse.otp_id
		},

		/**
		 * Verifies the provided OTP.
		 * @async
		 * @param {object} object - The object containing the OTP verification details.
		 * @param {string} object.otp_id - The OTP ID to verify.
		 * @param {string} object.otp - The OTP (user input) to verify.
		 * @returns {Promise<boolean>} Returns the verification status (true or false).
		 * @throws {Error} Throws an error if the token, OTP ID, OTP, is not provided or if there is an issue verifying the OTP.
		 */
		verify: async (object) => {
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")
			if (!object.otp_id) throw new Error("Contiguity requires an OTP ID to be specified.")
			if (!object.otp) throw new Error("Contiguity requires an OTP (user input) to be specified.")
			// if (object.otp.length !== 6) throw new Error("Contiguity requires a 6 digit OTP.")

			const otpHandler = await fetch(`${this.baseURL}/otp/verify`, {
				method: "POST",
				body: JSON.stringify({
					otp: object.otp,
					otp_id: object.otp_id,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const otpHandlerResponse = await otpHandler.json()

			if (otpHandler.status !== 200) throw new Error(`Contiguity couldn't verify your OTP. Received: ${otpHandler.status} with reason: "${otpHandlerResponse.message}"`)
			if (this.debug) console.log(`Contiguity 'verified' your OTP (${object.otp}) with boolean verified status: ${otpHandlerResponse.verified}`)

			return otpHandlerResponse.verified // true or false.
		},

		/**
		 * Resends an OTP
		 * @async
		 * @param {object} object - The object containing the OTP ID.
		 * @param {string} object.otp_id - The OTP ID, used to resend.
		 * @returns {Promise<boolean>} Returns the resent status (true or false).
		 * @throws {Error} Throws an error if the token or OTP ID is not provided or if there is an issue resending.
		 */
		resend: async (object) => {
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")
			if (!object.otp_id) throw new Error("Contiguity requires an OTP ID to be specified.")

			const otpHandler = await fetch(`${this.baseURL}/otp/resend`, {
				method: "POST",
				body: JSON.stringify({
					otp_id: object.otp_id,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const otpHandlerResponse = await otpHandler.json()

			if (otpHandler.status !== 200) throw new Error(`Contiguity couldn't resend your OTP. Received: ${otpHandler.status} with reason: "${otpHandlerResponse.message}"`)
			if (this.debug) console.log(`Contiguity resent your OTP (${object.otp_id}) with boolean resent status: ${otpHandlerResponse.resent}`)

			return otpHandlerResponse.resent // true or false.
		},
	}

	identity = {
		/**
		 * Look up identity information using an IP address.
		 * @async
		 * @param {object} object - The object containing the IP address.
		 * @param {string} object.ip - The IP address to look up.
		 * @returns {Promise<object>} Returns the response object.
		 * @throws {Error} Throws an error if required fields are missing or the lookup fails.
		 */
		ip: async (object) => {
			// Detailed error messages
			if (!object.ip) throw new Error("Contiguity requires an IP address to be specified.")
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")

			const response = await fetch(`${this.baseURL}/identity/lookup/ip`, {
				method: "POST",
				body: JSON.stringify({
					ip: object.ip,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const responseData = await response.json()

			if (response.status !== 200) throw new Error(`Contiguity couldn't look up the IP address. Received: ${response.status} with reason: "${responseData.message}"`)
			if (this.debug) console.log(`Contiguity successfully looked up the IP address ${object.ip}. Response:\n\n${JSON.stringify(responseData)}`)

			return responseData
		},
	}

	enterprise = {
		/**
		 * Check SMS availability for enterprise customers.
		 * @async
		 * @returns {Promise<object>} Returns the response object.
		 * @throws {Error} Throws an error if checking availability fails.
		 */
		availability: async () => {
			if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')")

			const response = await fetch(`${this.baseURL}/enterprise/availability/sms`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Token ${this.token}`,
				},
			})

			const responseData = await response.json()

			if (response.status !== 200) throw new Error(`Contiguity couldn't check availability. Received: ${response.status} with reason: "${responseData.message}"`)
			if (this.debug) console.log(`Contiguity successfully checked availability. Response:\n\n${JSON.stringify(responseData)}`)

			return responseData
		},
	}
}

module.exports = Contiguity
