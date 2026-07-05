"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("Join for the iOS build.");

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

      const result = await readApiMessage(response);

      if (!response.ok) {
        throw new Error(result.message || "Could not join the waitlist.");
      }

      setState("success");
      setMessage(result.message || "You're on the iOS waitlist.");
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

      <input name="source" type="hidden" value="ios-waitlist" />

      <button className="button button-primary" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Joining..." : "Join iOS waitlist"}
        <span aria-hidden="true">→</span>
      </button>

      <p className={`form-message ${state}`} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}

async function readApiMessage(response: Response): Promise<{ message?: string }> {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as { message?: string };
  } catch {
    return { message: text };
  }
}
