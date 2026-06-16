"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ShaderAnimation } from "@/components/ui/shader-lines";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pt-24"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease }}
        className="absolute inset-0 -z-10 bg-ink"
      >
        {reduce ? (
          <Image
            src="https://picsum.photos/seed/slow-smoke-dark-resin/1920/1200"
            alt="Volute de fumée lente sur fond sombre, matière première d'un parfum."
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <ShaderAnimation />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />
      </motion.div>

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-20 md:px-8 md:pb-28">
        <div className="max-w-[52rem]">
          <h1 className="font-display text-[clamp(3rem,9vw,6.75rem)] font-medium leading-[0.92] tracking-tight text-bone">
            <motion.span className="block" {...rise(0.15)}>
              Des lieux,
            </motion.span>
            <motion.span className="block" {...rise(0.3)}>
              en parfum.
            </motion.span>
          </h1>
        </div>

        <motion.p
          className="mt-8 max-w-[52ch] text-lg leading-relaxed text-bone-dim"
          {...rise(0.55)}
        >
          Margaux Vasseur compose des œuvres olfactives, portraits d'un endroit
          précis, d'une saison, d'un souvenir. Atelier à Marseille.
        </motion.p>

        <motion.div className="mt-10" {...rise(0.7)}>
          <MagneticButton href="#contact">Écrire à l'atelier</MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
