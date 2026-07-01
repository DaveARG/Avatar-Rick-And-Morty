interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  const buttonClass =
    "rounded-full border border-portal-500/30 bg-space-800/70 px-4 py-2 text-sm font-medium text-slate-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-35 enabled:hover:-translate-y-0.5 enabled:hover:border-portal-400/70 enabled:hover:text-portal-300 enabled:hover:shadow-[0_0_16px_-4px_rgba(151,206,76,0.5)] enabled:active:translate-y-0";

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={isPrevDisabled}
        aria-disabled={isPrevDisabled}
        className={buttonClass}
      >
        Anterior
      </button>
      <span className="font-display text-sm tracking-wide text-cyan-soft">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={isNextDisabled}
        aria-disabled={isNextDisabled}
        className={buttonClass}
      >
        Siguiente
      </button>
    </div>
  );
}
