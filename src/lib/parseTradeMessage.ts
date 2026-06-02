import { STICKERS_BY_CODE, TEAM_CODES } from '@/data/stickers';

/**
 * Resultado de parsear el mensaje de otra persona (p. ej. exportado por
 * figuritas.app) con sus figuritas faltantes y repetidas.
 */
export interface ParsedTradeMessage {
  /** Códigos válidos que a la otra persona le faltan. */
  missing: string[];
  /** Códigos válidos que la otra persona tiene repetidos. */
  dup: string[];
  /** Tokens crudos que no mapean a ninguna figurita del catálogo (p. ej. "CC 13"). */
  unmatched: string[];
}

type Section = 'missing' | 'dup' | null;

const TEAM_CODE_SET = new Set(TEAM_CODES);

/**
 * Línea de datos: `PREFIJO <emoji/espacios>: n, n, n`.
 * Captura el prefijo alfabético (2-3 letras) y la lista de números tras el `:`.
 * El `\b` evita matchear palabras más largas (p. ej. "https").
 */
const DATA_LINE = /^\s*([A-Za-z]{2,3})\b[^:]*:\s*(.+)$/;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Arma el código candidato para un prefijo + número, o `null` si el prefijo es desconocido. */
function candidateCode(prefix: string, n: number): string | null {
  if (prefix === 'FWC') return `FWC${pad2(n)}`;
  if (prefix === 'CC') return `CC${pad2(n)}`;
  if (TEAM_CODE_SET.has(prefix)) return `${prefix}${n}`;
  return null;
}

export function parseTradeMessage(text: string): ParsedTradeMessage {
  const missing: string[] = [];
  const dup: string[] = [];
  const unmatched: string[] = [];

  let section: Section = null;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    const match = DATA_LINE.exec(line);
    if (match) {
      const prefix = match[1].toUpperCase();
      // Sólo procesamos prefijos conocidos; si no, la línea no es de datos.
      if (candidateCode(prefix, 1) === null) {
        applyHeader(line);
        continue;
      }
      if (!section) continue;

      const numbers = match[2]
        .split(',')
        .map((part) => parseInt(part.trim(), 10))
        .filter((n) => Number.isInteger(n));

      const target = section === 'missing' ? missing : dup;
      for (const n of numbers) {
        const code = candidateCode(prefix, n);
        if (code && STICKERS_BY_CODE[code]) target.push(code);
        else unmatched.push(`${prefix} ${n}`);
      }
      continue;
    }

    applyHeader(line);
  }

  function applyHeader(line: string): void {
    const lower = line.toLowerCase();
    if (lower.includes('falta')) section = 'missing';
    else if (lower.includes('repetid')) section = 'dup';
  }

  return { missing, dup, unmatched };
}
