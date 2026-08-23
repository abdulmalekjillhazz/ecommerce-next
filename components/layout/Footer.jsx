'use client';

export default function Footer() {
  const links = ['Home', 'Projects', 'About', 'Contact'];

  return (
    <footer className="relative mt-24 bg-neutral-950 text-neutral-400">
      {/* signature gradient hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-14 flex flex-col md:flex-row justify-between gap-10">
        <div>
          <h3 className="text-2xl font-semibold text-white tracking-tight">Tarzan</h3>
          <p className="mt-2 text-sm max-w-xs">
            Building fast, clean web experiences — one project at a time.
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {links.map((item) => (
            
              key={item}
              href={`#${item.toLowerCase()}`}
              className="group relative w-fit text-neutral-400 hover:text-white transition-colors"
            >
              {item}
              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t border-neutral-800 px-6 py-5 flex flex-col-reverse md:flex-row items-center justify-between gap-3 text-xs">
        <p>© {new Date().getFullYear()} Tarzan. All rights reserved.</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          ↑ Back to top
        </button>
      </div>
    </footer>
  );
}
