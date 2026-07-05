import type { CSSProperties } from "react";
import WaitlistForm from "../components/WaitlistForm";

const apkHref = "/downloads/tappy.apk";

export default function Home() {
  return (
    <main className="site-shell">
      <div className="bubble-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Tappy home">
          <span className="brand-mark">
            <img src="/tappy-glyph.png" alt="" />
          </span>
          <span className="brand-word">TAPPY</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#download">APK</a>
          <a href="#features">Chaos menu</a>
          <a href="#waitlist">Waitlist</a>
          <a href="/creator">Creator</a>
        </nav>
      </header>

      <section id="top" className="hero section-grid">
        <div className="hero-copy">
          <p className="eyebrow">ANDROID TEST BUILD · 1.5 MB · BAKED INTO THIS SITE</p>
          <h1>Your phone got a tiny sidekick.</h1>
          <p className="hero-lede">
            Tappy is the little pink-purple helper that taps through phone chores with you — not a
            solemn chatbot in a trench coat.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={apkHref} download="tappy.apk">
              Download the APK
              <span aria-hidden="true">↯</span>
            </a>
            <a className="button button-secondary" href="#waitlist">
              Ping me later
            </a>
          </div>
          <div className="sticker-row" aria-label="Tappy highlights">
            <span>tap tap</span>
            <span>no app-store hunt</span>
            <span>screen buddy</span>
            <span>1.5 MB snack</span>
          </div>
        </div>

        <div className="hero-art" aria-label="Playful Tappy app preview">
          <div className="sticker sticker-hot">apk inside</div>
          <div className="sticker sticker-wow">tiny but busy</div>
          <div className="mascot-orbit" aria-hidden="true">
            <span>✦</span>
            <span>♡</span>
            <span>✹</span>
          </div>
          <div className="phone-frame">
            <div className="phone-top">
              <span className="camera" />
              <span>tappy mode</span>
              <b>91%</b>
            </div>
            <div className="phone-screen">
              <div className="face-card">
                <img src="/tappy-glyph-final.png" alt="" />
                <div className="face-eyes" aria-hidden="true">
                  <span />
                  <span />
                </div>
              </div>
              <div className="chat-bubble bubble-left">what are we doing?</div>
              <div className="chat-bubble bubble-right">book ride + text mom pls</div>
              <div className="action-stack">
                <span style={{ "--i": 0 } as CSSProperties}>opens app</span>
                <span style={{ "--i": 1 } as CSSProperties}>finds button</span>
                <span style={{ "--i": 2 } as CSSProperties}>tap tap</span>
                <span style={{ "--i": 3 } as CSSProperties}>done</span>
              </div>
            </div>
          </div>
          <div className="cursor-pop" aria-hidden="true">☝︎</div>
        </div>
      </section>

      <section id="features" className="feature-section">
        <div className="section-head">
          <p className="eyebrow">WHAT IT DOES, NO TED TALK</p>
          <h2>Less “future of everything.” More “please press the right button.”</h2>
        </div>

        <div className="bento-grid">
          <article className="bento-card wide">
            <p className="card-kicker">Phone chores</p>
            <h3>Ask for the outcome.</h3>
            <p>Ride, message, music, settings — Tappy is built around doing the annoying little steps.</p>
          </article>
          <article className="bento-card tilt-left">
            <p className="card-kicker">Explainy bits</p>
            <h3>It can teach in place.</h3>
            <p>Stuck in an app? Tappy points at the next thing instead of sending you to a blog from 2018.</p>
          </article>
          <article className="bento-card tilt-right">
            <p className="card-kicker">APK first</p>
            <h3>No separate hosting.</h3>
            <p>The APK lives right here at <code>public/downloads/tappy.apk</code>. Tiny file, zero treasure map.</p>
          </article>
        </div>
      </section>

      <section id="download" className="download-strip">
        <div>
          <p className="eyebrow">DOWNLOAD</p>
          <h2>The APK is embedded in the site.</h2>
          <p>
            Current file: <code>/downloads/tappy.apk</code>. It ships from this Next.js repo as a normal static
            file — no Dropbox, no Drive, no mystery CDN.
          </p>
        </div>
        <a className="button button-primary" href={apkHref} download="tappy.apk">
          Grab tappy.apk
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section id="waitlist" className="waitlist-section section-grid">
        <div>
          <p className="eyebrow">WAITLIST</p>
          <h2>Want the next weird little build?</h2>
          <p>
            Drop your email. I’ll only use it for Tappy updates — no “synergy newsletter,” promise.
          </p>
        </div>
        <WaitlistForm />
      </section>

      <footer className="site-footer">
        <span>Made with questionable amounts of pink.</span>
        <a href="/creator">Creator waitlist export</a>
      </footer>
    </main>
  );
}
