import type { Sticker } from "@/types";

/**
 * Catálogo del álbum Panini Mundial 2026.
 *
 * IMPORTANTE: el orden global (`index` consecutivo) se usa para codificar
 * los links de compartir como bitmap. Si cambia el orden de TEAMS o el
 * conteo de stickers por categoría, los links viejos dejan de ser
 * interpretables. Mantené `STICKERS` estable o subí
 * `CURRENT_SCHEMA_VERSION` (ver src/types.ts).
 *
 * Banderas: archivos en /public/flags/{CODE}.{webp|svg}. Worldometers
 * provee el .webp para 46 países; ENG y SCO usan SVG porque worldometers
 * solo tiene la bandera del Reino Unido.
 */

export interface TeamDef {
  /** Código FIFA de 3 letras */
  code: string;
  country: string;
  group: string;
  /** Archivo en /public/flags relativo a la raíz */
  flag: string;
}

const TEAMS: TeamDef[] = [
  // Grupo A
  { code: "MEX", country: "México", group: "A", flag: "/flags/MEX.webp" },
  { code: "RSA", country: "Sudáfrica", group: "A", flag: "/flags/RSA.webp" },
  {
    code: "KOR",
    country: "Corea del Sur",
    group: "A",
    flag: "/flags/KOR.webp",
  },
  {
    code: "CZE",
    country: "República Checa",
    group: "A",
    flag: "/flags/CZE.webp",
  },
  // Grupo B
  { code: "CAN", country: "Canadá", group: "B", flag: "/flags/CAN.webp" },
  {
    code: "BIH",
    country: "Bosnia y Herzegovina",
    group: "B",
    flag: "/flags/BIH.webp",
  },
  { code: "QAT", country: "Catar", group: "B", flag: "/flags/QAT.webp" },
  { code: "SUI", country: "Suiza", group: "B", flag: "/flags/SUI.webp" },
  // Grupo C
  { code: "BRA", country: "Brasil", group: "C", flag: "/flags/BRA.webp" },
  { code: "MAR", country: "Marruecos", group: "C", flag: "/flags/MAR.webp" },
  { code: "HAI", country: "Haití", group: "C", flag: "/flags/HAI.webp" },
  { code: "SCO", country: "Escocia", group: "C", flag: "/flags/SCO.svg" },
  // Grupo D
  {
    code: "USA",
    country: "Estados Unidos",
    group: "D",
    flag: "/flags/USA.webp",
  },
  { code: "PAR", country: "Paraguay", group: "D", flag: "/flags/PAR.webp" },
  { code: "AUS", country: "Australia", group: "D", flag: "/flags/AUS.webp" },
  { code: "TUR", country: "Turquía", group: "D", flag: "/flags/TUR.webp" },
  // Grupo E
  { code: "GER", country: "Alemania", group: "E", flag: "/flags/GER.webp" },
  { code: "CUW", country: "Curazao", group: "E", flag: "/flags/CUW.webp" },
  {
    code: "CIV",
    country: "Costa de Marfil",
    group: "E",
    flag: "/flags/CIV.webp",
  },
  { code: "ECU", country: "Ecuador", group: "E", flag: "/flags/ECU.webp" },
  // Grupo F
  { code: "NED", country: "Países Bajos", group: "F", flag: "/flags/NED.webp" },
  { code: "JPN", country: "Japón", group: "F", flag: "/flags/JPN.webp" },
  { code: "SWE", country: "Suecia", group: "F", flag: "/flags/SWE.webp" },
  { code: "TUN", country: "Túnez", group: "F", flag: "/flags/TUN.webp" },
  // Grupo G
  { code: "BEL", country: "Bélgica", group: "G", flag: "/flags/BEL.webp" },
  { code: "EGY", country: "Egipto", group: "G", flag: "/flags/EGY.webp" },
  { code: "IRN", country: "Irán", group: "G", flag: "/flags/IRN.webp" },
  {
    code: "NZL",
    country: "Nueva Zelanda",
    group: "G",
    flag: "/flags/NZL.webp",
  },
  // Grupo H
  { code: "ESP", country: "España", group: "H", flag: "/flags/ESP.webp" },
  { code: "CPV", country: "Cabo Verde", group: "H", flag: "/flags/CPV.webp" },
  {
    code: "KSA",
    country: "Arabia Saudita",
    group: "H",
    flag: "/flags/KSA.webp",
  },
  { code: "URU", country: "Uruguay", group: "H", flag: "/flags/URU.webp" },
  // Grupo I
  { code: "FRA", country: "Francia", group: "I", flag: "/flags/FRA.webp" },
  { code: "SEN", country: "Senegal", group: "I", flag: "/flags/SEN.webp" },
  { code: "IRQ", country: "Irak", group: "I", flag: "/flags/IRQ.webp" },
  { code: "NOR", country: "Noruega", group: "I", flag: "/flags/NOR.webp" },
  // Grupo J
  { code: "ARG", country: "Argentina", group: "J", flag: "/flags/ARG.webp" },
  { code: "ALG", country: "Argelia", group: "J", flag: "/flags/ALG.webp" },
  { code: "AUT", country: "Austria", group: "J", flag: "/flags/AUT.webp" },
  { code: "JOR", country: "Jordania", group: "J", flag: "/flags/JOR.webp" },
  // Grupo K
  { code: "POR", country: "Portugal", group: "K", flag: "/flags/POR.webp" },
  {
    code: "COD",
    country: "R.D. del Congo",
    group: "K",
    flag: "/flags/COD.webp",
  },
  { code: "UZB", country: "Uzbekistán", group: "K", flag: "/flags/UZB.webp" },
  { code: "COL", country: "Colombia", group: "K", flag: "/flags/COL.webp" },
  // Grupo L
  { code: "ENG", country: "Inglaterra", group: "L", flag: "/flags/ENG.svg" },
  { code: "CRO", country: "Croacia", group: "L", flag: "/flags/CRO.webp" },
  { code: "GHA", country: "Ghana", group: "L", flag: "/flags/GHA.webp" },
  { code: "PAN", country: "Panamá", group: "L", flag: "/flags/PAN.webp" },
];

const STICKERS_PER_TEAM = 20;
const FWC_RANGE = { start: 0, end: 19 }; // FWC00..FWC19
const CC_RANGE = { start: 1, end: 12 }; // CC01..CC12

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function buildCatalog(): Sticker[] {
  const out: Sticker[] = [];
  let index = 0;

  for (const team of TEAMS) {
    for (let n = 1; n <= STICKERS_PER_TEAM; n++) {
      out.push({
        code: `${team.code}${n}`,
        prefix: team.code,
        number: n,
        group: team.group,
        country: team.country,
        index: index++,
      });
    }
  }

  for (let n = FWC_RANGE.start; n <= FWC_RANGE.end; n++) {
    out.push({
      code: `FWC${pad2(n)}`,
      prefix: "FWC",
      number: n,
      index: index++,
    });
  }

  for (let n = CC_RANGE.start; n <= CC_RANGE.end; n++) {
    out.push({
      code: `CC${pad2(n)}`,
      prefix: "CC",
      number: n,
      index: index++,
    });
  }

  return out;
}

export const STICKERS: Sticker[] = buildCatalog();

export const STICKERS_BY_CODE: Record<string, Sticker> = Object.fromEntries(
  STICKERS.map((s) => [s.code, s]),
);

export const CATALOG_SIZE = STICKERS.length;

export const TEAMS_META = TEAMS;

export const TEAM_CODES: string[] = TEAMS.map((t) => t.code);

export const TEAM_GROUPS: string[] = [
  ...new Set(TEAMS.map((t) => t.group)),
].sort();

const TEAM_BY_CODE: Record<string, TeamDef> = Object.fromEntries(
  TEAMS.map((t) => [t.code, t]),
);

export function flagFor(prefix: string): string | undefined {
  return TEAM_BY_CODE[prefix]?.flag;
}
