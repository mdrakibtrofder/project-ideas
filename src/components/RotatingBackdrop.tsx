import { useEffect, useState } from "react";

const SLIDES = [
  "linear-gradient(135deg, oklch(0.55 0.20 250) 0%, oklch(0.65 0.18 220) 50%, oklch(0.78 0.14 200) 100%)",
  "linear-gradient(135deg, oklch(0.42 0.18 265) 0%, oklch(0.58 0.20 240) 50%, oklch(0.72 0.16 210) 100%)",
  "linear-gradient(135deg, oklch(0.50 0.22 245) 0%, oklch(0.62 0.17 215) 50%, oklch(0.80 0.12 195) 100%)",
  "linear-gradient(135deg, oklch(0.38 0.16 270) 0%, oklch(0.55 0.20 245) 50%, oklch(0.70 0.16 220) 100%)",
  "linear-gradient(135deg, oklch(0.45 0.20 255) 0%, oklch(0.60 0.18 225) 50%, oklch(0.76 0.13 205) 100%)",
  "linear-gradient(135deg, oklch(0.48 0.19 248) 0%, oklch(0.66 0.18 218) 50%, oklch(0.82 0.10 198) 100%)",
];

export function RotatingBackdrop() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {SLIDES.map((bg, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-[2000ms]"
          style={{
            background: bg,
            opacity: i === idx ? 0.18 : 0,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 50% at 50% 0%, oklch(1 0 0 / 0.6) 0%, transparent 70%), linear-gradient(180deg, transparent 0%, oklch(0.99 0.01 240) 80%)",
        }}
      />
    </div>
  );
}
