import { describe, it, expect } from 'vitest';
import { encodeCodes, decodeToken } from './share';
import { STICKERS } from '@/data/stickers';

describe('share encode/decode', () => {
  it('roundtrip preserves the exact set of codes', () => {
    const sample = ['ARG1', 'ARG18', 'FWC05', 'CC03'];
    const token = encodeCodes(sample);
    const { codes, catalogMatches } = decodeToken(token);
    expect(catalogMatches).toBe(true);
    expect([...codes].sort()).toEqual([...sample].sort());
  });

  it('ignores unknown codes silently', () => {
    const token = encodeCodes(['ARG1', 'XXX99']);
    const { codes } = decodeToken(token);
    expect(codes).toEqual(['ARG1']);
  });

  it('handles empty set', () => {
    const token = encodeCodes([]);
    const { codes, catalogMatches } = decodeToken(token);
    expect(catalogMatches).toBe(true);
    expect(codes).toEqual([]);
  });

  it('produces stable output for every catalog entry', () => {
    const all = STICKERS.map((s) => s.code);
    const token = encodeCodes(all);
    const { codes } = decodeToken(token);
    expect(codes.length).toBe(all.length);
    expect(new Set(codes)).toEqual(new Set(all));
  });
});
