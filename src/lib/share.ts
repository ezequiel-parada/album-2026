import pako from 'pako';
import { CATALOG_SIZE, STICKERS } from '@/data/stickers';
import type { Sticker } from '@/types';

/**
 * Codifica un conjunto de figuritas como bitmap comprimido + base64url.
 *
 * Layout (antes de deflate):
 *   bytes 0..1  : tamaño del catálogo (uint16, little-endian) — fingerprint
 *   bytes 2..   : bitmap de ceil(size/8) bytes; bit `index % 8` del byte `floor(index/8)`
 *
 * Si el catálogo cambia de tamaño, los tokens viejos serán rechazados al decodificar.
 */

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function encodeCodes(codes: Iterable<string>): string {
  const size = CATALOG_SIZE;
  const buf = new Uint8Array(2 + Math.ceil(size / 8));
  buf[0] = size & 0xff;
  buf[1] = (size >> 8) & 0xff;

  const byCode: Record<string, Sticker> = {};
  for (const s of STICKERS) byCode[s.code] = s;

  for (const code of codes) {
    const s = byCode[code];
    if (!s) continue;
    const i = s.index;
    buf[2 + (i >> 3)] |= 1 << (i & 7);
  }

  const deflated = pako.deflate(buf);
  return toBase64Url(deflated);
}

export interface DecodeResult {
  codes: string[];
  /** true cuando el catálogo del token coincide con el actual */
  catalogMatches: boolean;
  /** tamaño declarado por el token */
  declaredSize: number;
}

export function decodeToken(token: string): DecodeResult {
  const inflated = pako.inflate(fromBase64Url(token));
  if (inflated.length < 2) {
    return { codes: [], catalogMatches: false, declaredSize: 0 };
  }
  const declared = inflated[0] | (inflated[1] << 8);
  const expectedLen = 2 + Math.ceil(declared / 8);
  if (inflated.length < expectedLen) {
    return { codes: [], catalogMatches: false, declaredSize: declared };
  }
  if (declared !== CATALOG_SIZE) {
    return { codes: [], catalogMatches: false, declaredSize: declared };
  }

  const codes: string[] = [];
  for (const s of STICKERS) {
    const i = s.index;
    const byte = inflated[2 + (i >> 3)] ?? 0;
    if ((byte >> (i & 7)) & 1) codes.push(s.code);
  }
  return { codes, catalogMatches: true, declaredSize: declared };
}

export type ShareKind = 'missing' | 'dup';

export function buildShareUrl(kind: ShareKind, codes: Iterable<string>): string {
  const token = encodeCodes(codes);
  const base = `${window.location.origin}/share`;
  return `${base}?${kind}=${token}`;
}
