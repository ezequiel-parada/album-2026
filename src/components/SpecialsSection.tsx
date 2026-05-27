import { useMemo } from 'react';
import type { Sticker } from '@/types';
import { useAlbum } from '@/store/useAlbum';
import { StickerCard } from './StickerCard';
import { EnergySlash, EnergyDivider } from './Decoration';

interface Props {
  stickers: Sticker[];
}

const SUBSECTIONS: Array<{
  prefix: 'FWC' | 'CC';
  label: string;
  accent: string;
  textOn: string;
}> = [
  { prefix: 'FWC', label: 'FWC', accent: '#FFD60A', textOn: '#0A0E1A' },
  { prefix: 'CC', label: 'Coca-Cola', accent: '#FF6B35', textOn: '#0A0E1A' },
];

export function SpecialsSection({ stickers }: Props) {
  const counts = useAlbum((s) => s.counts);

  const byPrefix = useMemo(() => {
    const map = new Map<string, Sticker[]>();
    for (const s of stickers) {
      const list = map.get(s.prefix) ?? [];
      list.push(s);
      map.set(s.prefix, list);
    }
    return map;
  }, [stickers]);

  const { have, total } = useMemo(() => {
    let have = 0;
    for (const s of stickers) {
      if ((counts[s.code] ?? 0) >= 1) have++;
    }
    return { have, total: stickers.length };
  }, [counts, stickers]);

  if (stickers.length === 0) return null;

  const complete = have === total;

  return (
    <section className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-line-strong bg-pitch-elev px-5 py-5">
        <EnergySlash
          className="absolute -right-6 -top-6 w-44 h-44 opacity-50 text-sun"
        />
        <div className="relative flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] font-bold text-sun">
              Sección
            </div>
            <h2 className="display text-5xl sm:text-7xl leading-[0.9] mt-1 text-hi">
              ESPECIALES
            </h2>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-lo font-bold">
              Progreso
            </div>
            <div className="font-display font-black tabular-nums text-2xl sm:text-3xl leading-tight mt-0.5">
              <span className={complete ? 'text-sun' : 'text-hi'}>{have}</span>
              <span className="text-lo">/{total}</span>
            </div>
          </div>
        </div>
      </header>
      <div className="space-y-7">
        {SUBSECTIONS.map((sub, idx) => {
          const list = byPrefix.get(sub.prefix);
          if (!list || list.length === 0) return null;
          const subHave = list.filter((s) => (counts[s.code] ?? 0) >= 1).length;
          const subComplete = subHave === list.length;
          return (
            <div key={sub.prefix}>
              {idx > 0 && <EnergyDivider className="mb-6 opacity-40" />}
              <section className="space-y-3">
                <header className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center rounded-md font-display font-black text-sm w-14 h-9 tracking-wide ring-1"
                    style={{
                      background: sub.accent,
                      color: sub.textOn,
                      boxShadow: `0 6px 18px -8px ${sub.accent}`,
                    }}
                    aria-hidden
                  >
                    {sub.prefix}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-black text-xl sm:text-2xl text-hi tracking-tight">
                      {sub.label}
                    </h3>
                    <div
                      className="text-[10px] uppercase tracking-[0.24em] font-bold"
                      style={{ color: sub.accent }}
                    >
                      {sub.prefix}
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-display font-black text-base">
                      <span style={subComplete ? { color: sub.accent } : { color: '#F4F6FB' }}>
                        {subHave}
                      </span>
                      <span className="text-lo">/{list.length}</span>
                    </div>
                  </div>
                </header>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-1.5">
                  {list.map((s) => (
                    <StickerCard key={s.code} sticker={s} variant="compact" />
                  ))}
                </div>
              </section>
            </div>
          );
        })}
      </div>
    </section>
  );
}
