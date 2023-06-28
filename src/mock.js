const { phone } = require("phone");
const minify = require("html-minifier").minify;
const fs = require("fs");

/**
 * Pick a random boolean, number, or element from an array
 * @type {{
 * () => boolean;
 * (min: number, max: number) => number;
 * <T extends unknown>(arr: T[]) => T;
 * }}
 */
const random = (minOrArr, max) => {
    if (Array.isArray(minOrArr)) {
        return minOrArr[Math.floor(Math.random() * minOrArr.length)];
    } else if (typeof minOrArr === "number" && typeof max === "number") {
        return Math.floor(Math.random() * (max - minOrArr)) + minOrArr;
    } else {
        return Math.random() < 0.5;
    }
};
/**
 * Generate a range of numbers
 * @param {number} length - Length of the range
 * @returns number[]
 */
const range = (length) => {
    let output = [];
    for (let i = 0; i < length; i++) {
        output.push(i);
    }
    return output;
};

class Mock {
    /**
     * Create a new instance of the Mock class, with simulated API responses.
     * @param {string} [token] - The authentication token (never used).
     * @param {boolean} [debug=false] - (Optional) A flag indicating whether to enable debug mode.
     */
    constructor(token = "mock", debug = false) {
        this.token = token.trim();
        this.debug = debug;
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
            const mini = minify(fileContent, {
                html5: true,
                continueOnParseError: true,
            });
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

    #plan = random(["free", "payg", "unlimited"]);
    #ad = this.#plan === "free" ? true : random();
    #textQuota = random(0, 2000);
    #emailQuota = random(0, 5000);

    send = {
        /**
         * Simulate sending a text message.
         * @async
         * @param {object} object - The object containing the message details.
         * @param {string} object.to - The recipient's phone number.
         * @param {string} object.message - The message to send.
         * @param {boolean} [error=false] - (Optional) Simulate an API error.
         * @returns {Promise<object>} Returns the response object.
         * @throws {Error} Throws an error if required fields are missing or sending the message fails.
         */
        text: async (object, error = false) => {
            // Detailed error messages
            if (!object.to) throw new Error("Contiguity requires a recipient to be specified.");
            if (!object.message) throw new Error("Contiguity requires a message to be provided.");
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.mock('token')");

            const e164 = phone(object.to);
            if (!e164.isValid) throw new Error("Contiguity requires and expects phone numbers to follow the E.164 ([+][country code][subscriber number]) format. @contiguity/javascript attempts to format numbers, however it has failed.");

            const crumbs =
                this.#plan === "free"
                    ? {
                          plan: "free",
                          quota: this.#textQuota++,
                          remaining: 5000 - this.#textQuota,
                          type: "sms",
                          ad: true,
                      }
                    : {
                          plan: this.#plan,
                          quota: this.#textQuota++,
                          type: "sms",
                          ad: this.#ad,
                      };
            const apiResponse = error
                ? random([
                      {
                          code: 401,
                          body: { message: "Token is either invalid or suspended" },
                      },
                      {
                          code: 500,
                          body: { message: "Sending message failed." },
                      },
                      ...(!this.#plan === "free"
                          ? [
                                {
                                    code: 400,
                                    body: { message: "You've reached your free tier text limit for the month" },
                                },
                            ]
                          : [
                                {
                                    code: 500,
                                    body: { message: "Sending failed due to billing error.", crumbs },
                                },
                            ]),
                  ])
                : {
                      code: 200,
                      body: {
                          message: "Successfully sent",
                          crumbs,
                      },
                  };

            if (apiResponse.code !== 200) throw new Error(`Contiguity couldn't send your message. Received: ${apiResponse.code} with reason: "${apiResponse.body.message}"`);
            if (this.debug) console.log(`Contiguity successfully sent your text to ${object.to}. Crumbs:\n\n${JSON.stringify(apiResponse.body)}`);

            return apiResponse.body;
        },

        /**
         * Simulate sending an email.
         * @async
         * @param {object} object - The object containing the email details.
         * @param {string} object.to - The recipient's email address.
         * @param {string} object.from - The sender's name. The email address is selected automatically. Configure at contiguity.co/dashboard
         * @param {string} object.subject - The email subject.
         * @param {string} [object.text] - The plain text email body. Provide one body, or HTML will be prioritized if both are present.
         * @param {string} [object.html] - The HTML email body. Provide one body.
         * @param {string} [object.replyTo] - (Optional) The reply-to email address.
         * @param {string} [object.cc] - (Optional) The CC email addresses.
         * @param {boolean} [error=false] - (Optional) Simulate an API error.
         * @returns {Promise<object>} Returns the response object.
         * @throws {Error} Throws an error if required fields are missing or sending the email fails.
         */
        email: async (object, error = false) => {
            // Detailed error messages
            if (!object.to) throw new Error("Contiguity requires a recipient to be specified.");
            if (!object.from) throw new Error("Contiguity requires a sender (from) be specified.");
            if (!object.subject) throw new Error("Contiguity requires a subject to be specified.");
            if (!object.text && !object.html) throw new Error("Contiguity requires an email body (text or HTML) to be provided.");
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.mock('token')");

            const crumbs = {
                plan: this.#plan,
                quota: this.#emailQuota++,
                type: "email",
                ad: this.#ad,
            };
            const apiResponse = error
                ? random([
                      {
                          code: 401,
                          body: { message: "Token is either invalid or suspended" },
                      },
                      {
                          code: 500,
                          body: { message: "Sending message failed." },
                      },
                      {
                          code: 500,
                          body: { message: "Sending failed due to Contiguity error. Contact Contiguity if error persists.", crumbs },
                      },
                      {
                          code: 500,
                          body: { message: "Sending failed due to server error.", crumbs },
                      },
                      {
                          code: 500,
                          body: { message: "Sending failed due to SMTP mail server error.", crumbs },
                      },
                      ...(this.#plan === "free"
                          ? [
                                {
                                    code: 400,
                                    body: { message: "You've reached your free tier email limit for the month" },
                                },
                            ]
                          : [
                                {
                                    code: 500,
                                    body: { message: "Sending failed due to Stripe billing error.", crumbs },
                                },
                            ]),
                  ])
                : {
                      code: 200,
                      body: {
                          message: "Successfully sent",
                          crumbs,
                      },
                  };

            if (apiResponse.code !== 200) throw new Error(`Contiguity couldn't send your email. Received: ${apiResponse.code} with reason: "${apiResponse.body.message}"`);
            if (this.debug) console.log(`Contiguity successfully sent your email to ${object.to}. Crumbs:\n\n${JSON.stringify(apiResponse.body)}`);

            return apiResponse.body;
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
         * Simulate getting the delivery status of an email.
         * @async
         * @param {string} id - The email ID (returned when an email is sent).
         * @param {boolean} [error=false] - (Optional) Simulate an API error.
         * @returns {Promise<object>} Returns the response object containing the delivery status.
         * @throws {Error} Throws an error if email ID is missing or the email ID is not found.
         *
         * @throws {Error} **Mocking Analytics is not yet supported.**
         */
        retrieve: async (id, error = false) => {
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.mock('token')");
            if (!id) throw new Error("Contiguity Analytics requires an email ID.");

            throw new Error("Mocking Analytics is not yet supported.");
            // TODO: Add support for mocking analytics
            const json = null;

            if (json.code !== 200) throw new Error(`Contiguity Analytics couldn't find an email with ID ${id}`);
            if (this.debug) console.log(`Contiguity successfully found your email. Data:\n\n${JSON.stringify(json)}`);

            return json;
        },
    };

    quota = {
        /**
         * Get quota information.
         * @async
         * @param {boolean} [error=false] - (Optional) Simulate an API error.
         * @returns {Promise<object>} Returns the response object containing the quota information.
         * @throws {Error} Throws an error if the token/API key is not provided or if there is an issue retrieving the quota.
         *
         * @throws {Error} **Retriving quota is not yet supported.**
         */
        retrieve: async (error = false) => {
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.login('token')");

            throw new Error("Retriving quota is not yet supported.");
            // TODO: Add support for quota endpoint
            const json = null;

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
         * @param {string} object.to - The recipient's phone number to send the OTP.
         * @param {string} object.language - The language to use for the OTP message.
         * @param {string} [object.name] - (Optional) specify who the OTP is for (e.g "Your [Contiguity] code is: 123456")
         * @param {boolean} [error=false] - (Optional) Simulate an API error.
         * @returns {Promise<string>} Returns the OTP ID.
         * @throws {Error} Throws an error if the token, recipient, or language is not provided, or if there is an issue sending the OTP.
         */
        send: async (object, error = false) => {
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.mock('token')");
            if (!object.to) throw new Error("Contiguity requires a recipient to be specified.");
            if (!object.language) throw new Error("Contiguity requires a language to be specified.");

            const e164 = phone(object.to);
            if (!e164.isValid) throw new Error("Contiguity requires and expects phone numbers to follow the E.164 ([+][country code][subscriber number]) format. @contiguity/javascript attempts to format numbers, however it has failed.");

            const otpIdChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
            const crumbs =
                this.#plan === "free"
                    ? {
                          plan: "free",
                          quota: this.#textQuota++,
                          remaining: 5000 - this.#textQuota,
                          type: "sms",
                          ad: true,
                      }
                    : {
                          plan: this.#plan,
                          quota: this.#textQuota++,
                          type: "sms",
                          ad: this.#ad,
                      };
            const apiResponse = error
                ? random([
                      {
                          code: 401,
                          body: { message: "Token is either invalid or suspended" },
                      },
                      {
                          code: 500,
                          body: { message: "Sending message failed." },
                      },
                      ...(!this.#plan === "free"
                          ? [
                                {
                                    code: 400,
                                    body: { message: "You've reached your free tier text limit for the month" },
                                },
                            ]
                          : [
                                {
                                    code: 500,
                                    body: { message: "Sending failed due to billing error.", crumbs },
                                },
                            ]),
                  ])
                : {
                      code: 200,
                      body: {
                          message: "Successfully sent",
                          crumbs,
                          otp_id: range(50)
                              .map(() => random(otpIdChars))
                              .join(""),
                      },
                  };

            if (apiResponse.code !== 200) throw new Error(`Contiguity couldn't send your OTP. Received: ${apiResponse.code} with reason: "${apiResponse.body.message}"`);
            if (this.debug) console.log(`Contiguity successfully sent your OTP to ${object.to} with OTP ID ${apiResponse.body.otp_id}`);

            return apiResponse.body.otp_id;
        },

        /**
         * Verifies the provided OTP.
         * @async
         * @param {object} object - The object containing the OTP verification details.
         * @param {string} object.otp_id - The OTP ID to verify.
         * @param {string} object.otp - The OTP (user input) to verify.
         * @param {boolean} [error=false] - (Optional) Simulate an API error.
         * @returns {Promise<boolean>} Returns the verification status (true or false).
         * @throws {Error} Throws an error if the token, OTP ID, OTP, is not provided or if there is an issue verifying the OTP.
         */
        verify: async (object, error = false) => {
            if (!this.token) throw new Error("Contiguity requires a token/API key to be provided via contiguity.mock('token')");
            if (!object.otp_id) throw new Error("Contiguity requires an OTP ID to be specified.");
            if (!object.otp) throw new Error("Contiguity requires an OTP (user input) to be specified.");
            // if (object.otp.length !== 6) throw new Error("Contiguity requires a 6 digit OTP.")

            const apiResponse = error
                ? {
                      code: 200,
                      body: {
                          message: "Incorrect OTP",
                          verified: false,
                      },
                  }
                : {
                      code: 200,
                      body: {
                          message: "OTP Verified",
                          verified: true,
                      },
                  };

            if (apiResponse.code !== 200) throw new Error(`Contiguity couldn't verify your OTP. Received: ${apiResponse.code} with reason: "${apiResponse.body.message}"`);
            if (this.debug) console.log(`Contiguity 'verified' your OTP (${object.otp}) with boolean verified status: ${apiResponse.body.verified}`);

            return apiResponse.body.verified; // true or false.
        },
    };

    identity = {
        // Coming soon.
    };
}

module.exports = Mock;
