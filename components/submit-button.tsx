"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingLabel = "Working…" }: { children: React.ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-solid" type="submit" disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
