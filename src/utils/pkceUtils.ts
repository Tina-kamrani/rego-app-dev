import { sha256 } from "js-sha256";
import { Buffer } from "buffer";

/**
 * Generates a cryptographically secure random string for PKCE `code_verifier`
 * (43-128 characters long, using only A-Z, a-z, 0-9, "-", ".", "_", and "~")
 */
const generateRandomString = (length: number = 64) => {
  const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }

  return randomString;
};

/**
 * Generates PKCE `code_verifier` and `code_challenge` **synchronously**
 * @returns {{codeVerifier: string, codeChallenge: string}}
 */
export const generatePKCE = () => {
  // ✅ Generate a secure random string for `code_verifier`
  const codeVerifier = generateRandomString(128);

  // ✅ Generate SHA256 hash of `code_verifier` (synchronously)
  const codeChallengeHash = sha256.arrayBuffer(codeVerifier);

  // ✅ Convert hash to Base64 URL Encoding (RFC 7636)
  const codeChallenge = Buffer.from(codeChallengeHash)
    .toString("base64")
    .replace(/\+/g, "-") // Replace '+' with '-'
    .replace(/\//g, "_") // Replace '/' with '_'
    .replace(/=+$/, ""); // Remove padding '='

  return { codeVerifier, codeChallenge };
};
