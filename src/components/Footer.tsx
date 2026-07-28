export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/5">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          © 2025 <span className="gradient-text font-semibold">clapmin</span>.
          All rights reserved.
        </p>
        <a
          href="mailto:fhsjdvs@gmail.com"
          className="transition-colors hover:text-foreground"
        >
          fhsjdvs@gmail.com
        </a>
      </div>
    </footer>
  );
}
