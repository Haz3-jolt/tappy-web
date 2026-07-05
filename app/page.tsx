import WaitlistForm from "../components/WaitlistForm";

const apkHref = process.env.NEXT_PUBLIC_APK_URL?.trim() || "/downloads/tappy.apk";
const apkIsStub = apkHref === "/download" || apkHref === "#";

export default function Home() {
  return (
    <main className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Tappy home">
          <span className="brand-mark">
            <img src="/tappy-glyph.png" alt="" />
          </span>
          <span className="brand-word">TAPPY</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#waitlist">Waitlist</a>
          <a href="/creator">Creator</a>
        </nav>
      </header>

      <section id="top" className="hero section-grid">
        <div className="hero-copy">
          <p className="eyebrow">ANDROID APK · PRIVATE DROP</p>
          <h1>Your phone just learned how to help.</h1>
          <p className="hero-lede">
            Tappy is a mobile AI companion for real phone work. Ask once. It taps, types, scrolls,
            and teaches across apps.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={apkHref}>
              Download APK{apkIsStub ? " (soon)" : ""}
              <span aria-hidden="true">→</span>
            </a>
            <a className="button button-secondary" href="#waitlist">
              Join waitlist
            </a>
          </div>
          <p className="microcopy">
            APK is wired at <code>public/downloads/tappy.apk</code>. Android may ask you to allow installs
            from your browser.
          </p>
        </div>

        <div className="hero-art" aria-label="Tappy app preview">
          <div className="calibration calibration-one" />
          <div className="calibration calibration-two" />
          <div className="gold-leaf" />
          <div className="phone-frame">
            <div className="phone-chrome">
              <span />
              <span />
              <span />
              <b>tappy.ai</b>
            </div>
            <div className="phone-screen">
              <div className="phone-status">
                <span>9:41</span>
                <span>● ● ●</span>
              </div>
              <div className="app-grid">
                <span>Ride</span>
                <span>Text</span>
                <span>Music</span>
                <span>Teach</span>
              </div>
              <div className="assistant-card">
                <img src="/tappy-glyph-final.png" alt="" />
                <div>
                  <p>Tappy</p>
                  <strong>Book a ride, text Mom, play focus music.</strong>
                </div>
              </div>
              <div className="task-rail">
                <span>Tap</span>
                <span>Type</span>
                <span>Scroll</span>
                <span>Done</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="ks-section">
        <div className="section-head">
          <p className="eyebrow">WHY TAPPY</p>
          <h2>Not another chatbot. A phone operator.</h2>
          <p>
            Simple promise, sharp interface: Tappy turns everyday phone tasks into one guided action.
          </p>
        </div>

        <div className="bento-grid">
          <article className="bento-card wide">
            <p className="card-kicker">Ask once</p>
            <h3>Give Tappy the outcome.</h3>
            <p>Ride booked, message sent, playlist started — without bouncing between apps.</p>
          </article>
          <article className="bento-card">
            <p className="card-kicker patina">In context</p>
            <h3>Learns where you are.</h3>
            <p>It can explain the next tap while you stay inside the app you are using.</p>
          </article>
          <article className="bento-card">
            <p className="card-kicker">Android first</p>
            <h3>APK drop.</h3>
            <p>The download button now points directly to the APK in this repo.</p>
          </article>
        </div>
      </section>

      <section id="download" className="download-strip">
        <div>
          <p className="eyebrow">DOWNLOAD</p>
          <h2>APK link is live.</h2>
          <p>The current build points directly to <code>/downloads/tappy.apk</code>.</p>
        </div>
        <a className="button button-primary" href={apkHref}>
          Download APK{apkIsStub ? " (stub)" : ""}
        </a>
      </section>

      <section id="waitlist" className="waitlist-section section-grid">
        <div>
          <p className="eyebrow">WAITLIST</p>
          <h2>Get the first APK drop.</h2>
          <p>
            Leave your email and you will be first to know when Tappy is ready to install.
          </p>
        </div>
        <WaitlistForm />
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Tappy</span>
        <a href="/creator">Creator waitlist export</a>
      </footer>
    </main>
  );
}
