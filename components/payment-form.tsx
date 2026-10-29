"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { savePaymentMethod } from "@/lib/actions";
import { cardBrand, digits, expiryInFuture, formatCardNumber, isDemoTestCard, luhn, parseExpiry } from "@/lib/cards";
import { brandLabel, money } from "@/lib/format";

export function PaymentForm({
  amountCents,
  siteName,
  defaultName,
  replacing,
}: {
  amountCents: number;
  siteName: string;
  defaultName: string;
  replacing: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [postal, setPostal] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const brand = useMemo(() => cardBrand(number), [number]);
  const shown = digits(number);
  const last4 = shown.slice(-4).padStart(4, "•");
  const parsed = parseExpiry(expiry);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const raw = digits(number);
    if (!luhn(raw) || !isDemoTestCard(raw)) {
      setError("Use one of the demonstration cards below. Real card numbers are rejected until Stripe is connected.");
      return;
    }
    if (!parsed || !expiryInFuture(parsed.month, parsed.year)) {
      setError("Enter a future expiry as MM/YY.");
      return;
    }
    const cvcDigits = digits(cvc);
    const cvcOk = brand === "amex" ? cvcDigits.length === 4 : cvcDigits.length === 3;
    if (!cvcOk) {
      setError("Check the security code. It is checked, then discarded. It is not stored.");
      return;
    }
    if (!authorized) {
      setError("Authorize the monthly charge to continue.");
      return;
    }
    setPending(true);
    const result = await savePaymentMethod({
      name,
      last4: raw.slice(-4),
      brand,
      expMonth: parsed.month,
      expYear: parsed.year,
      postal,
      authorized: true,
    });
    if ("error" in result) {
      setError(result.error);
      setPending(false);
      return;
    }
    router.push("/portal?notice=card-saved");
    router.refresh();
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="pay-card" aria-hidden="true">
        <div className="brand">{brandLabel(brand)}</div>
        <div className="num">{shown.length ? `•••• •••• •••• ${last4}` : "•••• •••• •••• ••••"}</div>
        <div className="row">
          <span>{name || "Name on card"}</span>
          <span>{parsed ? `${String(parsed.month).padStart(2, "0")}/${String(parsed.year).slice(-2)}` : "MM/YY"}</span>
        </div>
      </div>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <label className="field">
        <span>Name on card</span>
        <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="cc-name" required />
      </label>
      <label className="field">
        <span>Card number</span>
        <input
          value={number}
          onChange={(event) => setNumber(event.target.value.replace(/[^\d ]/g, "").slice(0, 23))}
          onBlur={() => setNumber((current) => formatCardNumber(current))}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          required
        />
      </label>
      <div className="split">
        <label className="field">
          <span>Expiry</span>
          <input
            value={expiry}
            onChange={(event) => setExpiry(event.target.value)}
            autoComplete="cc-exp"
            placeholder="MM/YY"
            required
          />
        </label>
        <label className="field">
          <span>Security code</span>
          <input value={cvc} onChange={(event) => setCvc(event.target.value)} inputMode="numeric" autoComplete="cc-csc" required />
        </label>
      </div>
      <label className="field">
        <span>Billing postal code</span>
        <input value={postal} onChange={(event) => setPostal(event.target.value)} autoComplete="postal-code" required />
      </label>
      <label className="check">
        <input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} />
        <span style={{ textTransform: "none", letterSpacing: "0", fontSize: "0.95rem", color: "inherit" }}>
          I authorize {money(amountCents)} each month for hosting {siteName}, until I cancel, as described in the{" "}
          <a href="/billing-terms">billing terms</a>.
        </span>
      </label>
      <button className="btn btn-solid" type="submit" disabled={pending}>
        {pending ? "Saving…" : replacing ? "Replace card" : "Start monthly hosting"}
      </button>
      <p className="fine">
        Demonstration only. Try 4242 4242 4242 4242, 5555 5555 5555 4444, or 3782 822463 10005, any future date, and any 3 or 4 digit code.
        The full number and security code stay in this browser. We store brand, last four, and expiry.
      </p>
    </form>
  );
}
