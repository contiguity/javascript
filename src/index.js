const fetch = require("isomorphic-unfetch");
const Contiguity = require("./contiguity");
const Mock = require("./mock");

/**
 * Login to Contiguity using your token.
 * @param {string} token - The authentication token.
 * @param {boolean} [debug=false] - (Optional) A flag indicating whether to enable debug mode.
 * @throws {Error} - Throws an error if the token is empty.
 * @returns {Contiguity} - Returns an instance of the Contiguity class.
 */
function login(token, debug = false) {
    if (token.trim().length == 0) throw new Error(`Contiguity couldn't authenticate you: no token provided.`);
    // verify(token, debug)
    return new Contiguity(token, debug);
}

/**
 * Use Contiguity features in a sandbox mode, with simulated API responses.
 * @param {string} [token] - The authentication token (never used).
 * @returns {Mock} - Returns an instance of the Mock class.
 */
function mock(token) {
    return new Mock(token);
}

module.exports = { login, mock };

/*async function verify(token, debug = false) {
    const res = await fetch(`https://api.contiguity.co/user/get/module_auth`, {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' }
    });
  
    if (!res.ok) {
        throw new Error(`Contiguity couldn't authenticate you: ${res.status == 401 ? "your token is invalid" : res.status}.`);
    }

    if (debug && res.ok) {d
        console.log('Contiguity authenticated your token successfully.')
    }
}*/
