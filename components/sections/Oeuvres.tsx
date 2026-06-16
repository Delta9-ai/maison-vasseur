import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { oeuvres } from "@/lib/oeuvres";
import { ScrollReel, type ScrollReelItem } from "@/components/ui/scroll-reel";
import { Reveal } from "@/components/motion/Reveal";

const reelItems: ScrollReelItem[] = oeuvres.map((o) => ({
  image: `https://picsum.photos/seed/${o.seed}/600/600`,
  alt: `${o.titre}, ${o.annee}. ${o.ligne}`,
  title: o.titre,
  caption: o.ligne,
  overline: `Œuvre ${o.num} · ${o.annee}`,
}));

export function Oeuvres() {
  return (
    <section id="oeuvres" className="border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] font-medium leading-none tracking-tight text-bone">
          Œuvres
        </h2>

        <Reveal className="mt-14 flex justify-center md:mt-20">
          <ScrollReel items={reelItems} />
        </Reveal>

        <div className="mt-16 flex justify-end">
          <a
            href="/oeuvres"
            className="group inline-flex items-center gap-2 text-sm text-bone-dim transition-colors hover:text-vetiver"
          >
            Voir toutes les œuvres
            <ArrowUpRight
              size={16}
              weight="regular"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
