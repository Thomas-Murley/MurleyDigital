"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [state, setState] = useState<"idle" | "done" | "err">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("done");
    } catch {
      setState("err");
    }
    window.setTimeout(() => setState("idle"), 1600);
  }

  const text = state === "done" ? "Copied" : state === "err" ? "Select the text instead" : label;
  return (
    <button type="button" className="btn btn-small" onClick={copy} aria-live="polite">
      {text}
    </button>
  );
}
