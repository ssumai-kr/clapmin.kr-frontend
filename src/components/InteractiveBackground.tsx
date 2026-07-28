import { useEffect, useRef } from "react";

/**
 * Fixed ambient backdrop: slow-drifting aurora blobs, a faint grid, and a
 * radial spotlight that follows the cursor. Purely decorative, pointer-none.
 */
export default function InteractiveBackground() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(600px circle at ${cx}px ${cy}px, hsl(265 90% 66% / 0.10), transparent 65%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* aurora blobs */}
      <div
        className="absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full opacity-40 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, hsl(265 90% 66% / 0.55), transparent 60%)",
          animation: "float-slow 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full opacity-30 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, hsl(320 90% 62% / 0.5), transparent 60%)",
          animation: "float-slow 22s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full opacity-25 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, hsl(190 95% 55% / 0.45), transparent 60%)",
          animation: "float-slow 26s ease-in-out infinite",
        }}
      />

      {/* subtle grid + vignette */}
      <div className="grid-bg absolute inset-0 opacity-50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 90% at 50% 0%, transparent 55%, hsl(240 8% 9% / 0.7) 100%)",
        }}
      />

      {/* cursor spotlight */}
      <div ref={spotRef} className="absolute inset-0" />
    </div>
  );
}
