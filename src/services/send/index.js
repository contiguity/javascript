import { ContiguityClient } from "@/client/fetch.js";
import { _text } from "@/services/send/text.js";
import { _email } from "@/services/send/email.js";

/**
 * Send service for various message types
 */
export class SendService extends ContiguityClient {
    constructor(token) {
        super(token);
    }

    /**
     * Send a text message
     * 
     * @param {Object} params - Message parameters
     * @param {string} params.to - Phone number in E.164 format
     * @param {string} params.message - The text message to send
     * @param {string} [params.from] - If you lease a phone number from Contiguity, you can use a specific one
     * @returns {Promise<Object>} Message send response
     */
    async text(params) {
        return _text.call(this, params);
    }

    /**
     * Send an email
     * 
     * @param {Object} params - Email parameters
     * @param {string|string[]} params.to - Recipient email address(es). Can be a string or array of up to 10 addresses
     * @param {string} params.from - Provide either just your sender name (and use Contiguity's email) or provide your sender name and email (has to be verified in the Console)
     * @param {string} params.subject - Subject of the email
     * @param {Object} params.body - Email body content (must include either text or html)
     * @param {string} [params.body.text] - Text content of the email
     * @param {string} [params.body.html] - HTML content of the email
     * @param {string} [params.reply_to] - Reply-to email address
     * @param {string|string[]} [params.cc] - Carbon copy email address(es). Can be a string or array of up to 10 addresses
     * @param {string|string[]} [params.bcc] - Blind carbon copy email address(es). Can be a string or array of up to 10 addresses
     * @param {Array<Object>} [params.headers] - Custom email headers
     * @returns {Promise<Object>} Email send response
     */
    async email(params) {
        return _email.call(this, params);
    }

    /*
     * imessage
     */
    // has to support .send.imessage and .send.imessage.typing and .send.imessage.react. idk how

    /**
     * whatsapp
     */
    // has to support .send.whatsapp and .send.whatsapp.typing and .send.whatsapp.react. idk how
}
