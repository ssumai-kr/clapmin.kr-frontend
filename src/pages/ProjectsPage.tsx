import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectList from "../components/ProjectList";
import InteractiveBackground from "../components/InteractiveBackground";

export default function ProjectsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <InteractiveBackground />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <ProjectList />
      </main>
      <Footer />
    </div>
  );
}
