import { STICKERS } from '@/data/stickers';
import { statusFromCount } from '@/store/useAlbum';
import type { ParsedTradeMessage } from '@/lib/parseTradeMessage';

export interface TradeResult {
  /** Mis repetidas que a la otra persona le faltan (se las puedo dar). */
  iGive: string[];
  /** Mis faltantes que la otra persona tiene repetidas (me las puede dar). */
  iGet: string[];
}

/**
 * Cruza mi álbum contra la lista parseada de otra persona para proponer un
 * intercambio. Devuelve los códigos ordenados según el catálogo (índice global).
 */
export function computeTrade(
  counts: Record<string, number>,
  parsed: ParsedTradeMessage,
): TradeResult {
  const myDup = new Set<string>();
  const myMissing = new Set<string>();

  for (const s of STICKERS) {
    const status = statusFromCount(counts[s.code]);
    if (status === 'duplicate') myDup.add(s.code);
    else if (status === 'missing') myMissing.add(s.code);
  }

  const friendMissing = new Set(parsed.missing);
  const friendDup = new Set(parsed.dup);

  const iGive: string[] = [];
  const iGet: string[] = [];

  // Iteramos STICKERS para mantener el orden estable del catálogo.
  for (const s of STICKERS) {
    if (myDup.has(s.code) && friendMissing.has(s.code)) iGive.push(s.code);
    if (myMissing.has(s.code) && friendDup.has(s.code)) iGet.push(s.code);
  }

  return { iGive, iGet };
}
