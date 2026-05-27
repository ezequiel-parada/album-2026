import type { Category, Sticker } from '@/types';

export function categoryOf(sticker: Sticker): Category {
  if (sticker.prefix === 'FWC') return 'FWC';
  if (sticker.prefix === 'CC') return 'CC';
  return 'TEAM';
}

export function categoryLabel(c: Category): string {
  switch (c) {
    case 'TEAM':
      return 'Equipos';
    case 'FWC':
      return 'FWC';
    case 'CC':
      return 'Coca-Cola';
  }
}
