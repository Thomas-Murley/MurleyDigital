const notices: Record<string, { tone: "ok" | "wait" | "bad"; text: string }> = {
  "card-saved": { tone: "ok", text: "Payment method saved. Monthly hosting is on." },
  "cancel-requested": {
    tone: "wait",
    text: "Cancellation is requested. Hosting stays up through the period already paid.",
  },
  "cancel-unavailable": { tone: "bad", text: "There is no active hosting subscription to cancel." },
  "password-changed": { tone: "ok", text: "Password updated." },
  missing: { tone: "bad", text: "That record could not be found." },
  "demo-mode": { tone: "wait", text: "This account is on the demonstration vault, not Stripe." },
  canceled: { tone: "wait", text: "Hosting is canceled. No further monthly charges will be made." },
  "stripe-error": { tone: "bad", text: "Stripe could not complete that request. Check the keys and try again." },
  "invite-revoked": { tone: "ok", text: "Invite revoked. The link will no longer open an account." },
  "amount-invalid": { tone: "bad", text: "Enter a monthly amount between $1 and $100,000." },
  "stripe-amount-failed": {
    tone: "bad",
    text: "Stripe did not accept the new amount, so it was not changed. The previous rate still stands.",
  },
  "amount-saved": { tone: "ok", text: "Monthly rate saved. It applies on the next charge, with 14 days' notice to the client." },
  "details-invalid": { tone: "bad", text: "Site name and plan name are required." },
  "details-saved": { tone: "ok", text: "Client details saved." },
  paused: { tone: "wait", text: "Hosting is paused. Autopay will not run until you resume it." },
  resumed: { tone: "ok", text: "Hosting resumed." },
  "cancel-kept": { tone: "ok", text: "Cancellation cleared. Hosting will continue." },
  "reset-ready": { tone: "ok", text: "Reset link ready. Copy it now. It expires in 48 hours and will not be shown again." },
  "profile-invalid": { tone: "bad", text: "Check the studio name, legal name, and email." },
  "profile-saved": { tone: "ok", text: "Public studio details saved." },
  "password-wrong": { tone: "bad", text: "Current password is incorrect." },
  "email-taken": { tone: "bad", text: "That email is already used by another account." },
  "email-saved": { tone: "ok", text: "Login email updated." },
  billed: { tone: "ok", text: "Due hosting charges have been recorded." },
  "nothing-due": { tone: "ok", text: "Nothing was due. Billing is current." },
};

export function Notice({ code }: { code?: string }) {
  if (!code || !notices[code]) return null;
  const notice = notices[code];
  const tone = notice.tone === "ok" ? "banner banner-ok" : notice.tone === "bad" ? "banner banner-bad" : "banner";
  return (
    <p className={tone} role="status">
      {notice.text}
    </p>
  );
}
