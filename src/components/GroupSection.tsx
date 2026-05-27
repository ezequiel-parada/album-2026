import { useMemo } from 'react';
import type { Sticker } from '@/types';
import { useAlbum } from '@/store/useAlbum';
import { TEAMS_META } from '@/data/stickers';
import { CountryBlock } from './CountryBlock';
import { EnergySlash, EnergyDivider } from './Decoration';

interface Props {
  group: string;
  stickers: Sticker[];
}

// Color rotation per group letter so each one feels distinct
const GROUP_ACCENTS: Record<string, string> = {
  A: '#FF2E63', B: '#22D3EE', C: '#A3FF3C', D: '#FFD60A',
  E: '#FF6B35', F: '#FF2E63', G: '#22D3EE', H: '#A3FF3C',
  I: '#FFD60A', J: '#FF6B35', K: '#FF2E63', L: '#22D3EE',
};

export function GroupSection({ group, stickers }: Props) {
  const counts = useAlbum((s) => s.counts);

  const byCountry = useMemo(() => {
    const map = new Map<string, Sticker[]>();
    for (const s of stickers) {
      if (!s.country) continue;
      const list = map.get(s.prefix) ?? [];
      list.push(s);
      map.set(s.prefix, list);
    }
    return map;
  }, [stickers]);

  const groupTeams = useMemo(
    () => TEAMS_META.filter((t) => t.group === group),
    [group],
  );

  const { have, total } = useMemo(() => {
    let have = 0;
    for (const s of stickers) {
      if ((counts[s.code] ?? 0) >= 1) have++;
    }
    return { have, total: stickers.length };
  }, [counts, stickers]);

  if (stickers.length === 0) return null;

  const teamsInGroup = groupTeams.filter((t) => byCountry.has(t.code));
  const accent = GROUP_ACCENTS[group] ?? '#FF2E63';
  const complete = have === total;

  return (
    <section className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-line-strong bg-pitch-elev px-5 py-5">
        <EnergySlash
          className="absolute -right-6 -top-6 w-44 h-44 opacity-50"
          style={{ color: accent }}
        />
        <div className="relative flex items-end justify-between gap-4">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.32em] font-bold"
              style={{ color: accent }}
            >
              Grupo
            </div>
            <h2
              className="display text-7xl sm:text-8xl leading-[0.85] mt-1"
              style={{ color: '#F4F6FB' }}
            >
              {group}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-lo font-bold">
              Progreso
            </div>
            <div className="font-display font-black tabular-nums text-2xl sm:text-3xl leading-tight mt-0.5">
              <span style={complete ? { color: accent } : { color: '#F4F6FB' }}>
                {have}
              </span>
              <span className="text-lo">/{total}</span>
            </div>
            <div
              aria-hidden
              className="mt-1.5 w-16 h-1 rounded-full bg-line overflow-hidden ml-auto"
            >
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${total > 0 ? (have / total) * 100 : 0}%`,
                  background: accent,
                }}
              />
            </div>
          </div>
        </div>
      </header>
      <div className="space-y-7">
        {teamsInGroup.map((t, idx) => (
          <div key={t.code}>
            {idx > 0 && <EnergyDivider className="mb-6 opacity-40" />}
            <CountryBlock
              prefix={t.code}
              country={t.country}
              stickers={byCountry.get(t.code) ?? []}
              accent={accent}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
