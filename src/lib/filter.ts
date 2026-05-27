import type { Sticker, Status } from '@/types';
import { statusFromCount } from '@/store/useAlbum';

export type GroupKey =
  | 'ALL'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'SPECIALS';

export type StatusKey = 'all' | Status;

export interface Filters {
  group: GroupKey;
  status: StatusKey;
  query: string;
}

export const TEAM_GROUP_KEYS: Array<Exclude<GroupKey, 'ALL' | 'SPECIALS'>> = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
];

export function emptyFilters(): Filters {
  return { group: 'ALL', status: 'all', query: '' };
}

export function filterStickers(
  stickers: Sticker[],
  counts: Record<string, number>,
  f: Filters,
): Sticker[] {
  const q = (f.query ?? '').trim().toUpperCase();
  return stickers.filter((s) => {
    if (f.group !== 'ALL') {
      if (f.group === 'SPECIALS') {
        if (s.prefix !== 'FWC' && s.prefix !== 'CC') return false;
      } else if (s.group !== f.group) return false;
    }
    if (f.status !== 'all') {
      if (statusFromCount(counts[s.code]) !== f.status) return false;
    }
    if (q && !s.code.includes(q)) return false;
    return true;
  });
}

export function normalizeCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}
