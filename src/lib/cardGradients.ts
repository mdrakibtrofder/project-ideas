// Deterministic gradient palette assigned per project for visual variety.
export const CARD_GRADIENTS: { bar: string; text: string; ring: string }[] = [
  { bar: "linear-gradient(90deg,#6366f1,#ec4899)",  text: "linear-gradient(90deg,#6366f1,#ec4899)",  ring: "rgba(236,72,153,0.35)" },
  { bar: "linear-gradient(90deg,#0ea5e9,#22d3ee)",  text: "linear-gradient(90deg,#0ea5e9,#22d3ee)",  ring: "rgba(14,165,233,0.35)" },
  { bar: "linear-gradient(90deg,#f59e0b,#ef4444)",  text: "linear-gradient(90deg,#f59e0b,#ef4444)",  ring: "rgba(239,68,68,0.35)" },
  { bar: "linear-gradient(90deg,#10b981,#06b6d4)",  text: "linear-gradient(90deg,#10b981,#06b6d4)",  ring: "rgba(16,185,129,0.35)" },
  { bar: "linear-gradient(90deg,#8b5cf6,#3b82f6)",  text: "linear-gradient(90deg,#8b5cf6,#3b82f6)",  ring: "rgba(139,92,246,0.35)" },
  { bar: "linear-gradient(90deg,#f43f5e,#f97316)",  text: "linear-gradient(90deg,#f43f5e,#f97316)",  ring: "rgba(244,63,94,0.35)" },
  { bar: "linear-gradient(90deg,#14b8a6,#84cc16)",  text: "linear-gradient(90deg,#14b8a6,#84cc16)",  ring: "rgba(20,184,166,0.35)" },
  { bar: "linear-gradient(90deg,#d946ef,#6366f1)",  text: "linear-gradient(90deg,#d946ef,#6366f1)",  ring: "rgba(217,70,239,0.35)" },
  { bar: "linear-gradient(90deg,#0891b2,#7c3aed)",  text: "linear-gradient(90deg,#0891b2,#7c3aed)",  ring: "rgba(124,58,237,0.35)" },
  { bar: "linear-gradient(90deg,#eab308,#16a34a)",  text: "linear-gradient(90deg,#eab308,#16a34a)",  ring: "rgba(234,179,8,0.35)" },
];

export function gradientFor(key: string | number) {
  const s = String(key);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return CARD_GRADIENTS[h % CARD_GRADIENTS.length];
}
