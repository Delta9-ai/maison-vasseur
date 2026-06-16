import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { oeuvres } from "@/lib/oeuvres";

export const metadata: Metadata = {
  title: "Œuvres complètes, Maison Vasseur",
  description:
    "Le catalogue des parfums de Margaux Vasseur, avec leur pyramide olfactive.",
};

function Accord({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="flex gap-4 border-t border-line py-3">
      <span className="w-12 shrink-0 pt-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-vetiver">
        {label}
      </span>
      <span className="text-sm leading-snug text-bone/85">
        {notes.join(", ")}
      </span>
    </div>
  );
}

export default function OeuvresPage() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm text-bone-dim transition-colors hover:text-vetiver"
      >
        <ArrowLeft
          size={16}
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        />
        Maison Vasseur
      </Link>

      <h1 className="mt-10 max-w-[16ch] font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.98] tracking-tight text-bone">
        Œuvres complètes
      </h1>

      <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
        {oeuvres.map((o) => (
          <article key={o.num} id={o.num} className="scroll-mt-24">
            <div className="relative aspect-[4/3] overflow-hidden bg-ink-2">
              <Image
                src={`https://picsum.photos/seed/${o.seed}/1200/900`}
                alt={`${o.titre}, ${o.annee}. ${o.ligne}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale-[0.35]"
              />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl font-medium tracking-tight text-bone">
                <span className="mr-2 text-bone-faint">{o.num}</span>
                {o.titre}
              </h2>
              <span className="shrink-0 text-sm text-bone-dim">{o.annee}</span>
            </div>
            <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-bone-dim">
              {o.ligne}
            </p>
            <div className="mt-5">
              <Accord label="Tête" notes={o.tete} />
              <Accord label="Cœur" notes={o.coeur} />
              <Accord label="Fond" notes={o.fond} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
