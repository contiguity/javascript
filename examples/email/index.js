// npm i @contiguity/javascript
const contiguity = require('@contiguity/javascript')
// Initialize Contiguity
const client = contiguity.login('your_token')
// Write out the fields:
const email = {
    recipient: "example@example.com",
    from: "Example Company",
    subject: "Example Subject",
    text: "Thanks for the example!"
    // or html: "<h3>Thanks for the example!</h3>"
}
// Send it!
client.send.email(email)