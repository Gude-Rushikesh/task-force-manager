import { createHmac } from "crypto";
import AppError from "./AppError";

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function parseExpiry(value = "7d") {
  const match = String(value).match(/^(\d+)([hd])$/);
  if (!match) return 7 * 24 * 60 * 60;
  const amount = Number(match[1]);
  return match[2] === "h" ? amount * 60 * 60 : amount * 24 * 60 * 60;
}

function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");

  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + parseExpiry(process.env.JWT_EXPIRES_IN),
  };

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedBody = base64Url(JSON.stringify(body));
  const signature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedHeader}.${encodedBody}.${signature}`;
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  const [encodedHeader, encodedBody, signature] = token.split(".");

  if (!encodedHeader || !encodedBody || !signature) {
    throw new AppError("Invalid authentication token", 401);
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  if (signature !== expectedSignature) {
    throw new AppError("Invalid authentication token", 401);
  }

  const payload = JSON.parse(Buffer.from(encodedBody, "base64").toString());
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new AppError("Authentication token expired", 401);
  }

  return payload;
}

export default { signToken, verifyToken };
