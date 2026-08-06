import clapminLogo from "../../images/clapminLogo.png";

export default function Header() {
  return (
    <header className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2.5">
        <img src={clapminLogo} alt="clapmin" className="h-[22px] w-[22px] rounded-[5px]" />
        <h1 className="text-[15px] font-medium tracking-[-0.01em] text-white">Park Sumin</h1>
      </div>
      <p className="ml-8 text-[13.5px] text-white/45">Software and ERP Engineer</p>
    </header>
  );
}
