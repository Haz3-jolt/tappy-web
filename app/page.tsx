import WaitlistForm from "../components/WaitlistForm";

const apkHref = "/downloads/tappy.apk";

export default function Home() {
  return (
    <main className="page">
      <header className="topbar">
        <a className="logo" href="#top" aria-label="Tappy home">
          <img src="/tappy-glyph.png" alt="" />
          <span>Tappy</span>
        </a>
        <nav aria-label="Main navigation">
          <a href={apkHref} download="tappy.apk">download</a>
          <a href="#waitlist">waitlist</a>
          <a href="/creator">creator</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <p className="kicker">android test build · 1.5mb · apk included</p>
        <h1>Tappy helps your phone tap stuff.</h1>
        <p className="lede">
          A tiny Android helper for trying phone actions. Download the APK here, or leave your email
          if you want the next build.
        </p>

        <div className="actions">
          <a className="button primary" href={apkHref} download="tappy.apk">
            download tappy.apk
          </a>
          <a className="button" href="#waitlist">
            join waitlist
          </a>
        </div>

        <p className="note">
          The APK is served directly from this site at <code>/downloads/tappy.apk</code>.
        </p>

        <div className="tap-doodle" aria-hidden="true">
          <span>tap</span>
          <span>tap</span>
          <span>tap</span>
        </div>
      </section>

      <section className="plain-section">
        <h2>what is it?</h2>
        <p>
          Tappy is an early Android build. It is for testing phone-action help and in-app guidance.
          No giant manifesto. No fake launch language. Just the app and a list.
        </p>
      </section>

      <section id="download" className="plain-section">
        <h2>apk</h2>
        <p>
          The file is in the repo at <code>public/downloads/tappy.apk</code>, so Vercel can serve it like
          any other static file.
        </p>
        <a className="button primary" href={apkHref} download="tappy.apk">
          download the apk
        </a>
      </section>

      <section id="waitlist" className="plain-section waitlist-block">
        <h2>waitlist</h2>
        <p>Want the next build? Put your email here.</p>
        <WaitlistForm />
      </section>

      <footer className="footer">
        <span>made for people who tap buttons</span>
        <a href="/creator">export waitlist</a>
      </footer>
    </main>
  );
}
