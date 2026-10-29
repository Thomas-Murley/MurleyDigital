"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";
import { SubmitButton } from "./submit-button";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(login, { error: "" });
  return (
    <form className="form" action={action}>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
    </form>
  );
}
