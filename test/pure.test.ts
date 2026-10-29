import assert from "node:assert/strict";
import { cardBrand, formatCardNumber, isDemoTestCard, luhn, parseExpiry } from "../lib/cards";
import { addMonths, dollarsToCents, inviteState } from "../lib/format";
import type { Invite } from "../lib/types";

assert.equal(luhn("4242424242424242"), true);
assert.equal(luhn("4242424242424241"), false);
assert.equal(luhn("378282246310005"), true);
assert.equal(cardBrand("4242424242424242"), "visa");
assert.equal(cardBrand("5555555555554444"), "mastercard");
assert.equal(cardBrand("378282246310005"), "amex");
assert.equal(isDemoTestCard("4242 4242 4242 4242"), true);
assert.equal(isDemoTestCard("4000000000000002"), false);
assert.equal(formatCardNumber("4242424242424242"), "4242 4242 4242 4242");

assert.equal(dollarsToCents("96.5"), 9650);
assert.equal(dollarsToCents("$1,200.50"), 120050);
assert.equal(dollarsToCents("49"), 4900);
assert.equal(dollarsToCents("10.999"), null);
assert.equal(dollarsToCents(""), null);

const expiry = parseExpiry("12 / 28");
assert.deepEqual(expiry, { month: 12, year: 2028 });
assert.equal(parseExpiry("13/28"), null);

const jan31 = addMonths("2026-01-31T00:00:00.000Z", 1);
assert.equal(jan31.slice(0, 10), "2026-02-28");

const invite: Invite = {
  id: "ivt_test",
  token: "token",
  email: "a@example.com",
  name: "A",
  company: "",
  siteName: "Site",
  hostingLabel: "Care",
  monthlyAmountCents: 4900,
  clientNote: "",
  expiresAt: "2099-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  revokedAt: null,
  acceptedAt: null,
  acceptedUserId: null,
};
assert.equal(inviteState(invite, Date.parse("2026-06-01T00:00:00.000Z")), "pending");
assert.equal(inviteState({ ...invite, revokedAt: "2026-01-02T00:00:00.000Z" }), "revoked");
assert.equal(inviteState({ ...invite, expiresAt: "2020-01-01T00:00:00.000Z" }, Date.parse("2026-01-01T00:00:00.000Z")), "expired");

console.log("pure tests passed");
