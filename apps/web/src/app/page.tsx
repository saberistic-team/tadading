import { getPublicBrand } from "../lib/brand";

export default function HomePage() {
  const brand = getPublicBrand();
  const apiOrigin =
    process.env.NEXT_PUBLIC_API_ORIGIN ??
    process.env.API_ORIGIN ??
    "http://localhost:3101";

  return (
    <main className="shell">
      <p className="eyebrow">Phase 0 foundation</p>
      <h1>{brand.brandName}</h1>
      <p className="tagline">{brand.tagline}</p>
      <p className="meta">
        Domain config: <code>{brand.publicDomain}</code> · Social:{" "}
        <code>@{brand.socialHandle}</code>
      </p>
      <p className="meta">
        API origin: <code>{apiOrigin}</code>
      </p>
      <p className="cta-note">
        Playable puzzle arrives in Phase 1. Health endpoints are live on the API
        and worker today.
      </p>
    </main>
  );
}
