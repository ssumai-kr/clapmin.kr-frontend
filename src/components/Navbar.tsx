import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import clapminLogo from "../images/clapminLogo.png";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={clapminLogo} alt="clapmin" className="h-7 w-7 rounded" />
          <span className="text-lg font-bold text-foreground">clapmin</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <a href="/#posts" className="transition-colors hover:text-foreground">
            Posts
          </a>
          <a
            href="mailto:fhsjdvs@gmail.com"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>
          {isAuthenticated && (
            <Link
              to="/posts/write"
              className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
            >
              <PenLine className="h-3.5 w-3.5" />
              글쓰기
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
