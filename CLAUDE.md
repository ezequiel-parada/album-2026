# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b` (typecheck) seguido de `vite build`
- `npm run preview` — sirve el build de producción
- `npm run lint` — ESLint sobre todo el repo
- `npm test` — Vitest, una pasada (jsdom)
- `npm run test:watch` — Vitest en modo watch
- Un solo test: `npx vitest run src/lib/share.test.ts` o filtrar por nombre con `-t "patrón"`

Idioma de UI y copy: español (rioplatense). Las funciones/identifiers en código siguen en inglés.

## Arquitectura

App SPA (Vite + React 18 + TypeScript + Tailwind + React Router) para registrar el progreso del álbum Panini del Mundial 2026. Funciona offline como PWA (`vite-plugin-pwa`, `registerType: 'autoUpdate'`).

### Modelo de datos

- `Sticker` (`src/types.ts`): cada figurita tiene `code` (ej. `ARG18`, `FWC5`, `CC3`), `prefix`, `number`, opcional `group`/`country`, y un **`index` global estable** que define la posición en el catálogo.
- `AlbumState.counts: Record<code, number>`: `0` = falta, `1` = la tengo, `N≥2` = tengo + (N−1) repetidas. Helper `statusFromCount` en el store.
- Tres categorías derivadas en `src/lib/category.ts`: `TEAM` (figuritas de selecciones), `FWC` (FIFA World Cup), `CC` (Coca-Cola).

### Catálogo (`src/data/stickers.ts`)

Fuente única de verdad. **El orden de `STICKERS` y por tanto cada `index` es load-bearing** porque el sharing los usa como bitmap. Reglas:

- No reordenar `TEAMS` ni cambiar el conteo por categoría sin subir `CURRENT_SCHEMA_VERSION` en `src/types.ts`.
- Banderas en `/public/flags/{CODE}.{webp|svg}`. ENG/SCO usan SVG; el resto webp.

### Estado

`src/store/useAlbum.ts` — Zustand con `persist` middleware. Key de localStorage: `album-panini-2026`, versionada con `CURRENT_SCHEMA_VERSION`. Mutaciones (`increment`/`decrement`/`setCount`) actualizan `updatedAt`; setear count a 0 elimina la clave.

### Sharing (`src/lib/share.ts`)

Codifica un set de códigos como bitmap deflate-comprimido + base64url, embebido en URL `/share?missing=…` o `/share?dup=…`. Layout: 2 bytes con `CATALOG_SIZE` (fingerprint, little-endian) + bitmap de `ceil(size/8)` bytes; bit `index % 8` del byte `floor(index/8)`. Al decodificar se rechaza el token si el catálogo difiere — por eso `STICKERS[*].index` debe ser estable entre versiones que comparten links.

WhatsApp share helpers en `src/lib/whatsappShare.ts`.

### Export / Import (`src/lib/exportImport.ts`)

Backup completo a JSON (`album-panini-2026-YYYYMMDD.json`) con `{ app, version, exportedAt, counts }`. `parseImport` valida la firma `app` y rechaza versiones distintas a `CURRENT_SCHEMA_VERSION` (no hay migraciones todavía — para romper compatibilidad hay que subir la versión y agregar lógica de migración).

### Rutas (`src/routes/`)

- `/` `HomeRoute` — vista del álbum por grupo
- `/buscar` `SearchRoute`
- `/share` `ShareViewRoute` — lee `?missing=` / `?dup=` y muestra el set decodificado. En esta ruta `App.tsx` oculta el header de onboarding y la barra de navegación inferior.
- `/ajustes` `SettingsRoute` — export/import/reset

### Estilo

Tailwind con paleta y tipografías custom (`tailwind.config.ts`): tema oscuro (`pitch`, `hi`/`lo`), acentos `magenta`/`cyan`/`lime`/`sun`/`flame`, fuentes `Hanken Grotesk` (sans) y `Big Shoulders Display` (display). Hay aliases legacy (`canvas`, `ink`, `have`, `dup`, `miss`) conservados durante una transición — preferir los nombres nuevos en código nuevo.

### Alias de import

`@/*` → `src/*` (configurado en `vite.config.ts` y `tsconfig.app.json`).

### Tests

Vitest con `environment: 'jsdom'`, globals activados, setup en `src/test/setup.ts` (Testing Library + jest-dom). Tests viven junto al código (`src/lib/*.test.ts`).
