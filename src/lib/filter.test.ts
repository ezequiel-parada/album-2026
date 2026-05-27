import { describe, it, expect } from 'vitest';
import { emptyFilters, filterStickers, normalizeCode } from './filter';
import { STICKERS } from '@/data/stickers';

describe('filter', () => {
  it('returns all stickers with default filters', () => {
    const r = filterStickers(STICKERS, {}, emptyFilters());
    expect(r.length).toBe(STICKERS.length);
  });

  it('filters by a specific group', () => {
    const r = filterStickers(STICKERS, {}, { ...emptyFilters(), group: 'A' });
    expect(r.every((s) => s.group === 'A')).toBe(true);
    expect(r.length).toBeGreaterThan(0);
  });

  it('filters SPECIALS to only FWC and CC', () => {
    const r = filterStickers(STICKERS, {}, { ...emptyFilters(), group: 'SPECIALS' });
    expect(r.every((s) => s.prefix === 'FWC' || s.prefix === 'CC')).toBe(true);
    expect(r.length).toBeGreaterThan(0);
  });

  it('filters by status missing', () => {
    const counts = { ARG1: 1, FWC02: 2 };
    const r = filterStickers(STICKERS, counts, {
      ...emptyFilters(),
      status: 'missing',
    });
    expect(r.some((s) => s.code === 'ARG1')).toBe(false);
    expect(r.some((s) => s.code === 'FWC02')).toBe(false);
  });

  it('combines group + status', () => {
    const counts = { ARG1: 1 };
    const r = filterStickers(STICKERS, counts, {
      group: 'J',
      status: 'missing',
      query: '',
    });
    expect(r.every((s) => s.group === 'J')).toBe(true);
    expect(r.some((s) => s.code === 'ARG1')).toBe(false);
  });

  it('filters by query substring', () => {
    const r = filterStickers(STICKERS, {}, {
      ...emptyFilters(),
      query: 'arg1',
    });
    expect(r.every((s) => s.code.includes('ARG1'))).toBe(true);
  });

  it('normalizes code input', () => {
    expect(normalizeCode(' arg18 ')).toBe('ARG18');
    expect(normalizeCode('fwc 5')).toBe('FWC5');
  });
});
