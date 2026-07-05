import type { CSSProperties } from "react";
import WaitlistForm from "../components/WaitlistForm";

const apkHref = "/downloads/tappy.apk";
const githubHref = "https://github.com/adityamhn/heytappy";

export default function Home() {
  return (
    <main className="page">
      <header className="topbar">
        <a className="logo" href="#top" aria-label="Tappy home">
          <img src="/tappy-glyph.png" alt="" />
          <span>Tappy</span>
        </a>
        <nav aria-label="Main navigation">
          <a href={apkHref} download="tappy.apk">apk</a>
          <a href={githubHref} target="_blank" rel="noreferrer">github</a>
          <a href="#waitlist">ios waitlist</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <p className="kicker">android apk is here · ios soon</p>

        <h1 className="crayon-title" aria-label="Tappy is here">
          <span style={{ "--delay": "0ms" } as CSSProperties}>Tappy</span>
          <span style={{ "--delay": "360ms" } as CSSProperties}>is</span>
          <span style={{ "--delay": "720ms" } as CSSProperties}>here.</span>
        </h1>

        <p className="lede">
          A small phone helper you can actually try. Download the Android APK, peek at the code,
          or join the iOS waitlist.
        </p>

        <div className="actions">
          <a className="button primary" href={apkHref} download="tappy.apk">
            download apk
          </a>
          <a className="button github-button" href={githubHref} target="_blank" rel="noreferrer">
            <GitHubIcon />
            github
          </a>
          <a className="button" href="#waitlist">
            join iOS waitlist
          </a>
        </div>

        <div className="doodle" aria-hidden="true">
          <span className="doodle-phone">▯</span>
          <span className="doodle-tap one">tap</span>
          <span className="doodle-tap two">tap</span>
          <span className="doodle-arrow">↙</span>
        </div>
      </section>

      <section className="plain-section">
        <h2>what is tappy?</h2>
        <p>
          Tappy is a little Android experiment for phone actions and guidance. Not a big landing
          page thing. Just the app, the repo, and a way to hear when iOS is ready.
        </p>
      </section>

      <section id="download" className="plain-section">
        <h2>get the apk</h2>
        <p>
          The APK is built into this site at <code>/downloads/tappy.apk</code>. No separate hosting.
        </p>
        <a className="button primary" href={apkHref} download="tappy.apk">
          download tappy.apk
        </a>
      </section>

      <section id="waitlist" className="plain-section waitlist-block">
        <h2>iOS waitlist</h2>
        <p>Want Tappy on iPhone? Drop your email and I’ll ping you when there’s an iOS build.</p>
        <WaitlistForm />
      </section>

      <footer className="footer">
        <span>tappy taps. you nap.</span>
        <a href="/creator">owner waitlist</a>
      </footer>
    </main>
  );
}

function GitHubIcon() {
  return (
    <svg className="github-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.59 2 12.25c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.5v-1.75c-2.78.62-3.37-1.37-3.37-1.37-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.32 9.32 0 0 1 12 6.93c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.33.68.96.68 1.94v2.88c0 .28.18.6.69.5A10.1 10.1 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z"
      />
    </svg>
  );
}
