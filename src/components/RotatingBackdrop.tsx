import { useEffect, useState } from "react";
import bg1 from "@/assets/bg1.jpg";
import bg2 from "@/assets/bg2.jpg";
import bg3 from "@/assets/bg3.jpg";
import bg4 from "@/assets/bg4.jpg";
import bg5 from "@/assets/bg5.jpg";

const SLIDES = [bg1, bg2, bg3, bg4, bg5];

export function RotatingBackdrop() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {SLIDES.map((src, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-[1800ms] bg-center bg-cover"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === idx ? 0.28 : 0,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.22 0.08 260 / 0.55) 0%, oklch(0.22 0.08 260 / 0.35) 60%, oklch(0.99 0.01 240) 100%)",
        }}
      />
    </div>
  );
}
