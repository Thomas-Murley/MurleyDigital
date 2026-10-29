export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "card";

export function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function cardBrand(num: string): CardBrand {
  const n = digits(num);
  if (/^3[47]/.test(n)) return "amex";
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return "card";
}

export function luhn(num: string) {
  const s = digits(num);
  if (s.length < 13 || s.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = s.length - 1; i >= 0; i -= 1) {
    let n = Number(s[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function formatCardNumber(raw: string) {
  const d = digits(raw).slice(0, 19);
  if (/^3[47]/.test(d)) {
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ");
  }
  return d.replace(/(.{4})/g, "$1 ").trim();
}

export function parseExpiry(input: string): { month: number; year: number } | null {
  const match = input.trim().match(/^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/);
  if (!match) return null;
  const month = Number(match[1]);
  let year = Number(match[2]);
  if (month < 1 || month > 12) return null;
  if (year < 100) year += 2000;
  return { month, year };
}

export function expiryInFuture(month: number, year: number, now = new Date()) {
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));
  return end.getTime() >= now.getTime();
}

export const DEMO_TEST_NUMBERS = ["4242424242424242", "5555555555554444", "378282246310005"];

export function isDemoTestCard(num: string) {
  return DEMO_TEST_NUMBERS.includes(digits(num));
}
