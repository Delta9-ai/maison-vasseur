"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TextScramble } from "@/components/ui/text-scramble";

const links = [
  { label: "Œuvres", href: "#oeuvres" },
  { label: "Processus", href: "#processus" },
  { label: "L'artiste", href: "#artiste" },
  { label: "Expositions", href: "#expositions" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 24));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "border-b border-line bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-4 md:px-8">
        <a
          href="#top"
          className="font-display text-[1.05rem] font-medium tracking-tight text-bone"
        >
          Maison Vasseur
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} aria-label={l.label}>
              <TextScramble text={l.label} />
            </a>
          ))}
        </nav>

        <MagneticButton href="#contact" className="px-5 py-2.5 text-sm">
          Écrire à l'atelier
        </MagneticButton>
      </div>
    </header>
  );
}
