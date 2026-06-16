"use client";

import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import DottedMap from "dotted-map";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
  showLabels?: boolean;
  labelClassName?: string;
  animationDuration?: number;
  loop?: boolean;
}

// Étiquette de ville rendue en SVG natif (<rect> + <text>) plutôt qu'en
// <foreignObject>. Safari positionne mal le foreignObject dans un viewBox
// mis à l'échelle (preserveAspectRatio), ce qui décalait les noms par rapport
// aux points. Le texte SVG natif partage exactement le même repère que les
// cercles, donc l'alignement est identique sur tous les navigateurs.
function CityLabel({
  cx,
  cy,
  label,
}: {
  cx: number;
  cy: number;
  label: string;
}) {
  const height = 22;
  const charWidth = 6.2; // largeur moyenne par caractère à fontSize 11
  const width = label.length * charWidth + 18;
  const top = cy - 34; // pille au-dessus du point, comme l'ancien foreignObject
  return (
    <>
      <rect
        x={cx - width / 2}
        y={top}
        width={width}
        height={height}
        rx={height / 2}
        fill="rgba(11,11,12,0.9)"
        stroke="#2a2a2e"
        strokeWidth={1}
      />
      <text
        x={cx}
        y={top + height / 2 + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ece7dd"
        fontSize={11}
        fontWeight={500}
        letterSpacing={0.3}
      >
        {label}
      </text>
    </>
  );
}

// Recoloré sur la palette du site (fond ink, accent vetiver, points bone).
export function WorldMap({
  dots = [],
  lineColor = "#3a8f63",
  showLabels = true,
  labelClassName = "",
  animationDuration = 2,
  loop = true,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const isLoop = loop && !reduce;

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: "#3a8f6338",
        shape: "circle",
        backgroundColor: "#0b0b0c",
      }),
    [map]
  );

  // Projection alignée sur le fond dotted-map : getPin() renvoie la position
  // native (viewBox 198x100, projection Mercator de la lib). On met à l'échelle
  // x4 vers le repère 792x400 du calque pour conserver les tailles décoratives.
  const projectPoint = (lat: number, lng: number) => {
    const { x, y } = (
      map as unknown as {
        getPin: (o: { lat: number; lng: number }) => { x: number; y: number };
      }
    ).getPin({ lat, lng });
    return { x: x * 4, y: y * 4 };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // Timing de l'animation en boucle
  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2;
  const fullCycleDuration = totalAnimationTime + pauseTime;

  return (
    <div className="relative aspect-[99/50] w-full overflow-hidden bg-ink font-sans">
      <svg
        ref={svgRef}
        viewBox="0 0 792 400"
        className="pointer-events-auto block h-full w-full select-none"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Carte des expositions à travers le monde"
      >
        {/* Fond pointillé inline dans le MÊME SVG que les points : un seul repère,
            donc aucun décalage possible entre la carte et les villes (pas de
            mismatch object-cover / preserveAspectRatio entre deux éléments). */}
        <image
          href={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          x="0"
          y="0"
          width="792"
          height="400"
          preserveAspectRatio="xMidYMid meet"
          className="select-none [mask-image:linear-gradient(to_bottom,transparent,white_12%,white_88%,transparent)]"
        />

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id="glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);

          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime =
            (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={
                  isLoop
                    ? { pathLength: [0, 0, 1, 1, 0] }
                    : { pathLength: 1 }
                }
                transition={
                  isLoop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0,
                      }
                    : {
                        duration: reduce ? 0 : animationDuration,
                        delay: reduce ? 0 : i * staggerDelay,
                        ease: "easeInOut",
                      }
                }
              />

              {isLoop && (
                <motion.circle
                  r="4"
                  fill={lineColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [null, "0%", "100%", "100%", "100%"],
                    opacity: [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                  style={{
                    offsetPath: `path('${createCurvedPath(
                      startPoint,
                      endPoint
                    )}')`,
                  }}
                />
              )}
            </g>
          );
        })}

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);

          return (
            <g key={`points-group-${i}`}>
              {/* Point de départ */}
              <g key={`start-${i}`}>
                <motion.g
                  onHoverStart={() =>
                    setHoveredLocation(dot.start.label || `Étape ${i}`)
                  }
                  onHoverEnd={() => setHoveredLocation(null)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <circle
                    cx={startPoint.x}
                    cy={startPoint.y}
                    r="3"
                    fill={lineColor}
                    filter="url(#glow)"
                  />
                  {!reduce && (
                    <circle
                      cx={startPoint.x}
                      cy={startPoint.y}
                      r="3"
                      fill={lineColor}
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        from="3"
                        to="12"
                        dur="2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </motion.g>

                {showLabels && dot.start.label && (
                  <motion.g
                    initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 * i + 0.3, duration: 0.5 }}
                    className={`pointer-events-none ${labelClassName}`}
                  >
                    <CityLabel
                      cx={startPoint.x}
                      cy={startPoint.y}
                      label={dot.start.label}
                    />
                  </motion.g>
                )}
              </g>

              {/* Point d'arrivée */}
              <g key={`end-${i}`}>
                <motion.g
                  onHoverStart={() =>
                    setHoveredLocation(dot.end.label || `Destination ${i}`)
                  }
                  onHoverEnd={() => setHoveredLocation(null)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <circle
                    cx={endPoint.x}
                    cy={endPoint.y}
                    r="3"
                    fill={lineColor}
                    filter="url(#glow)"
                  />
                  {!reduce && (
                    <circle
                      cx={endPoint.x}
                      cy={endPoint.y}
                      r="3"
                      fill={lineColor}
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        from="3"
                        to="12"
                        dur="2s"
                        begin="0.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="2s"
                        begin="0.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </motion.g>

                {showLabels && dot.end.label && (
                  <motion.g
                    initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 * i + 0.5, duration: 0.5 }}
                    className={`pointer-events-none ${labelClassName}`}
                  >
                    <CityLabel
                      cx={endPoint.x}
                      cy={endPoint.y}
                      label={dot.end.label}
                    />
                  </motion.g>
                )}
              </g>
            </g>
          );
        })}
      </svg>

      {/* Tooltip mobile */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 rounded-full border border-line bg-ink/90 px-3 py-2 text-sm font-medium text-bone backdrop-blur-sm sm:hidden"
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
