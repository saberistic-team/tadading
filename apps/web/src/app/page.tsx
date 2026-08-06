import Link from "next/link";
import { getPublicBrand } from "../lib/brand";

export default function HomePage() {
  const brand = getPublicBrand();

  return (
    <main className="shell">
      <p className="eyebrow">{brand.brandName}</p>
      <h1>Your daily tiny win is ready.</h1>
      <p className="tagline">{brand.tagline}</p>
      <p className="meta">
        Swap eight cheerful tiles until every neighbor fits. Close the ring,
        hear the ding, keep the streak.
      </p>
      <p>
        <Link className="primary-cta" href="/tutorial" data-testid="cta-play">
          Play today&apos;s {brand.brandName}
        </Link>
      </p>
      <p className="cta-note">
        No account needed. Play as a guest in under three minutes.
      </p>
    </main>
  );
}
