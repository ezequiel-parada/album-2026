import { describe, it, expect } from 'vitest';
import { buildExportFile, parseImport } from './exportImport';
import { CURRENT_SCHEMA_VERSION } from '@/types';

describe('exportImport', () => {
  it('roundtrips a valid album', () => {
    const exported = buildExportFile({ counts: { ARG1: 1, ARG2: 3 } });
    const parsed = parseImport(JSON.stringify(exported));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.counts).toEqual({ ARG1: 1, ARG2: 3 });
      expect(parsed.totalHave).toBe(2);
      expect(parsed.totalDup).toBe(2);
    }
  });

  it('rejects invalid JSON', () => {
    const r = parseImport('not json');
    expect(r.ok).toBe(false);
  });

  it('rejects wrong app marker', () => {
    const r = parseImport(JSON.stringify({ app: 'other', version: 1, counts: {} }));
    expect(r.ok).toBe(false);
  });

  it('rejects unknown version', () => {
    const r = parseImport(
      JSON.stringify({
        app: 'album-panini-2026',
        version: CURRENT_SCHEMA_VERSION + 99,
        counts: {},
      }),
    );
    expect(r.ok).toBe(false);
  });

  it('cleans bad count values', () => {
    const r = parseImport(
      JSON.stringify({
        app: 'album-panini-2026',
        version: CURRENT_SCHEMA_VERSION,
        counts: { ARG1: 0, ARG2: -5, ARG3: 2.7, ARG4: 'bad', ARG5: 4 },
      }),
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.counts).toEqual({ ARG3: 2, ARG5: 4 });
    }
  });
});
