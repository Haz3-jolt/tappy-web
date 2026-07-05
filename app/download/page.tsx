import Link from "next/link";

const apkHref = process.env.NEXT_PUBLIC_APK_URL?.trim() || "/downloads/tappy.apk";

export default function DownloadPage() {
  return (
    <main className="mini-page">
      <div className="grain" aria-hidden="true" />
      <section className="mini-card">
        <a className="brand mini-brand" href="/" aria-label="Tappy home">
          <span className="brand-mark">
            <img src="/tappy-glyph.png" alt="" />
          </span>
          <span className="brand-word">TAPPY</span>
        </a>
        <p className="eyebrow">APK DOWNLOAD</p>
        <h1>Tappy APK is ready.</h1>
        <p>
          Download the current Android build from <code>/downloads/tappy.apk</code>. Android may ask you to allow
          installs from your browser before opening it.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href={apkHref}>
            Download APK
          </a>
          <Link className="button button-secondary" href="/">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
