import { motion } from 'framer-motion';
import type { StatusKey } from '@/lib/filter';

interface Props {
  value: StatusKey;
  onChange: (v: StatusKey) => void;
}

const OPTIONS: Array<{
  key: StatusKey;
  label: string;
  activeBg: string;
  activeText: string;
  activeShadow?: string;
  dot?: string;
}> = [
  { key: 'all', label: 'Todas', activeBg: '#FF2E63', activeText: '#FFFFFF', activeShadow: 'shadow-glow-magenta' },
  { key: 'missing', label: 'Me faltan', activeBg: '#3A4254', activeText: '#F4F6FB', dot: 'bg-white/60' },
  { key: 'have', label: 'Las tengo', activeBg: '#A3FF3C', activeText: '#0A0E1A', activeShadow: 'shadow-glow-lime', dot: 'bg-lime' },
  { key: 'duplicate', label: 'Repetidas', activeBg: '#22D3EE', activeText: '#0A0E1A', activeShadow: 'shadow-glow-cyan', dot: 'bg-cyan' },
];

export function StatusPills({ value, onChange }: Props) {
  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="tablist"
      aria-label="Filtrar por estado"
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.key)}
            className={`relative inline-flex items-center gap-2 h-9 px-3.5 rounded-full text-[13px] font-bold uppercase tracking-[0.1em] transition-colors ${
              active ? opt.activeShadow ?? '' : 'text-lo hover:text-hi'
            }`}
            style={
              active
                ? { color: opt.activeText }
                : undefined
            }
          >
            {active && (
              <motion.span
                layoutId="status-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: opt.activeBg }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {!active && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border border-line-strong"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {opt.dot && !active && (
                <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} aria-hidden />
              )}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
