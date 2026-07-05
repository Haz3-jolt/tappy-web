import Script from "next/script";
import DownloadButton from "../components/DownloadButton";
import FeedbackForm from "../components/FeedbackForm";
import WaitlistForm from "../components/WaitlistForm";

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
          <a href="#demo">demo</a>
          <a href="#download">download</a>
          <a href={githubHref} target="_blank" rel="noreferrer">github</a>
          <a href="#waitlist">ios waitlist</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <p className="kicker">android apk is here · ios soon</p>

        <h1 className="hero-title">Tappy is here.</h1>

        <p className="lede">
          A companion for your phone. Talk to it, learn from it, and let it help with the little
          day-to-day stuff on your screen.
        </p>

        <div className="actions">
          <DownloadButton label="download" />
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
          Tappy is a phone companion that teaches you things, guides you in apps, and helps with
          day-to-day tasks. The idea is simple: talk to your phone and have it help you do stuff.
        </p>
      </section>

      <section id="demo" className="plain-section tweet-section">
        <h2>see it move</h2>
        <p>Quick demo from Aditya.</p>
        <div className="tweet-shell">
          <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
            <a href="https://twitter.com/adityapeela/status/2073634152646345199">
              Watch the Tappy demo on X
            </a>
          </blockquote>
        </div>
      </section>

      <section id="download" className="plain-section">
        <h2>get the apk</h2>
        <p>
          The Android build is ready here.
        </p>
        <DownloadButton label="download" />
        <div className="feedback-block">
          <h3>feedback</h3>
          <FeedbackForm />
        </div>
      </section>

      <section id="waitlist" className="plain-section waitlist-block">
        <h2>iOS waitlist</h2>
        <p>Want Tappy on iPhone? Drop your email and I’ll ping you when there’s an iOS build.</p>
        <WaitlistForm />
      </section>

      <footer className="footer">
        <span>tappy taps. you nap.</span>
        <a href={githubHref} target="_blank" rel="noreferrer">github</a>
      </footer>
      <Script id="twitter-widgets" src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
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
