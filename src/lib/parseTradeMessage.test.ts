import { describe, it, expect } from 'vitest';
import { parseTradeMessage } from './parseTradeMessage';

const MESSAGE = `Figuritas App - Lista
Usa Méx Can 26
Me faltan
FWC 🏆: 3
FWC 🌎: 8
MEX 🇲🇽: 17
KOR 🇰🇷: 1, 13
CC 🥤: 12, 13

Repetidas
FWC 🌎: 6, 7
ARG 🇦🇷: 7, 8
CC 🥤: 2, 8

Descarga la app
https://www.figuritas.app/es/descargar`;

describe('parseTradeMessage', () => {
  it('separa faltantes y repetidas según los encabezados', () => {
    const { missing, dup } = parseTradeMessage(MESSAGE);
    expect([...missing].sort()).toEqual(
      ['FWC03', 'FWC08', 'MEX17', 'KOR1', 'KOR13', 'CC12'].sort(),
    );
    expect([...dup].sort()).toEqual(
      ['FWC06', 'FWC07', 'ARG7', 'ARG8', 'CC02', 'CC08'].sort(),
    );
  });

  it('mapea FWC por número ignorando el emoji de subcategoría', () => {
    const { missing, dup } = parseTradeMessage(MESSAGE);
    // 🏆 y 🌎 caen en la misma lista plana FWC00..FWC19
    expect(missing).toContain('FWC03');
    expect(missing).toContain('FWC08');
    expect(dup).toContain('FWC06');
  });

  it('reporta como unmatched los números fuera de rango (CC 13)', () => {
    const { unmatched } = parseTradeMessage(MESSAGE);
    expect(unmatched).toEqual(['CC 13']);
  });

  it('ignora líneas que no son de datos (títulos, URL)', () => {
    const { missing, dup, unmatched } = parseTradeMessage(MESSAGE);
    const all = [...missing, ...dup, ...unmatched];
    expect(all.some((c) => c.includes('http'))).toBe(false);
  });

  it('detecta secciones sin importar mayúsculas/minúsculas', () => {
    const msg = 'ME FALTAN\nARG 🇦🇷: 5\nREPETIDAS\nMEX: 3';
    const { missing, dup } = parseTradeMessage(msg);
    expect(missing).toEqual(['ARG5']);
    expect(dup).toEqual(['MEX3']);
  });

  it('devuelve listas vacías para texto sin figuritas', () => {
    expect(parseTradeMessage('hola qué tal')).toEqual({
      missing: [],
      dup: [],
      unmatched: [],
    });
  });
});
