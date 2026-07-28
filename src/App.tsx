import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProjectList from "./components/ProjectList";
import PostList from "./components/PostList";
import MusicSection from "./components/MusicSection";
import Footer from "./components/Footer";
import InteractiveBackground from "./components/InteractiveBackground";
import Reveal from "./components/Reveal";
import PostPage from "./pages/PostPage";
import PostsPage from "./pages/PostsPage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import WritePostPage from "./pages/WritePostPage";
import { AuthProvider } from "./context/AuthContext";

function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <InteractiveBackground />
      <Navbar />
      <Hero />
      <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="min-w-0 flex-1">
            <Reveal>
              <ProjectList limit={4} />
            </Reveal>
            <Reveal delay={100}>
              <PostList limit={4} />
            </Reveal>
          </div>
          <aside className="w-full flex-shrink-0 lg:w-80">
            <Reveal delay={150}>
              <MusicSection />
            </Reveal>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/write" element={<WritePostPage />} />
          <Route path="/posts/:slug" element={<PostPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
