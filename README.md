# Mi Álbum Mundial 2026

App web (PWA) para llevar el seguimiento del álbum de figuritas Panini del Mundial 2026: marcar las que tenés, contar las repetidas y compartir fácil tus faltantes y duplicadas.

## Características

- **Álbum por grupos** (A–L) más secciones **FWC** y **Coca-Cola**.
- **Conteo de repetidas**: 0 = falta, 1 = la tengo, N≥2 = repetidas.
- **Compartir por link**: genera una URL `/share?missing=…` o `/share?dup=…` con tu set codificado en un bitmap comprimido (no requiere backend).
- **Compartir por WhatsApp** integrado.
- **Export / Import** del álbum completo a JSON para backup.
- **Funciona offline** como PWA instalable.
- **Búsqueda** por código, país o número.

## Stack

Vite + React 18 + TypeScript + Tailwind CSS + React Router + Zustand (persist) + vite-plugin-pwa. Tests con Vitest + Testing Library.

## Desarrollo

Requiere Node 18+.

```bash
npm install
npm run dev          # dev server
npm run build        # typecheck + build de producción
npm run preview      # servir el build
npm run lint         # ESLint
npm test             # Vitest (una pasada)
npm run test:watch   # Vitest en watch
```

Alias de imports: `@/*` → `src/*`.

## Estructura

```
src/
  routes/       Páginas: Home, Buscar, Share, Ajustes
  components/   UI (StickerCard, GroupSection, ShareDialog, etc.)
  store/        Zustand store con persist en localStorage
  lib/          Sharing (bitmap+deflate+base64url), export/import, filtros, categorías
  data/         Catálogo de figuritas (fuente única de verdad)
  types.ts      Tipos y CURRENT_SCHEMA_VERSION
public/flags/   Banderas .webp / .svg
```

## Notas sobre el catálogo

El orden de `STICKERS` en [src/data/stickers.ts](src/data/stickers.ts) es **estable y load-bearing**: cada figurita tiene un `index` global que el sistema de sharing usa como posición en un bitmap. Cambiar el orden o el tamaño del catálogo invalida los links generados con versiones anteriores. Si hay que romper compatibilidad, subir `CURRENT_SCHEMA_VERSION` en [src/types.ts](src/types.ts).

## Privacidad

Todo el estado del álbum vive en `localStorage` del navegador (key `album-panini-2026`). No hay backend ni telemetría. Los links de compartir contienen sólo el set de códigos, no datos personales.
