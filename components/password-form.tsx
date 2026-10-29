"use client";

import { useActionState } from "react";
import { changeOwnPassword } from "@/lib/actions";
import { SubmitButton } from "./submit-button";

export function PasswordForm() {
  const [state, action] = useActionState(changeOwnPassword, { error: "" });
  return (
    <form className="form" action={action}>
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <label className="field">
        <span>Current password</span>
        <input name="current" type="password" autoComplete="current-password" required />
      </label>
      <label className="field">
        <span>New password</span>
        <input name="password" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <label className="field">
        <span>Confirm new password</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <SubmitButton pendingLabel="Saving…">Update password</SubmitButton>
    </form>
  );
}
