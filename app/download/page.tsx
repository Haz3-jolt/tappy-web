import Link from "next/link";
import DownloadButton from "../../components/DownloadButton";


export default function DownloadPage() {
  return (
    <main className="mini-page">
      <section className="mini-card">
        <a className="logo mini-brand" href="/" aria-label="Tappy home">
          <img src="/tappy-glyph.png" alt="" />
          <span>Tappy</span>
        </a>
        <p className="eyebrow">APK DOWNLOAD</p>
        <h1>grab tappy.</h1>
        <p>
          The Android build is ready here. It is about 1.5 MB.
        </p>
        <div className="actions">
          <DownloadButton label="download" />
          <Link className="button" href="/">
            back home
          </Link>
        </div>
      </section>
    </main>
  );
}
