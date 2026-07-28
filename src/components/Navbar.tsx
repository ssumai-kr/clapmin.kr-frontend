import { Link, useLocation } from "react-router-dom";
import clapminLogo from "../images/clapminLogo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/posts", label: "Posts" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <nav className="glass fixed left-0 right-0 top-0 z-50 border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2">
          <img
            src={clapminLogo}
            alt="clapmin"
            className="h-7 w-7 rounded ring-1 ring-white/10 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
          />
          <span className="gradient-text text-lg font-extrabold tracking-tight">
            clapmin
          </span>
        </Link>

        <div className="flex items-center gap-1 text-sm sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative rounded-lg px-3 py-1.5 transition-colors ${
                isActive(link.to)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-[hsl(var(--brand-1))] to-transparent" />
              )}
            </Link>
          ))}
          <a
            href="mailto:fhsjdvs@gmail.com"
            className="ml-1 rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
