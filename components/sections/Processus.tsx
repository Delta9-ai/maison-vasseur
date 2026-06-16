"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { LampBeam } from "@/components/ui/lamp";

gsap.registerPlugin(ScrollTrigger);

const etapes = [
  {
    verbe: "Capter",
    texte:
      "Sentir un lieu jusqu'à pouvoir le réciter. Carnet, prélèvements, mémoire de l'air à un instant précis.",
  },
  {
    verbe: "Décomposer",
    texte:
      "Isoler chaque matière. Nommer ce qui, dans une odeur, faisait vraiment l'instant, et ce qui n'était que décor.",
  },
  {
    verbe: "Recomposer",
    texte:
      "Construire l'accord. Doser, rater, recommencer, jusqu'à ce que le lieu revienne sans qu'on l'ait nommé.",
  },
  {
    verbe: "Laisser reposer",
    texte:
      "Le parfum mûrit des semaines. On ne juge rien avant qu'il se soit tu, puis qu'il reparle autrement.",
  },
];

export function Processus() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);

  const Intro = (
    <div className="flex max-w-[34ch] flex-col justify-center">
      <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.98] tracking-tight text-bone">
        Comment naît un parfum
      </h2>
      <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-bone-dim">
        Quatre gestes, entre la première odeur captée et l'œuvre qui repose.
      </p>
    </div>
  );

  const Etape = (e: (typeof etapes)[number]) => (
    <div className="flex flex-col items-center">
      <h3 className="whitespace-nowrap font-display text-[clamp(2.25rem,5vw,4.25rem)] font-medium leading-none tracking-tight text-bone">
        {e.verbe}
      </h3>
      <p className="mt-7 max-w-[36ch] text-lg leading-relaxed text-bone-dim">
        {e.texte}
      </p>
    </div>
  );

  if (reduce) {
    return (
      <section
        id="processus"
        className="relative border-t border-line py-24 md:py-32"
      >
        <LampBeam />
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8">
          {Intro}
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            {etapes.map((e) => (
              <div key={e.verbe}>{Etape(e)}</div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="processus"
      ref={wrap}
      className="relative overflow-hidden border-t border-line"
    >
      <LampBeam />
      <div ref={track} className="relative z-10 flex h-[100dvh] w-max">
        <div className="flex h-full w-screen shrink-0 items-center justify-center px-4 text-center md:px-[8vw] [&_p]:mx-auto">
          {Intro}
        </div>
        {etapes.map((e) => (
          <div
            key={e.verbe}
            className="flex h-full w-screen shrink-0 items-center justify-center px-4 text-center md:px-[8vw] [&_p]:mx-auto"
          >
            {Etape(e)}
          </div>
        ))}
      </div>
    </section>
  );
}
