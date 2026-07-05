"use client";

import { FormEvent, useState } from "react";

type WaitlistEntry = {
  email: string;
  name: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  ip: string;
  userAgent: string;
};

type ApiResult = {
  ok: boolean;
  count: number;
  entries: WaitlistEntry[];
  message?: string;
};

export default function CreatorPanel() {
  const [secret, setSecret] = useState("");
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [message, setMessage] = useState("Enter your admin secret to load the waitlist.");
  const [isLoading, setIsLoading] = useState(false);

  async function loadEntries(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsLoading(true);
    setMessage("Loading waitlist...");

    try {
      const response = await fetch("/api/waitlist", {
        headers: { "x-admin-secret": secret },
      });
      const result = (await response.json()) as ApiResult;

      if (!response.ok) {
        throw new Error(result.message || "Could not load waitlist.");
      }

      setEntries(result.entries || []);
      setMessage(`${result.count || 0} waitlisted user${result.count === 1 ? "" : "s"}.`);
    } catch (error) {
      setEntries([]);
      setMessage(error instanceof Error ? error.message : "Could not load waitlist.");
    } finally {
      setIsLoading(false);
    }
  }

  async function exportCsv() {
    setIsLoading(true);
    setMessage("Preparing CSV...");

    try {
      const response = await fetch("/api/waitlist?format=csv", {
        headers: { "x-admin-secret": secret },
      });

      if (!response.ok) {
        throw new Error("Could not export CSV.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tappy-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage("CSV downloaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not export CSV.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="creator-panel">
      <form className="creator-controls" onSubmit={loadEntries}>
        <label>
          <span>Admin secret</span>
          <input
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            placeholder="ADMIN_SECRET"
            autoComplete="current-password"
            required
          />
        </label>
        <div className="creator-actions">
          <button className="button button-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Working..." : "Load users"}
          </button>
          <button className="button button-secondary" type="button" onClick={exportCsv} disabled={isLoading || !secret}>
            Export CSV
          </button>
        </div>
      </form>

      <p className="creator-message" role="status" aria-live="polite">
        {message}
      </p>

      <div className="waitlist-table-wrap">
        <table className="waitlist-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Joined</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4}>No users loaded yet.</td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.email}>
                  <td>{entry.email}</td>
                  <td>{entry.name || "—"}</td>
                  <td>{formatDate(entry.createdAt)}</td>
                  <td>{entry.source || "landing"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}
