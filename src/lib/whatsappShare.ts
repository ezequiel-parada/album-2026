import { STICKERS, STICKERS_BY_CODE, TEAM_GROUPS } from '@/data/stickers';
import { categoryOf } from '@/lib/category';

interface Bucket {
  byGroup: Map<string, Map<string, { country: string; codes: string[] }>>;
  fwc: string[];
  cc: string[];
}

function emptyBucket(): Bucket {
  return { byGroup: new Map(), fwc: [], cc: [] };
}

function pushCode(bucket: Bucket, code: string): void {
  const s = STICKERS_BY_CODE[code];
  if (!s) return;
  const cat = categoryOf(s);
  if (cat === 'FWC') {
    bucket.fwc.push(code);
    return;
  }
  if (cat === 'CC') {
    bucket.cc.push(code);
    return;
  }
  const group = s.group ?? '?';
  let teamsInGroup = bucket.byGroup.get(group);
  if (!teamsInGroup) {
    teamsInGroup = new Map();
    bucket.byGroup.set(group, teamsInGroup);
  }
  let team = teamsInGroup.get(s.prefix);
  if (!team) {
    team = { country: s.country ?? s.prefix, codes: [] };
    teamsInGroup.set(s.prefix, team);
  }
  team.codes.push(code);
}

function numericPart(code: string): number {
  return parseInt(code.replace(/^[A-Z]+/, ''), 10);
}

function sortByNumber(a: string, b: string): number {
  return numericPart(a) - numericPart(b);
}

function renderBucket(bucket: Bucket): string {
  const lines: string[] = [];

  const sortedGroups = TEAM_GROUPS.filter((g) => bucket.byGroup.has(g));
  sortedGroups.forEach((group, idx) => {
    const teamsInGroup = bucket.byGroup.get(group)!;
    const teams = [...teamsInGroup.values()].sort((a, b) =>
      a.country.localeCompare(b.country, 'es'),
    );
    lines.push(`Grupo ${group}`);
    for (const team of teams) {
      const codes = [...team.codes].sort(sortByNumber).join(', ');
      lines.push(`  ${team.country}: ${codes}`);
    }
    if (idx < sortedGroups.length - 1) lines.push('');
  });

  if (bucket.fwc.length) {
    if (lines.length) lines.push('');
    lines.push(`FWC: ${[...bucket.fwc].sort(sortByNumber).join(', ')}`);
  }
  if (bucket.cc.length) {
    if (!bucket.fwc.length && lines.length) lines.push('');
    lines.push(`Coca-Cola: ${[...bucket.cc].sort(sortByNumber).join(', ')}`);
  }

  return lines.join('\n');
}

export function buildWhatsappText(counts: Record<string, number>): string {
  const dup = emptyBucket();
  const missing = emptyBucket();
  let hasDup = false;
  let hasMissing = false;

  for (const s of STICKERS) {
    const n = counts[s.code] ?? 0;
    if (n >= 2) {
      pushCode(dup, s.code);
      hasDup = true;
    } else if (n === 0) {
      pushCode(missing, s.code);
      hasMissing = true;
    }
  }

  const sections: string[] = [];
  if (hasDup) {
    sections.push(`🔁 REPETIDAS\n\n${renderBucket(dup)}`);
  }
  if (hasMissing) {
    sections.push(`❌ ME FALTAN\n\n${renderBucket(missing)}`);
  }

  return sections.join('\n\n');
}

export function hasAnyToShare(counts: Record<string, number>): boolean {
  for (const s of STICKERS) {
    const n = counts[s.code] ?? 0;
    if (n === 0 || n >= 2) return true;
  }
  return false;
}
