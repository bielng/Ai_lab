import { Logo, ArrowUpRight } from "./Icons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FCFAF5]/85 border-b border-[#E5E7EB]/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <Logo />
          <span className="font-semibold text-[15px] tracking-tight text-ink-900">Dayom Lab</span>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-700">
          <a href="#datasets" className="hover:text-ink-900 transition">Datasets</a>
          <a href="#models" className="hover:text-ink-900 transition">Models</a>
          <a href="#initiatives" className="hover:text-ink-900 transition">Initiatives</a>
          <a href="#about" className="hover:text-ink-900 transition">About Us</a>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#contribute" className="hidden sm:inline-block text-sm text-ink-700 hover:text-ink-900 transition">Contribute</a>
          <a href="#contact" className="btn-primary">
            Contact Us <ArrowUpRight />
          </a>
        </div>
      </div>
    </header>
  );
}
