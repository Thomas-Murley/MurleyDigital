"use client";

import { useActionState } from "react";
import { acceptInvite } from "@/lib/actions";
import { SubmitButton } from "./submit-button";

export function SignupForm({ token }: { token: string }) {
  const [state, action] = useActionState(acceptInvite, { error: "" });
  return (
    <form className="form" action={action}>
      <input type="hidden" name="token" value={token} />
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <label className="field">
        <span>Confirm password</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <label className="check">
        <input type="checkbox" name="agree" required />
        <span style={{ textTransform: "none", letterSpacing: "0", fontSize: "0.95rem", color: "inherit" }}>
          I agree to the <a href="/terms">terms of service</a>, <a href="/privacy">privacy notice</a>, and{" "}
          <a href="/billing-terms">billing terms</a>.
        </span>
      </label>
      <SubmitButton pendingLabel="Opening account…">Create account and continue</SubmitButton>
      <p className="fine">Next you will add a payment method for the monthly amount shown. You do not choose the price.</p>
    </form>
  );
}
