import test from "node:test";
import { equal } from "node:assert/strict";

import { hashPassword, verifyPassword } from "./password";
import { signToken, verifyToken } from "./jwt";

test("password hashing verifies the original password only", () => {
  const hash = hashPassword("SecurePass123");

  equal(verifyPassword("SecurePass123", hash), true);
  equal(verifyPassword("WrongPass123", hash), false);
});

test("signed tokens can be verified", () => {
  process.env.JWT_SECRET = "test-secret";
  process.env.JWT_EXPIRES_IN = "1h";

  const token = signToken({ sub: "user-1", role: "Admin" });
  const payload = verifyToken(token);

  equal(payload.sub, "user-1");
  equal(payload.role, "Admin");
});
