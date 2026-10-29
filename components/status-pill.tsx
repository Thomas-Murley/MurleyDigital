const labels: Record<string, string> = {
  active: "Active",
  awaiting_payment: "Needs a card",
  past_due: "Past due",
  paused: "Paused",
  canceled: "Canceled",
  paid: "Paid",
  open: "Open",
  void: "Void",
  failed: "Failed",
  pending: "Pending",
  accepted: "Accepted",
  expired: "Expired",
  revoked: "Revoked",
};

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "active" || status === "paid" || status === "accepted"
      ? "ok"
      : status === "awaiting_payment" || status === "open" || status === "pending"
        ? "wait"
        : status === "past_due" || status === "failed" || status === "expired" || status === "revoked"
          ? "bad"
          : "muted";
  return <span className={`pill pill-${tone}`}>{labels[status] || status}</span>;
}
