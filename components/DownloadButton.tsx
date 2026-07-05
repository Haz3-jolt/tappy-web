"use client";

import { MouseEvent, useEffect, useState } from "react";

const APK_HREF = "/downloads/tappy.apk";

type DownloadButtonProps = {
  label?: string;
};

export default function DownloadButton({ label = "download apk" }: DownloadButtonProps) {
  const [count, setCount] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/downloads", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count?: number } | null) => {
        if (!cancelled && typeof data?.count === "number") {
          setCount(data.count);
        }
      })
      .catch(() => {
        // Counter is nice-to-have. Download still works.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDownload(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (isCounting) {
      return;
    }

    setIsCounting(true);

    try {
      const response = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const data = (await response.json()) as { count?: number };
      if (typeof data.count === "number") {
        setCount(data.count);
      }
    } catch {
      // Do not block the APK if counting fails.
    } finally {
      setIsCounting(false);
      triggerDownload();
    }
  }

  return (
    <span className="download-widget">
      <a className="button primary" href={APK_HREF} download="tappy.apk" onClick={handleDownload}>
        {isCounting ? "starting..." : label}
      </a>
      <span className="download-count" aria-live="polite">
        {count === null ? "counting downloads..." : `${count.toLocaleString()} APK download${count === 1 ? "" : "s"}`}
      </span>
    </span>
  );
}

function triggerDownload() {
  const link = document.createElement("a");
  link.href = APK_HREF;
  link.download = "tappy.apk";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
