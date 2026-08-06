import Intro from "./Intro";
import Header from "./Header";
import Currently from "./Currently";
import Widgets from "./Widgets";
import Projects from "./Projects";
import { Experience, Achievements, Education } from "./Resume";
import Blogs from "./Blogs";
import TechStack from "./TechStack";
import Activity from "./Activity";
import QuoteFooter from "./QuoteFooter";
import AskDock from "./AskDock";

export default function MinimalHome() {
  return (
    <>
      <Intro />
      <div
        className="min-h-screen bg-[#171717] px-6 pb-[140px] pt-24"
        style={{ animation: "clapmin-page-in .9s ease 1.5s both" }}
      >
        <div className="mx-auto flex max-w-[620px] flex-col gap-16">
          <Header />
          <Currently />
          <Widgets />
          <Projects />
          <Experience />
          <Achievements />
          <Education />
          <Blogs />
          <TechStack />
          <Activity />
          <QuoteFooter />
        </div>
      </div>
      <AskDock />
    </>
  );
}
