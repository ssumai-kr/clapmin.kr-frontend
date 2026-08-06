import { useEffect, useState } from "react";
import clapminLogo from "../../images/clapminLogo.png";

/** Claude-style centered greeting shown once on first paint. */
export default function Intro() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3.5 bg-[#171717]"
      style={{ animation: "clapmin-intro-out 2.2s ease forwards" }}
    >
      <div
        className="flex items-center gap-3"
        style={{ animation: "clapmin-intro-in .9s cubic-bezier(.16,1,.3,1) both" }}
      >
        <img src={clapminLogo} alt="" className="h-[26px] w-[26px] rounded-md" />
        <span className="text-[26px] tracking-[-0.02em] text-white">Hello, I'm Clapmin!!</span>
      </div>
      <span
        className="font-mono text-[11.5px] tracking-[0.14em] text-white/30"
        style={{ animation: "clapmin-intro-in .9s cubic-bezier(.16,1,.3,1) .25s both" }}
      >
        SOFTWARE AND ERP ENGINEER
      </span>
    </div>
  );
}
