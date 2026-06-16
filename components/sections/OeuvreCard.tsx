"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import type { Oeuvre } from "@/lib/oeuvres";

const ratioClass: Record<Oeuvre["ratio"], string> = {
  portrait: "aspect-[3/4]",
  paysage: "aspect-[16/10]",
  carre: "aspect-square",
};

function Accord({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="flex gap-4 border-t border-bone/15 py-2.5 first:border-t-0">
      <span className="w-12 shrink-0 pt-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-vetiver">
        {label}
      </span>
      <span className="text-sm leading-snug text-bone/85">
        {notes.join(", ")}
      </span>
    </div>
  );
}

export function OeuvreCard({ o }: { o: Oeuvre }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 18,
  });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={`/oeuvres#${o.num}`}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group block [transform-style:preserve-3d]"
    >
      <div className={`relative overflow-hidden bg-ink-2 ${ratioClass[o.ratio]}`}>
        <Image
          src={`https://picsum.photos/seed/${o.seed}/1000/1000`}
          alt={`${o.titre}, ${o.annee}. ${o.ligne}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover grayscale-[0.45] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0 translate-y-3 bg-ink/90 px-5 py-5 opacity-0 backdrop-blur-md transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <Accord label="Tête" notes={o.tete} />
          <Accord label="Cœur" notes={o.coeur} />
          <Accord label="Fond" notes={o.fond} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl font-medium tracking-tight text-bone transition-colors group-hover:text-vetiver md:text-[1.7rem]">
          <span className="mr-2 text-bone-faint">{o.num}</span>
          {o.titre}
        </h3>
        <span className="shrink-0 text-sm text-bone-dim">{o.annee}</span>
      </div>
      <p className="mt-1.5 max-w-[40ch] text-sm leading-relaxed text-bone-dim">
        {o.ligne}
      </p>
    </motion.a>
  );
}
