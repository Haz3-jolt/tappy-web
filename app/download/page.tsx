import Link from "next/link";

const apkHref = "/downloads/tappy.apk";

export default function DownloadPage() {
  return (
    <main className="mini-page">
      <section className="mini-card">
        <a className="brand mini-brand" href="/" aria-label="Tappy home">
          <span className="brand-mark">
            <img src="/tappy-glyph.png" alt="" />
          </span>
          <span className="brand-word">TAPPY</span>
        </a>
        <p className="eyebrow">APK DOWNLOAD</p>
        <h1>Tappy is packed into this site.</h1>
        <p>
          The Android build is served straight from <code>/downloads/tappy.apk</code>. It is only about 1.5 MB,
          so no separate hosting circus required.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href={apkHref} download="tappy.apk">
            Download tappy.apk
            <span aria-hidden="true">↓</span>
          </a>
          <Link className="button button-secondary" href="/">
            Back to the pink zone
          </Link>
        </div>
      </section>
    </main>
  );
}
