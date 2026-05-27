import { Minus, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Sticker } from '@/types';
import { statusFromCount, useAlbum } from '@/store/useAlbum';
import { flagFor } from '@/data/stickers';

interface Props {
  sticker: Sticker;
  readOnly?: boolean;
  countOverride?: number;
  /** 'full' incluye bandera + país + label; 'compact' es slim para mini-grilla agrupada */
  variant?: 'full' | 'compact';
}

export function StickerCard({ sticker, readOnly, countOverride, variant = 'full' }: Props) {
  const liveCount = useAlbum((s) => s.counts[sticker.code] ?? 0);
  const increment = useAlbum((s) => s.increment);
  const decrement = useAlbum((s) => s.decrement);
  const count = countOverride ?? liveCount;
  const status = statusFromCount(count);

  if (variant === 'compact') {
    return (
      <CompactCard
        sticker={sticker}
        count={count}
        status={status}
        onInc={() => !readOnly && increment(sticker.code)}
        onDec={() => !readOnly && decrement(sticker.code)}
        readOnly={readOnly}
      />
    );
  }

  const shellByStatus = {
    have: 'bg-pitch-card border-lime/60 shadow-glow-lime',
    duplicate: 'bg-pitch-card border-cyan/60 shadow-glow-cyan',
    missing: 'bg-pitch-card border-line hover:border-line-strong',
  } as const;

  const codeColor =
    status === 'have'
      ? 'text-lime'
      : status === 'duplicate'
        ? 'text-cyan'
        : 'text-hi';

  const onTap = () => {
    if (readOnly) return;
    increment(sticker.code);
  };

  return (
    <motion.div
      whileTap={readOnly ? undefined : { scale: 0.97 }}
      className={`relative rounded-2xl border transition-all duration-200 ${shellByStatus[status]}`}
      data-testid={`sticker-${sticker.code}`}
    >
      <button
        type="button"
        onClick={onTap}
        disabled={readOnly}
        aria-label={`${sticker.code}${
          status === 'have'
            ? ' — la tengo'
            : status === 'duplicate'
              ? ` — repetida ×${count}`
              : ' — falta'
        }`}
        className="w-full p-3.5 flex flex-col items-center justify-center gap-1.5 min-h-[120px] disabled:cursor-default"
      >
        {(() => {
          const flag = flagFor(sticker.prefix);
          if (flag) {
            return (
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="absolute -inset-0.5 rounded bg-gradient-to-br from-magenta/30 via-sun/20 to-cyan/30 blur-sm opacity-60"
                />
                <img
                  src={flag}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="relative w-11 h-7 object-cover rounded-[3px] ring-1 ring-white/20"
                />
              </span>
            );
          }
          if (sticker.prefix === 'FWC' || sticker.prefix === 'CC') {
            const isCC = sticker.prefix === 'CC';
            return (
              <span
                className={`inline-flex items-center justify-center w-11 h-7 rounded-[3px] font-display font-black text-[11px] tracking-wide ${
                  isCC
                    ? 'bg-flame text-pitch ring-1 ring-flame/60'
                    : 'bg-sun text-pitch ring-1 ring-sun/60'
                }`}
                aria-hidden
              >
                {sticker.prefix}
              </span>
            );
          }
          return null;
        })()}
        <span
          className={`font-display font-black text-xl tracking-tight tabular-nums ${codeColor}`}
        >
          {sticker.code}
        </span>
        {sticker.country && (
          <span className="text-[10.5px] text-lo uppercase tracking-[0.14em] font-semibold truncate max-w-full">
            {sticker.country}
          </span>
        )}
        {status === 'have' && (
          <span
            aria-hidden
            className="absolute top-2 left-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-lime text-pitch shadow-glow-lime"
            style={{ transform: 'rotate(-8deg)' }}
          >
            <Check className="w-4 h-4" strokeWidth={3.4} />
          </span>
        )}
        {status === 'duplicate' && (
          <span
            aria-hidden
            className="absolute top-2 right-2 inline-flex items-center justify-center min-w-[34px] h-7 px-1.5 rounded-full bg-cyan text-pitch text-xs font-display font-black tabular-nums shadow-glow-cyan"
            style={{ transform: 'rotate(6deg)' }}
          >
            ×{count}
          </span>
        )}
      </button>

      {!readOnly && (
        <div className="flex items-center justify-between border-t border-line px-1.5 py-1">
          <button
            type="button"
            onClick={() => decrement(sticker.code)}
            disabled={count === 0}
            aria-label={`Quitar una de ${sticker.code}`}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-lo hover:bg-line hover:text-hi active:bg-line-strong disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" strokeWidth={2.6} />
          </button>
          <span
            className={`text-[11px] font-bold uppercase tracking-[0.14em] tabular-nums ${
              status === 'have'
                ? 'text-lime'
                : status === 'duplicate'
                  ? 'text-cyan'
                  : 'text-lo'
            }`}
          >
            {count === 0 ? 'falta' : count === 1 ? 'la tengo' : `×${count}`}
          </span>
          <button
            type="button"
            onClick={() => increment(sticker.code)}
            aria-label={`Agregar una de ${sticker.code}`}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-lo hover:bg-magenta hover:text-white active:bg-magenta-dim transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2.6} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

function CompactCard({
  sticker,
  count,
  status,
  onInc,
  onDec,
  readOnly,
}: {
  sticker: Sticker;
  count: number;
  status: ReturnType<typeof statusFromCount>;
  onInc: () => void;
  onDec: () => void;
  readOnly?: boolean;
}) {
  const shell =
    status === 'have'
      ? 'bg-lime text-pitch border-lime shadow-glow-lime'
      : status === 'duplicate'
        ? 'bg-cyan text-pitch border-cyan shadow-glow-cyan'
        : 'bg-pitch-card text-hi border-line hover:border-line-strong';

  return (
    <motion.div
      whileHover={readOnly ? undefined : { y: -2 }}
      whileTap={readOnly ? undefined : { scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`group relative rounded-xl border transition-colors ${shell}`}
      data-testid={`sticker-${sticker.code}`}
    >
      <button
        type="button"
        onClick={onInc}
        disabled={readOnly}
        aria-label={`${sticker.code}${
          status === 'have'
            ? ' — la tengo'
            : status === 'duplicate'
              ? ` — repetida ×${count}`
              : ' — falta'
        }`}
        className="w-full h-14 sm:h-16 flex items-center justify-center disabled:cursor-default"
      >
        <span
          className={`font-display font-black tabular-nums tracking-tight ${
            sticker.code.length >= 6 ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'
          }`}
        >
          {sticker.code}
        </span>
        {status === 'have' && (
          <span
            aria-hidden
            className="absolute -top-1 -left-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pitch text-lime ring-2 ring-lime"
          >
            <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
          </span>
        )}
        {status === 'duplicate' && (
          <span
            aria-hidden
            className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[22px] h-5 px-1 rounded-full bg-pitch text-cyan ring-2 ring-cyan text-[10px] font-display font-black tabular-nums"
            style={{ transform: 'rotate(-6deg)' }}
          >
            ×{count}
          </span>
        )}
      </button>

      {!readOnly && count > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDec();
          }}
          aria-label={`Quitar una de ${sticker.code}`}
          className="absolute bottom-0.5 right-0.5 w-5 h-5 inline-flex items-center justify-center rounded-md bg-pitch/35 hover:bg-pitch/60 text-current opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        >
          <Minus className="w-3 h-3" strokeWidth={3} />
        </button>
      )}
    </motion.div>
  );
}
