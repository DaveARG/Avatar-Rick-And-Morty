interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <label htmlFor="character-search" className="sr-only">
        Buscar personaje por nombre
      </label>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-portal-400/70"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        id="character-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar personaje por nombre..."
        autoComplete="off"
        className="w-full rounded-full border border-portal-500/25 bg-space-800/70 py-3 pl-11 pr-4 text-slate-100 shadow-inner shadow-black/30 placeholder:text-slate-500 transition-all duration-200 focus:border-portal-400 focus:shadow-[0_0_0_3px_rgba(151,206,76,0.25)] focus:outline-none"
      />
    </div>
  );
}
