export interface Sticker {
  /** Código completo, ej: "ARG18", "FWC5", "CC3" */
  code: string;
  /** Prefijo derivado (3 letras: país, o "FWC" / "CC") */
  prefix: string;
  /** Parte numérica del código */
  number: number;
  /** Grupo A..L cuando es figurita de equipo */
  group?: string;
  /** Nombre legible del país cuando aplica */
  country?: string;
  /** Posición global en el catálogo. ESTABLE: cambiarlo invalida links de sharing. */
  index: number;
  /** Texto opcional (nombre de jugador, descripción) */
  label?: string;
}

export type Category = 'TEAM' | 'FWC' | 'CC';

export interface AlbumState {
  version: number;
  /** 0 = falta, 1 = la tengo, N≥2 = tengo + (N-1) repetidas */
  counts: Record<string, number>;
  updatedAt: string;
}

export type Status = 'missing' | 'have' | 'duplicate';

export const CURRENT_SCHEMA_VERSION = 1;
