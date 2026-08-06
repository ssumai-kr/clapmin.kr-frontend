import itsSupportCard from "../../images/itssupportcard.png";
import NowPlaying from "./NowPlaying";

export default function Widgets() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-[1.55fr_1fr]">
      <div className="flex items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-[#2B2B2B] p-3.5">
        <img src={itsSupportCard} alt="IT support card" className="block w-24 rounded-lg" />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-mono text-[9.5px] tracking-[0.14em] text-white/40">CERTIFIED</span>
          <span className="text-[13px] font-medium text-white">IT Support Specialist</span>
          <span className="text-[12px] text-white/45">Soongsil University</span>
        </div>
      </div>
      <NowPlaying />
    </section>
  );
}
