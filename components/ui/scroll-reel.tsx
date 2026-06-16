"use client";

import * as React from "react";

/* ----------------------------------------------------------------
 * ScrollReel
 *
 * Reel à contre-rotation : la colonne centrale est une vraie liste
 * verticale de portraits qui se décale d'un "pas" par étape ; les
 * colonnes latérales tournent en sens inverse. Le texte monte
 * caractère par caractère ; l'ancien bloc sort en entier avant que
 * les nouveaux caractères s'élèvent à leur tour.
 *
 * Recoloré sur l'identité du site : ink (fond), vetiver (accent),
 * bone (texte). Angles vifs pour coller au reste (radius 0).
 * ---------------------------------------------------------------- */

export interface ScrollReelItem {
  /** Image du portrait/œuvre */
  image: string;
  /** Texte alternatif */
  alt?: string;
  /** Titre mis en avant (gros, police display) */
  title: string;
  /** Légende sous le titre */
  caption: string;
  /** Surtitre (numéro, année…) affiché en vetiver */
  overline?: string;
}

export interface ScrollReelProps {
  items: ScrollReelItem[];
  /** Décalage par caractère en ms (défaut 6) */
  charStaggerMs?: number;
  className?: string;
}

/* Géométrie : pas entre les centres de la colonne centrale.
 * CELL = taille d'une photo ; agrandie pour bien observer les œuvres.
 * Le pas se recalcule automatiquement à partir de CELL + GAP. */
const CELL = 280;
const GAP = 10;
const STEP = 3 * (CELL + GAP);

const EXIT_MS = 240; // ancien texte démonté
const SLIDE_MS = 800; // durée du glissement + verrou d'interaction

const EASE_INOUT = "cubic-bezier(0.65,0,0.35,1)";

const TITLE_CLASSES =
  "m-0 font-display text-2xl font-medium leading-[1.15] tracking-tight text-bone sm:text-[28px]";
const CAPTION_CLASSES =
  "m-0 text-sm leading-relaxed text-bone-dim sm:text-[0.95rem]";

const FEATURED_SHADOW =
  "0 2px 6px rgba(0,0,0,0.45), 0 12px 30px -6px rgba(0,0,0,0.55)";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* Cellule floutée de remplissage */
function Cell() {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 border border-line bg-gradient-to-b from-ink-3 to-ink-2 blur-[1px] shadow-[inset_0_1px_0_rgba(236,231,221,0.04)]"
      style={{ width: CELL, height: CELL }}
    />
  );
}

/* Portrait mis en avant + désaturation douce + reflet vetiver */
function Featured({ src, alt }: { src: string; alt?: string }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden bg-ink-2 ring-1 ring-bone/10"
      style={{ width: CELL, height: CELL, boxShadow: FEATURED_SHADOW }}
    >
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%] grayscale-[0.4]"
      />
      {/* Reflet diagonal vetiver */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] blur-[6px] mix-blend-overlay"
        style={{
          background:
            "linear-gradient(220.99deg, rgba(58,143,99,0) 32%, rgba(58,143,99,0.9) 41%, rgba(120,200,160,0.8) 47%, rgba(58,143,99,0.5) 54%, rgba(58,143,99,0) 65%)",
        }}
      />
    </div>
  );
}

/* Découpe par caractère. Les espaces restent entre les spans de mots
 * comme nœuds texte pour préserver le retour à la ligne naturel. Chaque
 * caractère monte avec un animation-delay inline ; pendant la sortie,
 * l'animation est retirée pour stopper les montées en cours. */
function Chars({
  text,
  startIndex,
  staggerMs,
}: {
  text: string;
  startIndex: number;
  staggerMs: number;
}) {
  let idx = startIndex;
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => {
        const wordSpan = (
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs;
              idx++;
              return (
                <span
                  key={ci}
                  className="scroll-reel-char"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) idx++;
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

export function ScrollReel({
  items,
  charStaggerMs = 6,
  className,
}: ScrollReelProps) {
  /* L'état de navigation et l'état d'affichage sont séparés pour que le
   * bloc sortant et le bloc entrant ne soient jamais rendus ensemble. */
  const [index, setIndex] = React.useState(0);
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const animating = React.useRef(false);
  const timeouts = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const count = items.length;

  React.useEffect(() => {
    /* Active les transitions de colonnes seulement après le premier
     * paint pour que le reel apparaisse à sa position de départ. */
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true))
    );
    return () => {
      cancelAnimationFrame(raf);
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  const paginate = React.useCallback(
    (dir: 1 | -1) => {
      if (animating.current) return;
      const next = index + dir;
      if (next < 0 || next >= count) return;
      animating.current = true;

      setIndex(next);
      setExiting(true);

      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(next);
          setExiting(false);
        }, EXIT_MS)
      );
      timeouts.current.push(
        setTimeout(() => {
          animating.current = false;
        }, SLIDE_MS)
      );
    },
    [index, count]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      paginate(-1);
    }
  };

  /* Colonne centrale : 3 cellules d'amorce, puis portrait + 2 cellules
   * entre chaque item, puis 3 cellules de fin. */
  const middleItems = React.useMemo(() => {
    const list: Array<{ type: "cell" } | { type: "featured"; i: number }> = [];
    for (let i = 0; i < 3; i++) list.push({ type: "cell" });
    items.forEach((_, i) => {
      list.push({ type: "featured", i });
      if (i < count - 1) {
        list.push({ type: "cell" }, { type: "cell" });
      }
    });
    for (let i = 0; i < 3; i++) list.push({ type: "cell" });
    return list;
  }, [items, count]);

  const sideCellCount = 4 + 2 * count;
  const centerIdx = (count - 1) / 2;
  const middleY = (centerIdx - index) * STEP;
  const sideY = -middleY;

  const colStyle = (y: number): React.CSSProperties => ({
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE_INOUT}` : "none",
  });

  const current = items[displayIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Œuvres"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        "relative flex w-full max-w-[1160px] flex-col items-stretch gap-2.5 overflow-hidden border border-line bg-ink-2 outline-none focus-visible:ring-2 focus-visible:ring-vetiver md:min-h-[440px] md:flex-row",
        className
      )}
    >
      {/* Reel — photos à gauche */}
      <div
        aria-hidden="true"
        className="relative h-[360px] w-full shrink-0 self-stretch overflow-hidden md:h-auto md:w-[480px]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          {/* Colonne gauche */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>

          {/* Colonne centrale */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(middleY)}
          >
            {middleItems.map((item, i) =>
              item.type === "featured" ? (
                <Featured
                  key={i}
                  src={items[item.i].image}
                  alt={items[item.i].alt}
                />
              ) : (
                <Cell key={i} />
              )
            )}
          </div>

          {/* Colonne droite */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Texte — à droite */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch px-6 py-7 md:py-10">
        <div className="flex flex-col gap-4">
          {current.overline && (
            <span className="text-[0.7rem] uppercase tracking-[0.18em] text-vetiver">
              {current.overline}
            </span>
          )}

          {/* Scène texte */}
          <div
            className="relative w-full max-w-[420px] overflow-hidden"
            aria-live="polite"
          >
            {/* Copie invisible en flux : dimensionne la scène au texte
              * courant à toute largeur, le texte qui passe à la ligne ne
              * sera jamais coupé. */}
            <div
              aria-hidden="true"
              className="invisible flex min-h-[150px] flex-col gap-[19px]"
            >
              <p className={TITLE_CLASSES}>{current.title}</p>
              <p className={CAPTION_CLASSES}>{current.caption}</p>
            </div>
            <div
              key={displayIndex}
              className={cn(
                "absolute inset-x-0 top-0 flex flex-col gap-[19px] will-change-[transform,opacity]",
                exiting && "scroll-reel-exit"
              )}
            >
              <p className={TITLE_CLASSES}>
                <Chars
                  text={current.title}
                  startIndex={0}
                  staggerMs={charStaggerMs}
                />
              </p>
              <p className={CAPTION_CLASSES}>
                <Chars
                  text={current.caption}
                  startIndex={current.title.length + 6}
                  staggerMs={charStaggerMs}
                />
              </p>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="mt-8 flex items-center gap-2 md:mt-0">
          <button
            type="button"
            onClick={() => paginate(-1)}
            disabled={index === 0}
            aria-label="Œuvre précédente"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-bone/20 bg-transparent p-0 text-bone transition-[opacity,transform,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:enabled:scale-[1.08] hover:enabled:border-vetiver active:enabled:scale-[0.94] disabled:cursor-default disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vetiver"
          >
            <svg
              className="h-3.5 w-3.5 opacity-80"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.5 2.5 3.5 6l4 3.5" />
            </svg>
          </button>
          <span className="px-1 text-xs tabular-nums text-bone-faint">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => paginate(1)}
            disabled={index === count - 1}
            aria-label="Œuvre suivante"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-bone/20 bg-transparent p-0 text-bone transition-[opacity,transform,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:enabled:scale-[1.08] hover:enabled:border-vetiver active:enabled:scale-[0.94] disabled:cursor-default disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vetiver"
          >
            <svg
              className="h-3.5 w-3.5 opacity-80"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m4.5 2.5 4 3.5-4 3.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScrollReel;
