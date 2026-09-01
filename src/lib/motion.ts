export const motionTokens = {
  fast: "120ms",
  normal: "200ms",
  slow: "320ms",
} as const;

export const motionPresets = {
  press: { transform: "translate(2px, 2px)", boxShadow: "1px 1px 0 var(--ink)" },
  lift: { transform: "translate(-1px, -1px)", boxShadow: "5px 5px 0 var(--ink)" },
  pop: { transform: "translateY(-4px) scale(0.98)", opacity: 0 },
  slide: { transform: "translateY(24px)", opacity: 0 },
  dragLift: { transform: "rotate(1deg) scale(1.02)", opacity: 0.92 },
} as const;
