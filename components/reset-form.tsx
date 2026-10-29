"use client";

import { useActionState } from "react";
import { resetPassword } from "@/lib/actions";
import { SubmitButton } from "./submit-button";

export function ResetForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPassword, { error: "" });
  return (
    <form className="form" action={action}>
      <input type="hidden" name="token" value={token} />
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <label className="field">
        <span>New password</span>
        <input name="password" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <label className="field">
        <span>Confirm password</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <SubmitButton pendingLabel="Saving…">Save password and sign in</SubmitButton>
    </form>
  );
}
