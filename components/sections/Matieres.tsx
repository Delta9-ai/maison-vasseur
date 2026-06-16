import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";

type Cell = {
  nom: string;
  notes: string;
  className: string;
} & ({ kind: "image"; seed: string } | { kind: "tint"; bg: string });

const cells: Cell[] = [
  {
    nom: "Boisé",
    notes: "Cèdre, santal, vétiver, bois mouillé.",
    kind: "image",
    seed: "cedar-wood-macro-dark",
    className: "md:col-span-7 md:row-span-2 min-h-[300px] md:min-h-[420px]",
  },
  {
    nom: "Vert",
    notes: "Figue, galbanum, sève, feuille froissée.",
    kind: "image",
    seed: "green-fig-leaf-sap",
    className: "md:col-span-5 min-h-[200px]",
  },
  {
    nom: "Minéral",
    notes: "Pierre humide, béton, ambre minéral.",
    kind: "tint",
    bg: "bg-[linear-gradient(135deg,var(--color-ink-3),var(--color-ink-2))]",
    className: "md:col-span-5 min-h-[200px]",
  },
  {
    nom: "Animal",
    notes: "Musc, ambre gris, cuir doux.",
    kind: "image",
    seed: "amber-musk-skin-dark",
    className: "md:col-span-4 min-h-[220px]",
  },
  {
    nom: "Hespéridé",
    notes: "Bergamote, citron vert, néroli.",
    kind: "tint",
    bg: "bg-[radial-gradient(120%_120%_at_85%_15%,var(--color-vetiver-deep),var(--color-ink-2)_60%)]",
    className: "md:col-span-8 min-h-[220px]",
  },
];

export function Matieres() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <h2 className="max-w-[20ch] font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-bone">
          Les familles qu'elle travaille
        </h2>

        <div className="mt-12 grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-4 md:mt-16 md:grid-cols-12">
          {cells.map((c, i) => (
            <Reveal
              key={c.nom}
              delay={(i % 3) * 0.06}
              className={`group relative overflow-hidden ${c.className}`}
            >
              {c.kind === "image" ? (
                <Image
                  src={`https://picsum.photos/seed/${c.seed}/1000/1000`}
                  alt={`${c.nom}. ${c.notes}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale-[0.4] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className={`absolute inset-0 ${c.bg}`} />
              )}
              {c.kind === "image" && (
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
              )}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="font-display text-2xl font-medium tracking-tight text-bone md:text-3xl">
                  {c.nom}
                </h3>
                <p className="mt-2 max-w-[34ch] text-sm leading-snug text-bone/80">
                  {c.notes}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
