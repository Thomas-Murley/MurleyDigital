"use client";

import { useActionState } from "react";
import { sendMessage } from "@/lib/actions";
import { budgetOptions, serviceOptions, timelineOptions } from "@/lib/content";
import { SubmitButton } from "./submit-button";

export function ContactForm() {
  const [state, action] = useActionState(sendMessage, { error: "" });
  return (
    <form className="form" action={action}>
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="hp" aria-hidden="true">
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="split">
        <label className="field">
          <span>Name</span>
          <input name="name" required autoComplete="name" maxLength={80} />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" maxLength={160} />
        </label>
      </div>
      <label className="field">
        <span>Company</span>
        <input name="company" autoComplete="organization" maxLength={120} />
      </label>
      <div className="split">
        <label className="field">
          <span>What you need</span>
          <select name="service" defaultValue={serviceOptions[0]}>
            {serviceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Budget</span>
          <select name="budget" defaultValue={budgetOptions[0]}>
            {budgetOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Timing</span>
        <select name="timeline" defaultValue={timelineOptions[0]}>
          {timelineOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>About the work</span>
        <textarea name="message" required minLength={10} maxLength={5000} placeholder="What the site needs to do, and what is in the way today." />
      </label>
      <SubmitButton pendingLabel="Sending…">Send the note</SubmitButton>
    </form>
  );
}
