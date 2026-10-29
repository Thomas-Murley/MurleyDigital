"use client";

import { useActionState, useState } from "react";
import { createInvite } from "@/lib/actions";
import { hostingPresets } from "@/lib/content";
import { dollarsToCents, money } from "@/lib/format";
import { SubmitButton } from "./submit-button";

export function InviteForm() {
  const [state, action] = useActionState(createInvite, { error: "" });
  const [name, setName] = useState("");
  const [site, setSite] = useState("");
  const [label, setLabel] = useState(hostingPresets[1].label);
  const [amount, setAmount] = useState(hostingPresets[1].amount);
  const [days, setDays] = useState("14");
  const cents = dollarsToCents(amount);

  return (
    <div className="pay-layout">
      <form className="form" action={action}>
        {state.error ? (
          <p className="form-error" role="alert">
            {state.error}
          </p>
        ) : null}
        <div className="split">
          <label className="field">
            <span>Client name</span>
            <input name="name" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" required />
          </label>
        </div>
        <label className="field">
          <span>Company</span>
          <input name="company" />
        </label>
        <label className="field">
          <span>Site name</span>
          <input name="siteName" value={site} onChange={(event) => setSite(event.target.value)} required />
        </label>
        <div className="field">
          <span>Start from a plan</span>
          <div className="row-actions">
            {hostingPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="btn btn-small"
                onClick={() => {
                  setLabel(preset.label);
                  setAmount(preset.amount);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <label className="field">
          <span>Plan name on the invite</span>
          <input name="hostingLabel" value={label} onChange={(event) => setLabel(event.target.value)} required />
        </label>
        <div className="split">
          <label className="field">
            <span>Monthly amount, USD</span>
            <input name="amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} required />
          </label>
          <label className="field">
            <span>Link expires</span>
            <select name="days" value={days} onChange={(event) => setDays(event.target.value)}>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
            </select>
          </label>
        </div>
        <label className="field">
          <span>Note the client will see</span>
          <textarea name="clientNote" placeholder="Optional. What this monthly fee covers for this site." />
        </label>
        <p className="fine">You set the price. The client cannot change it. Suggested plans are starting points. Match the number to the real hosting cost.</p>
        <SubmitButton pendingLabel="Creating link…">Create invite link</SubmitButton>
      </form>
      <aside className="receipt">
        <p className="kicker">Client will see</p>
        <h2 style={{ fontSize: "2rem" }}>{site || "Their website"}</h2>
        <p className="muted">{label}</p>
        <p className="due">
          {cents === null ? "Set a rate" : money(cents)}
          <span>/month</span>
        </p>
        <p className="fine">
          Private link for {name || "the client"}. Expires in {days} days. They choose a password, then add a card for this exact amount.
        </p>
      </aside>
    </div>
  );
}
