"use client";
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const SWEEP = { delay: 0.3, duration: 0.8, ease: "easeInOut" } as const;

/**
 * Faisceau de lampe ancré en haut de son conteneur (position: relative requis
 * sur le parent). Pensé comme fond derrière du contenu qui défile.
 * Recoloré sur l'accent vetiver, fond ink.
 */
export const LampBeam = ({ className }: { className?: string }) => {
  const reduce = useReducedMotion();
  const SRC = "top-[9rem]"; // hauteur de la source lumineuse

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0 h-screen overflow-hidden",
        className
      )}
    >
      {/* Cône volumétrique : conic doux + fondu vertical linéaire, fortement flouté */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 0.85 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={cn("absolute left-1/2 h-[80vh] w-[130vw] -translate-x-1/2", SRC)}
        style={{
          background:
            "conic-gradient(at 50% 0%, transparent 150deg, color-mix(in srgb, var(--color-vetiver) 50%, transparent) 172deg, color-mix(in srgb, var(--color-vetiver) 74%, transparent) 180deg, color-mix(in srgb, var(--color-vetiver) 50%, transparent) 188deg, transparent 210deg)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.18) 64%, transparent 90%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.18) 64%, transparent 90%)",
          filter: "blur(46px)",
        }}
      />

      {/* Lueur secondaire large et diffuse pour adoucir les bords du cône */}
      <div
        className={cn(
          "absolute left-1/2 h-[34rem] w-[44rem] -translate-x-1/2 blur-[80px]",
          SRC
        )}
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 0%, color-mix(in srgb, var(--color-vetiver) 40%, transparent), transparent 72%)",
          opacity: 0.45,
        }}
      />

      {/* Cœur lumineux concentré à la source */}
      <motion.div
        initial={reduce ? false : { opacity: 0.3, scale: 0.85 }}
        animate={reduce ? undefined : { opacity: 0.7, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn(
          "absolute left-1/2 h-40 w-[24rem] -translate-x-1/2 rounded-full bg-vetiver blur-3xl",
          SRC
        )}
      />

      {/* Barre-source futuriste */}
      <motion.div
        initial={reduce ? false : { scaleX: 0.25, opacity: 0.3 }}
        animate={reduce ? undefined : { scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "absolute left-1/2 h-px w-[34rem] -translate-x-1/2 bg-vetiver",
          SRC
        )}
        style={{
          boxShadow:
            "0 0 30px 2px color-mix(in srgb, var(--color-vetiver) 80%, transparent)",
        }}
      />
    </div>
  );
};

/**
 * Conteneur lampe plein écran d'origine (recoloré). Conservé pour réutilisation.
 */
export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative z-0 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-ink",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={SWEEP}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible from-vetiver via-transparent to-transparent text-bone [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-ink [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-ink [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={SWEEP}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] from-transparent via-transparent to-vetiver text-bone [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-ink [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-ink [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-ink blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-vetiver opacity-50 blur-3xl" />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={SWEEP}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-vetiver blur-2xl"
        />
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={SWEEP}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-vetiver"
        />
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-ink" />
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};
