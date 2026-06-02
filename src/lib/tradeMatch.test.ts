import { describe, it, expect } from 'vitest';
import { computeTrade } from './tradeMatch';

describe('computeTrade', () => {
  it('cruza mis repetidas con lo que al otro le falta, y viceversa', () => {
    const counts = { ARG7: 2, FWC03: 2 }; // mis repetidas (status duplicate)
    const parsed = {
      missing: ['ARG7', 'MEX1'], // al amigo le faltan
      dup: ['KOR5', 'CC02'], // el amigo tiene repetidas
      unmatched: [],
    };

    const { iGive, iGet } = computeTrade(counts, parsed);

    // Le puedo dar: mi repetida ARG7 que a él le falta (FWC03 él no la pide).
    expect(iGive).toEqual(['ARG7']);
    // Me puede dar: sus repetidas que a mí me faltan (KOR5, CC02 no las tengo).
    expect(iGet).toEqual(['KOR5', 'CC02']);
  });

  it('no propone figuritas que tengo una sola (no son repetidas)', () => {
    const counts = { ARG7: 1 }; // la tengo pero no repetida
    const parsed = { missing: ['ARG7'], dup: [], unmatched: [] };
    expect(computeTrade(counts, parsed).iGive).toEqual([]);
  });

  it('mantiene el orden del catálogo en los resultados', () => {
    const parsed = {
      missing: [],
      dup: ['CC02', 'KOR5', 'ARG1'], // desordenado respecto al catálogo
      unmatched: [],
    };
    // ninguna en counts => todas faltantes para mí.
    // Orden del catálogo: KOR (grupo A) < ARG (grupo J) < CC.
    const { iGet } = computeTrade({}, parsed);
    expect(iGet).toEqual(['KOR5', 'ARG1', 'CC02']);
  });
});
