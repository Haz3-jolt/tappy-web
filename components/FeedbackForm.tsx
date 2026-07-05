"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function FeedbackForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("Tried it? Tell me what felt good or broken.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("loading");
    setMessage("Sending feedback...");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = await readApiMessage(response);

      if (!response.ok) {
        throw new Error(result.message || "Could not send feedback.");
      }

      setState("success");
      setMessage(result.message || "Feedback sent. Thank you.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not send feedback.");
    }
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <label>
        <span>Mail</span>
        <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      </label>

      <label>
        <span>Feedback</span>
        <textarea name="feedback" placeholder="what should tappy do better?" required />
      </label>

      <input name="source" type="hidden" value="android-feedback" />

      <button className="button button-primary" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Sending..." : "Submit feedback"}
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
