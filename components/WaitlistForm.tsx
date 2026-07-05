"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("Be first in line for the APK drop.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("loading");
    setMessage("Adding you to the list...");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
      }

      setState("success");
      setMessage(result.message || "You're on the Tappy waitlist.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not join the waitlist.");
    }
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          <span>Name</span>
          <input name="name" type="text" placeholder="Your name" autoComplete="name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        </label>
      </div>

      <label className="hp-field" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <input name="source" type="hidden" value="landing-page" />

      <button className="button button-primary" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Joining..." : "Join waitlist"}
        <span aria-hidden="true">→</span>
      </button>

      <p className={`form-message ${state}`} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
