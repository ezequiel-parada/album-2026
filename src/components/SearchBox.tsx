import { Search, X } from 'lucide-react';
import { useId } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBox({ value, onChange, placeholder }: Props) {
  const id = useId();
  return (
    <label htmlFor={id} className="relative block group">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan/80 group-focus-within:text-cyan transition-colors">
        <Search className="w-4 h-4" strokeWidth={2.4} />
      </span>
      <input
        id={id}
        type="search"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Buscar por código (ej. ARG18)'}
        className="w-full h-12 pl-10 pr-10 rounded-xl border border-line-strong bg-pitch-elev text-base text-hi placeholder:text-lo font-medium tracking-wide focus:border-cyan focus:bg-pitch-card outline-none transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Borrar búsqueda"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center rounded-lg text-lo hover:text-hi hover:bg-line transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </label>
  );
}
