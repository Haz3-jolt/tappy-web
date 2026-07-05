import Link from "next/link";
import CreatorPanel from "../../components/CreatorPanel";

export const dynamic = "force-dynamic";

export default function CreatorPage() {
  return (
    <main className="mini-page creator-page">
      <section className="mini-card creator-card">
        <Link className="logo mini-brand" href="/" aria-label="Tappy home">
          <img src="/tappy-glyph.png" alt="" />
          <span>Tappy</span>
        </Link>
        <p className="eyebrow">OWNER VIEW</p>
        <h1>Waitlist.</h1>
        <p>
          Enter your <code>ADMIN_SECRET</code> to view signups or export a CSV.
        </p>
        <CreatorPanel />
      </section>
    </main>
  );
}
