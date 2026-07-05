import Link from "next/link";
import CreatorPanel from "../../components/CreatorPanel";

export const dynamic = "force-dynamic";

export default function CreatorPage() {
  return (
    <main className="mini-page creator-page">
      <div className="grain" aria-hidden="true" />
      <section className="mini-card creator-card">
        <Link className="brand mini-brand" href="/" aria-label="Tappy home">
          <span className="brand-mark">
            <img src="/tappy-glyph.png" alt="" />
          </span>
          <span className="brand-word">TAPPY</span>
        </Link>
        <p className="eyebrow">CREATOR ACCESS</p>
        <h1>Waitlisted users.</h1>
        <p>
          Set <code>ADMIN_SECRET</code> in Vercel, then use that secret here to view users or export a CSV.
        </p>
        <CreatorPanel />
      </section>
    </main>
  );
}
