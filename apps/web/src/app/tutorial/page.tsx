"use client";

import Link from "next/link";
import { useState } from "react";

const demo = [
  { id: "a", label: "same shape", ok: true },
  { id: "b", label: "same color", ok: true },
  { id: "c", label: "two traits", ok: false },
];

export default function TutorialPage() {
  const [active, setActive] = useState(0);

  return (
    <main className="page">
      <p className="eyebrow">Quick tutorial</p>
      <h1>Neighbors share exactly one trait.</h1>
      <p className="tagline">
        Shape, color, fill, or count — pick pairs that match once, not twice.
      </p>

      <div className="tutorial-demo" data-testid="tutorial-demo">
        {demo.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`tile ${active === index ? "tile-selected" : ""}`}
            style={{ ["--tile-color" as string]: "var(--tile-teal)" }}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            <span className="shape shape-circle" aria-hidden="true" />
            <span className="marks">{item.ok ? "✓" : "×"}</span>
          </button>
        ))}
      </div>
      <p className="meta" data-testid="tutorial-copy">
        Example pair: <strong>{demo[active]?.label}</strong> —{" "}
        {demo[active]?.ok ? "compatible" : "not compatible"}.
      </p>

      <p>
        <Link className="primary-cta" href="/play" data-testid="cta-start-ring">
          Start today&apos;s ring
        </Link>
      </p>
    </main>
  );
}
