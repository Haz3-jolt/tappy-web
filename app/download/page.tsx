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
          The Android build is served straight from <code>/downloads/tappy.apk</code>. It is about 1.5 MB
          and lives inside this site.
        </p>
        <div className="actions">
          <DownloadButton label="download tappy.apk" />
          <Link className="button" href="/">
            back home
          </Link>
        </div>
      </section>
    </main>
  );
}
