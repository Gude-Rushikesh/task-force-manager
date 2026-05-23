const crypto = require("crypto");

const ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return `${ITERATIONS}:${salt}:${hash}`;
}

function verifyPassword(password, storedValue) {
  const [iterations, salt, originalHash] = storedValue.split(":");
  const hash = crypto
    .pbkdf2Sync(password, salt, Number(iterations), KEY_LENGTH, DIGEST)
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
}

module.exports = { hashPassword, verifyPassword };
