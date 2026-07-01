import type { CharacterStatus } from "../types";

interface StatusBadgeProps {
  status: CharacterStatus;
}

const STATUS_STYLES: Record<
  CharacterStatus,
  { label: string; dot: string; text: string; ring: string }
> = {
  Alive: {
    label: "Alive",
    dot: "bg-portal-400 rm-pulse-alive",
    text: "text-portal-300",
    ring: "ring-portal-500/30",
  },
  Dead: {
    label: "Dead",
    dot: "bg-red-400",
    text: "text-red-300",
    ring: "ring-red-500/30",
  },
  unknown: {
    label: "Desconocido",
    dot: "bg-slate-400",
    text: "text-slate-300",
    ring: "ring-slate-500/30",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-space-900/60 px-2.5 py-1 text-xs font-medium ring-1 ${style.text} ${style.ring}`}
    >
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
