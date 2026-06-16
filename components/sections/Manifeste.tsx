"use client";

import { motion, useReducedMotion } from "motion/react";

const line1 = ["L'odeur", "ne", "décrit", "pas", "un", "souvenir."];
const line2 = ["Elle", "le", "rouvre,", "intact."];

export function Manifeste() {
  const reduce = useReducedMotion();

  const word = (w: string, i: number, accent = false) => (
    <motion.span
      key={`${w}-${i}`}
      initial={reduce ? false : { opacity: 0.12, y: "0.12em" }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`mr-[0.28em] inline-block ${accent ? "italic text-vetiver" : ""}`}
    >
      {w}
    </motion.span>
  );

  return (
    <section className="border-t border-line py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <h2 className="max-w-[16ch] font-display text-[clamp(2.25rem,6.5vw,5.5rem)] font-medium leading-[1.05] tracking-tight text-bone">
          <span className="block pb-1">
            {line1.map((w, i) => word(w, i))}
          </span>
          <span className="block">
            {line2.map((w, i) =>
              word(w, i + line1.length, w === "rouvre,")
            )}
          </span>
        </h2>
      </div>
    </section>
  );
}
