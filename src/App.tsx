import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProjectList from "./components/ProjectList";
import PostList from "./components/PostList";
import MusicSection from "./components/MusicSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="min-w-0 flex-1">
            <ProjectList />
            <PostList />
          </div>
          <aside className="w-full flex-shrink-0 lg:w-80">
            <MusicSection />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
