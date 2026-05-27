import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBox } from '@/components/SearchBox';
import { StickerCard } from '@/components/StickerCard';
import { STICKERS_BY_CODE } from '@/data/stickers';
import { normalizeCode } from '@/lib/filter';

export function SearchRoute() {
  const [raw, setRaw] = useState('');
  const normalized = normalizeCode(raw);
  const found = useMemo(
    () => (normalized ? STICKERS_BY_CODE[normalized] : undefined),
    [normalized],
  );

  return (
    <div className="space-y-5">
      <header className="space-y-1.5">
        <div className="eyebrow">Búsqueda directa</div>
        <h1 className="display text-5xl sm:text-6xl leading-[0.95] text-hi tracking-tight">
          BUSCAR <span className="text-gradient-energy">FIGURITA</span>
        </h1>
        <p className="text-sm text-lo max-w-md">
          Escribí el código tal como aparece en la figurita.
        </p>
      </header>

      <SearchBox
        value={raw}
        onChange={setRaw}
        placeholder="Ej. ARG18, FWC5, CC3"
      />

      {!raw && (
        <p className="text-sm text-lo text-center pt-6">
          Empezá a escribir un código.
        </p>
      )}

      <AnimatePresence mode="wait">
        {raw && !found && (
          <motion.div
            key="notfound"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card p-6 text-center"
          >
            <p className="font-display font-black text-xl text-hi">
              Ese código no existe en el álbum.
            </p>
            <p className="text-sm text-lo mt-1">
              ¿Lo escribiste bien? Probá con algo como{' '}
              <strong className="text-cyan font-display">ARG18</strong>.
            </p>
          </motion.div>
        )}

        {found && (
          <motion.div
            key={found.code}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="max-w-xs mx-auto"
          >
            <StickerCard sticker={found} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
