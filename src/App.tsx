import { BrowserRouter, Routes, Route } from "react-router-dom";
import MinimalHome from "./components/minimal/MinimalHome";
import PostPage from "./pages/PostPage";
import PostsPage from "./pages/PostsPage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import WritePostPage from "./pages/WritePostPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MinimalHome />} />
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
