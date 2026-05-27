import { CURRENT_SCHEMA_VERSION, type AlbumState } from '@/types';

export interface ExportFile {
  app: 'album-panini-2026';
  version: number;
  exportedAt: string;
  counts: Record<string, number>;
}

export function buildExportFile(state: Pick<AlbumState, 'counts'>): ExportFile {
  return {
    app: 'album-panini-2026',
    version: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    counts: { ...state.counts },
  };
}

export function downloadAlbum(state: Pick<AlbumState, 'counts'>): void {
  const data = buildExportFile(state);
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  a.href = url;
  a.download = `album-panini-2026-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ImportPreview {
  ok: true;
  counts: Record<string, number>;
  totalHave: number;
  totalDup: number;
  exportedAt?: string;
}

export interface ImportError {
  ok: false;
  reason: string;
}

export type ImportResult = ImportPreview | ImportError;

export function parseImport(input: string): ImportResult {
  let json: unknown;
  try {
    json = JSON.parse(input);
  } catch {
    return { ok: false, reason: 'El archivo no es JSON válido.' };
  }
  if (!json || typeof json !== 'object') {
    return { ok: false, reason: 'El archivo no tiene el formato esperado.' };
  }
  const obj = json as Record<string, unknown>;
  if (obj.app !== 'album-panini-2026') {
    return {
      ok: false,
      reason: 'No es un archivo de Mi Álbum Panini 2026.',
    };
  }
  if (typeof obj.version !== 'number') {
    return { ok: false, reason: 'Versión del archivo desconocida.' };
  }
  if (obj.version !== CURRENT_SCHEMA_VERSION) {
    return {
      ok: false,
      reason: `Versión del archivo no compatible (v${obj.version}). Esta app usa v${CURRENT_SCHEMA_VERSION}.`,
    };
  }
  const counts = obj.counts;
  if (!counts || typeof counts !== 'object') {
    return { ok: false, reason: 'El archivo no tiene la lista de figuritas.' };
  }
  const cleaned: Record<string, number> = {};
  for (const [k, v] of Object.entries(counts as Record<string, unknown>)) {
    if (typeof k !== 'string') continue;
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 1) continue;
    cleaned[k] = Math.floor(v);
  }

  let totalHave = 0;
  let totalDup = 0;
  for (const n of Object.values(cleaned)) {
    if (n >= 1) totalHave++;
    if (n >= 2) totalDup += n - 1;
  }

  return {
    ok: true,
    counts: cleaned,
    totalHave,
    totalDup,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : undefined,
  };
}
