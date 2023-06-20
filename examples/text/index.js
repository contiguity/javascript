// npm i @contiguity/javascript
const contiguity = require('@contiguity/javascript')
// Initialize Contiguity
const client = contiguity.login('your_token')
// Write out the fields:
const text = {
    recipient: "+155555555555",
    message: "Example text message."
}
// Send it!
client.send.text(text)