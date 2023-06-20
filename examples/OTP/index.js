// npm i readline
const readline = require("readline");
// npm i @contiguity/javascript
const contiguity = require("@contiguity/javascript");
// Initialize Contiguity
const client = contiguity.login("your token here");
// Create the readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Get your input
function getUserInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}
// Send an OTP to the phone number provided.
async function sendOTP(phoneNumber) {
    const otpId = await client.otp.send({
        recipient: phoneNumber,
        language: "en",
        name: "Contiguity",
    });
    console.log("OTP sent successfully. OTP ID:", otpId);
    return otpId;
}
// Send OTP ID and OTP to verify
async function verifyOTP(otpId, otp) {
    const verify = await client.otp.verify({
        otp_id: otpId,
        otp: otp,
    });
    return verify;
}

// Run the example
async function runApplication() {
    // Ask for user's phone number
    const phoneNumber = await getUserInput("\nEnter your phone number: ");
    // Send OTP
    const otpId = await sendOTP(phoneNumber);
    // Ask for user's OTP
    const userOTP = await getUserInput("\nEnter the OTP: ");
    // Verify OTP
    const verificationResult = await verifyOTP(otpId, userOTP);
    // Return result
    if (verificationResult) {
        console.log("\nOTP is correct. Phone number verification successful!");
    } else {
        console.log("\nIncorrect OTP. Phone number verification failed.");
    }

    rl.close();
}

// Run the app
runApplication();
