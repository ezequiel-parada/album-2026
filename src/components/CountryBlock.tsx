import { useMemo } from 'react';
import type { Sticker } from '@/types';
import { useAlbum } from '@/store/useAlbum';
import { flagFor } from '@/data/stickers';
import { StickerCard } from './StickerCard';

interface Props {
  country: string;
  prefix: string;
  stickers: Sticker[];
  /** Color accent inherited from the parent group (or default magenta) */
  accent?: string;
}

export function CountryBlock({ country, prefix, stickers, accent = '#FF2E63' }: Props) {
  const counts = useAlbum((s) => s.counts);
  const flag = flagFor(prefix);

  const { have, total } = useMemo(() => {
    let have = 0;
    for (const s of stickers) {
      if ((counts[s.code] ?? 0) >= 1) have++;
    }
    return { have, total: stickers.length };
  }, [counts, stickers]);

  const complete = have === total && total > 0;
  const pct = total > 0 ? (have / total) * 100 : 0;

  return (
    <section className="space-y-3">
      <header className="flex items-center gap-3">
        {flag ? (
          <span className="relative inline-block shrink-0">
            <span
              aria-hidden
              className="absolute -inset-0.5 rounded-md blur-sm opacity-50"
              style={{ background: accent }}
            />
            <img
              src={flag}
              alt=""
              aria-hidden
              className="relative w-14 h-9 object-cover rounded-[4px] ring-1 ring-white/30"
            />
          </span>
        ) : null}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-black text-xl sm:text-2xl text-hi truncate leading-tight tracking-tight">
            {country}
          </h3>
          <div
            className="text-[10px] uppercase tracking-[0.24em] font-bold"
            style={{ color: accent }}
          >
            {prefix}
          </div>
        </div>
        <div className="text-right tabular-nums shrink-0">
          <div className="font-display font-black text-base">
            <span style={complete ? { color: accent } : { color: '#F4F6FB' }}>
              {have}
            </span>
            <span className="text-lo">/{total}</span>
          </div>
          <div
            aria-hidden
            className="mt-1 w-14 h-0.5 rounded-full bg-line overflow-hidden ml-auto"
          >
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${pct}%`, background: accent }}
            />
          </div>
        </div>
      </header>
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-1.5">
        {stickers.map((s) => (
          <StickerCard key={s.code} sticker={s} variant="compact" />
        ))}
      </div>
    </section>
  );
}
