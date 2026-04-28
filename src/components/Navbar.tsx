import { Link } from "react-router-dom";
import clapminLogo from "../images/clapminLogo.png";

export default function Navbar() {
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
        </div>
      </div>
    </nav>
  );
}
