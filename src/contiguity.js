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
        this.token = token.trim();
        this.debug = debug;
        this.baseURL = "https://api.contiguity.co";
        this.orwellBaseURL = "https://orwell.contiguity.co";
    }

    processRequestCode(code) {
        if (code === 200 || code === 201) return 200;
        if (code === 401) throw new Error(`Contiguity couldn't authenticate you: 401.`);
        if (code === 500) throw new Error(`Contiguity's unavailable right now.`);
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
            if (typeof "window" === "undefined") throw new Error("Getting contents from files is not supported in the browser.");
            const fileContent = fs.readFileSync(file).toString();
            const mini = minify(fileContent, { html5: true, continueOnParseError: true });
            return mini;
        },

        /**
         * Fetch an online template. Coming soon.
         * @async
         * @param {string} file_name - The file name of the online template.
         */
        online: async (file_name) => {
            // coming soon
        },
    };

    send = {
        /**
         * Send a text message.
         * @async
         * @param {object} object - The object containing the message details.
         * @param {string} object.recipient - The recipient's phone number.
         * @param {string} object.message - The message to send.
         * @returns {Promise<object>} Returns the response object.
         * @throws {Error} Throws an error if required fields are missing or sending the message fails.
         */
        text: async (object) => {
            // Detailed error messages
            if (!object.recipient) throw new Error("Contiguity requires a recipient to be specified.");
            if (!object.message) throw new Error("Contiguity requires a message to be provided.");
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')");

            const e164 = phone(object.recipient);
            if (!e164.isValid) throw new Error("Contiguity requires and expects phone numbers to follow the E.164 ([+][country code][subscriber number]) format. @contiguity/javascript attempts to format numbers, however it has failed.");

            const textHandler = await fetch(`${this.baseURL}/send/text`, {
                method: "POST",
                body: JSON.stringify({
                    recipient: e164.phoneNumber,
                    message: object.message,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.token}`,
                },
            });

            const textHandlerResponse = await textHandler.json();

            if (textHandler.status !== 200) throw new Error(`Contiguity couldn't send your message. Received: ${textHandler.status} with reason: "${textHandlerResponse.message}"`);
            if (this.debug) console.log(`Contiguity successfully sent your text to ${object.recipient}. Crumbs:\n\n${JSON.stringify(textHandlerResponse)}`);

            return textHandlerResponse;
        },

        /**
         * Send an email.
         * @async
         * @param {object} object - The object containing the email details.
         * @param {string} object.recipient - The recipient's email address.
         * @param {string} object.from - The sender's name. The email address is selected automatically. Configure at contiguity.co/dashboard
         * @param {string} object.subject - The email subject.
         * @param {string} object.text - The plain text email body. Provide one body, or HTML will be prioritized if both are present.
         * @param {string} object.html - The HTML email body. Provide one body.
         * @param {string} [object.replyTo] - (Optional) The reply-to email address.
         * @param {string} [object.cc] - (Optional) The CC email addresses.
         * @returns {Promise<object>} Returns the response object.
         * @throws {Error} Throws an error if required fields are missing or sending the email fails.
         */
        email: async (object) => {
            // Detailed error messages
            if (!object.recipient) throw new Error("Contiguity requires a recipient to be specified.");
            if (!object.from) throw new Error("Contiguity requires a sender (from) be specified.");
            if (!object.subject) throw new Error("Contiguity requires a subject to be specified.");
            if (!object.text && !object.html) throw new Error("Contiguity requires an email body (text or HTML) to be provided.");
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')");

            const emailHandler = await fetch(`${this.baseURL}/send/email`, {
                method: "POST",
                body: JSON.stringify({
                    recipient: object.recipient,
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
            });

            const emailHandlerResponse = await emailHandler.json();

            if (emailHandler.status !== 200) throw new Error(`Contiguity couldn't send your email. Received: ${emailHandler.status} with reason: "${emailHandlerResponse.message}"`);
            if (this.debug) console.log(`Contiguity successfully sent your email to ${object.recipient}. Crumbs:\n\n${JSON.stringify(emailHandlerResponse)}`);

            return emailHandlerResponse;
        },
    };

    verify = {
        /**
         * Verify a phone number's formatting.
         * @param {string} number - The phone number to verify.
         * @returns {boolean} - Returns true if the number is formatted correctly, false otherwise.
         */
        number: (number) => {
            const validity = phone(number);
            return validity.isValid;
        },

        /**
         * Verify the formatting of an email address.
         * @param {string} email - The email address to verify.
         * @returns {boolean} - Returns true if the email address is valid, false otherwise.
         */
        email: (email) => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        },
    };

    email_analytics = {
        /**
         * Get the delivery status of an email.
         * @async
         * @param {string} id - The email ID (returned when an email is sent).
         * @returns {Promise<object>} Returns the response object containing the delivery status.
         * @throws {Error} Throws an error if email ID is missing or the email ID is not found.
         */
        retrieve: async (id) => {
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')");
            if (!id) throw new Error("Contiguity Analytics requires an email ID.");

            const status = await fetch(`${this.orwellBaseURL}/email/status/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.token}`,
                },
            });

            const json = await status.json();
            if (status.status !== 200) throw new Error(`Contiguity Analytics couldn't find an email with ID ${id}`);
            if (this.debug) console.log(`Contiguity successfully found your email. Data:\n\n${JSON.stringify(json)}`);

            return json;
        },
    };

    quota = {
        /**
         * Get quota information.
         * @async
         * @returns {Promise<object>} Returns the response object containing the quota information.
         * @throws {Error} Throws an error if the token/API key is not provided or if there is an issue retrieving the quota.
         */
        retrieve: async () => {
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')");

            const quota = await fetch(`${this.baseURL}/user/get/quota`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.token}`,
                },
            });

            const json = await quota.json();
            if (quota.status !== 200) throw new Error(`Contiguity had an issue finding your quota. Received ${quota.status} with reason: "${json.message}"`);
            if (this.debug) console.log(`Contiguity successfully found your quota. Data:\n\n${JSON.stringify(json)}`);

            return json;
        },
    };

    otp = {
        /**
         * Sends an OTP to the specified recipient.
         * @async
         * @param {object} object - The object containing the OTP details.
         * @param {string} object.recipient - The recipient's phone number to send the OTP.
         * @param {string} object.language - The language to use for the OTP message.
         * @param {string} [object.name] - (Optional) specify who the OTP is for (e.g "Your [Contiguity] code is: 123456")
         * @returns {Promise<string>} Returns the OTP ID.
         * @throws {Error} Throws an error if the token, recipient, or language is not provided, or if there is an issue sending the OTP.
         */
        send: async (object) => {
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')");
            if (!object.recipient) throw new Error("Contiguity requires a recipient to be specified.");
            if (!object.language) throw new Error("Contiguity requires a language to be specified.");

            const e164 = phone(object.recipient);
            if (!e164.isValid) throw new Error("Contiguity requires and expects phone numbers to follow the E.164 ([+][country code][subscriber number]) format. @contiguity/javascript attempts to format numbers, however it has failed.");

            const otpHandler = await fetch(`${this.baseURL}/otp/new`, {
                method: "POST",
                body: JSON.stringify({
                    recipient: e164.phoneNumber,
                    language: object.language,
                    name: object.name || undefined,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.token}`,
                },
            });

            const otpHandlerResponse = await otpHandler.json();

            if (otpHandler.status !== 200) throw new Error(`Contiguity couldn't send your OTP. Received: ${otpHandler.status} with reason: "${otpHandlerResponse.message}"`);
            if (this.debug) console.log(`Contiguity successfully sent your OTP to ${object.recipient} with OTP ID ${otpHandlerResponse.otp_id}`);

            return otpHandlerResponse.otp_id;
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
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')");
            if (!object.otp_id) throw new Error("Contiguity requires an OTP ID to be specified.");
            if (!object.otp) throw new Error("Contiguity requires an OTP (user input) to be specified.");
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
            });

            const otpHandlerResponse = await otpHandler.json();

            if (otpHandler.status !== 200) throw new Error(`Contiguity couldn't verify your OTP. Received: ${otpHandler.status} with reason: "${otpHandlerResponse.message}"`);
            if (this.debug) console.log(`Contiguity 'verified' your OTP (${object.otp}) with boolean verified status: ${otpHandlerResponse.verified}`);

            return otpHandlerResponse.verified; // true or false.
        },
    };

    identity = {
        // Coming soon.
    };
}

module.exports = Contiguity;
