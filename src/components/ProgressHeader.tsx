import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CATALOG_SIZE, STICKERS } from '@/data/stickers';
import { useAlbum } from '@/store/useAlbum';
import { categoryOf } from '@/lib/category';
import { HalftoneBackground, EnergySlash, GrainOverlay } from './Decoration';

const STAT_ACCENTS = {
  TEAM: { color: '#FF2E63', label: 'Equipos', glow: 'shadow-glow-magenta' },
  FWC: { color: '#FFD60A', label: 'FWC', glow: 'shadow-glow-sun' },
  CC: { color: '#FF6B35', label: 'Coca-Cola', glow: 'shadow-glow-sun' },
} as const;

export function ProgressHeader() {
  const counts = useAlbum((s) => s.counts);

  const stats = useMemo(() => {
    let have = 0;
    let dup = 0;
    const byCat = {
      TEAM: { have: 0, total: 0 },
      FWC: { have: 0, total: 0 },
      CC: { have: 0, total: 0 },
    };
    for (const s of STICKERS) {
      const c = counts[s.code] ?? 0;
      const cat = categoryOf(s);
      byCat[cat].total++;
      if (c >= 1) {
        have++;
        byCat[cat].have++;
      }
      if (c >= 2) dup += c - 1;
    }
    return { have, dup, byCat };
  }, [counts]);

  const pct = Math.round((stats.have / CATALOG_SIZE) * 100);
  const animatedPct = useCountUp(pct);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-line-strong bg-pitch-elev px-5 sm:px-7 py-6 sm:py-7">
      <HalftoneBackground intensity="normal" size="md" />
      <GrainOverlay opacity={0.05} />
      <EnergySlash
        className="absolute -right-10 -top-10 w-60 h-60 opacity-60 text-magenta"
      />
      <div
        aria-hidden
        className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="eyebrow mb-2">Tu progreso</div>
            <div className="flex items-baseline gap-1">
              <span
                className="display text-gradient-energy text-[88px] sm:text-[120px] leading-[0.85] tracking-tight tabular-nums"
                aria-label={`${pct} por ciento`}
              >
                {animatedPct}
              </span>
              <span className="display text-3xl sm:text-5xl text-hi/80 leading-none">
                %
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase tracking-[0.24em] text-lo font-bold">
              Figuritas
            </div>
            <div className="font-display font-black tabular-nums text-2xl sm:text-3xl leading-tight text-hi mt-0.5">
              {stats.have}
              <span className="text-lo">/{CATALOG_SIZE}</span>
            </div>
            {stats.dup > 0 && (
              <div
                className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan/15 border border-cyan/40 text-cyan text-[11px] font-bold uppercase tracking-wide"
                aria-label={`${stats.dup} repetidas`}
              >
                <span className="tabular-nums">×{stats.dup}</span>
                <span>rep.</span>
              </div>
            )}
          </div>
        </div>

        <ProgressBar pct={pct} />

        <div className="grid grid-cols-3 gap-2.5">
          <Stat
            cat="TEAM"
            have={stats.byCat.TEAM.have}
            total={stats.byCat.TEAM.total}
          />
          <Stat
            cat="FWC"
            have={stats.byCat.FWC.have}
            total={stats.byCat.FWC.total}
          />
          <Stat
            cat="CC"
            have={stats.byCat.CC.have}
            total={stats.byCat.CC.total}
          />
        </div>
      </div>
    </section>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const reduce = useReducedMotion();
  return (
    <div
      className="relative h-2.5 rounded-full bg-pitch-card border border-line overflow-hidden"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: 'spring', stiffness: 90, damping: 22, mass: 0.8 }
        }
        className="absolute inset-y-0 left-0 rounded-full bg-grad-energy"
      >
        <div
          aria-hidden
          className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
        />
      </motion.div>
    </div>
  );
}

function Stat({
  cat,
  have,
  total,
}: {
  cat: keyof typeof STAT_ACCENTS;
  have: number;
  total: number;
}) {
  const accent = STAT_ACCENTS[cat];
  const complete = have === total && total > 0;
  const pct = total > 0 ? (have / total) * 100 : 0;
  return (
    <div
      className={`relative rounded-xl border bg-pitch-card/80 px-3 py-2.5 overflow-hidden transition-shadow ${
        complete ? 'border-transparent' : 'border-line'
      }`}
      style={
        complete
          ? {
              boxShadow: `0 0 0 1px ${accent.color}, 0 8px 22px -10px ${accent.color}`,
            }
          : undefined
      }
    >
      <div
        className="text-[10px] uppercase tracking-[0.18em] font-bold"
        style={{ color: accent.color }}
      >
        {accent.label}
      </div>
      <div className="font-display font-black tabular-nums text-xl leading-tight mt-0.5">
        <span style={complete ? { color: accent.color } : { color: '#F4F6FB' }}>
          {have}
        </span>
        <span className="text-lo font-bold text-sm">/{total}</span>
      </div>
      <div
        aria-hidden
        className="mt-1.5 h-1 rounded-full bg-line overflow-hidden"
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: accent.color }}
        />
      </div>
    </div>
  );
}

function useCountUp(target: number) {
  const [value, setValue] = useState(target);
  const last = useRef(target);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setValue(target);
      last.current = target;
      return;
    }
    const start = last.current;
    const delta = target - start;
    if (delta === 0) return;
    const duration = Math.min(900, 280 + Math.abs(delta) * 18);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + delta * eased);
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else last.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce]);

  return value;
}
