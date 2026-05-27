import { ChevronDown } from 'lucide-react';
import { TEAM_GROUP_KEYS, type GroupKey } from '@/lib/filter';
import { TEAMS_META } from '@/data/stickers';

interface Props {
  value: GroupKey;
  onChange: (v: GroupKey) => void;
}

export function GroupSelect({ value, onChange }: Props) {
  const display =
    value === 'ALL'
      ? 'TODOS LOS GRUPOS'
      : value === 'SPECIALS'
        ? 'ESPECIALES'
        : `GRUPO ${value}`;

  return (
    <label className="relative block">
      <span className="sr-only">Filtrar por grupo</span>
      <div className="relative h-12 rounded-xl border border-line-strong bg-pitch-elev hover:border-magenta/60 focus-within:border-magenta transition-colors">
        <span
          aria-hidden
          className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-black text-base tracking-wide text-hi pointer-events-none"
        >
          {display}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as GroupKey)}
          className="absolute inset-0 w-full h-full appearance-none bg-transparent text-transparent pl-4 pr-12 cursor-pointer outline-none rounded-xl"
          style={{ colorScheme: 'dark' }}
        >
          <option value="ALL">Todos los grupos</option>
          <optgroup label="Grupos">
            {TEAM_GROUP_KEYS.map((g) => {
              const teams = TEAMS_META.filter((t) => t.group === g);
              const codes = teams.map((t) => t.code).join(' · ');
              return (
                <option key={g} value={g}>
                  Grupo {g} — {codes}
                </option>
              );
            })}
          </optgroup>
          <option value="SPECIALS">Especiales (FWC + Coca-Cola)</option>
        </select>
        <span
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-magenta"
          aria-hidden
        >
          <ChevronDown className="w-5 h-5" strokeWidth={2.6} />
        </span>
      </div>
    </label>
  );
}
