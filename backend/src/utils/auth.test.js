const test = require("node:test");
const assert = require("node:assert/strict");

const { hashPassword, verifyPassword } = require("./password");
const { signToken, verifyToken } = require("./jwt");

test("password hashing verifies the original password only", () => {
  const hash = hashPassword("SecurePass123");

  assert.equal(verifyPassword("SecurePass123", hash), true);
  assert.equal(verifyPassword("WrongPass123", hash), false);
});

test("signed tokens can be verified", () => {
  process.env.JWT_SECRET = "test-secret";
  process.env.JWT_EXPIRES_IN = "1h";

  const token = signToken({ sub: "user-1", role: "Admin" });
  const payload = verifyToken(token);

  assert.equal(payload.sub, "user-1");
  assert.equal(payload.role, "Admin");
});
