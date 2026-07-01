interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={isPrevDisabled}
        aria-disabled={isPrevDisabled}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-slate-100"
      >
        Anterior
      </button>
      <span className="text-sm text-slate-600">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={isNextDisabled}
        aria-disabled={isNextDisabled}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-slate-100"
      >
        Siguiente
      </button>
    </div>
  );
}
