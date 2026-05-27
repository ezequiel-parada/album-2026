import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { decodeToken } from '@/lib/share';
import { STICKERS_BY_CODE } from '@/data/stickers';
import { categoryOf } from '@/lib/category';
import {
  EnergyBar,
  EnergySlash,
  GrainOverlay,
  HalftoneBackground,
} from '@/components/Decoration';

export function ShareViewRoute() {
  const [params] = useSearchParams();
  const missingToken = params.get('missing');
  const dupToken = params.get('dup');
  const token = missingToken ?? dupToken ?? '';
  const kind = missingToken ? 'missing' : dupToken ? 'dup' : null;

  const decoded = useMemo(() => {
    if (!token) return null;
    try {
      return decodeToken(token);
    } catch {
      return null;
    }
  }, [token]);

  const grouped = useMemo(
    () => groupByCategory(decoded?.codes ?? []),
    [decoded],
  );

  if (!kind || !decoded) {
    return (
      <Notice
        title="LINK INVÁLIDO"
        body="No pudimos leer este link. Pedile a quien lo generó que lo vuelva a compartir."
      />
    );
  }

  if (!decoded.catalogMatches) {
    return (
      <Notice
        title="LINK DE OTRA VERSIÓN"
        body="Este link fue generado con una versión distinta del álbum. Pedile a quien lo compartió que lo regenere."
      />
    );
  }

  const accent = kind === 'missing' ? '#FF2E63' : '#22D3EE';
  const title =
    kind === 'missing'
      ? 'LAS QUE LE FALTAN'
      : 'LAS QUE TIENE REPETIDAS';

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-line-strong bg-pitch-elev p-6 sm:p-7">
        <HalftoneBackground intensity="normal" size="md" />
        <GrainOverlay opacity={0.05} />
        <EnergySlash
          className="absolute -right-8 -top-8 w-52 h-52 opacity-50"
          style={{ color: accent }}
        />
        <div className="relative space-y-2">
          <div
            className="text-[10px] uppercase tracking-[0.32em] font-bold"
            style={{ color: accent }}
          >
            Lista compartida
          </div>
          <h1 className="display text-4xl sm:text-6xl leading-[0.92] text-hi tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-lo">
            <span
              className="font-display font-black tabular-nums text-base"
              style={{ color: accent }}
            >
              {decoded.codes.length}
            </span>{' '}
            {decoded.codes.length === 1 ? 'figurita' : 'figuritas'} en total
          </p>
        </div>
        <EnergyBar className="mt-5 rounded-full" height={2} />
      </section>

      {decoded.codes.length === 0 ? (
        <Notice
          title={kind === 'missing' ? '¡YA TIENE TODAS!' : 'NO TIENE REPETIDAS'}
          body="No hay nada que mostrar en esta lista."
        />
      ) : (
        <div className="space-y-4">
          {grouped.map(({ key, label, codes }) => (
            <section key={key} className="card p-4 sm:p-5">
              <header className="flex items-baseline justify-between mb-3">
                <h2 className="font-display font-black text-lg text-hi tracking-tight uppercase">
                  {label}
                </h2>
                <span className="font-display font-black text-sm text-lo tabular-nums">
                  {codes.length}
                </span>
              </header>
              <ul className="flex flex-wrap gap-1.5">
                {codes.map((c) => (
                  <li
                    key={c}
                    className="rounded-lg bg-pitch border border-line-strong px-2.5 py-1.5 text-sm font-display font-black tabular-nums text-hi"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Link to="/" className="btn-primary inline-flex">
          Ir a mi álbum
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-8 text-center space-y-3">
      <h1 className="font-display font-black text-3xl text-hi tracking-tight uppercase">
        {title}
      </h1>
      <p className="text-lo">{body}</p>
      <div className="pt-2">
        <Link to="/" className="btn-secondary inline-flex">
          Ir a mi álbum
        </Link>
      </div>
    </div>
  );
}

interface Group {
  key: string;
  label: string;
  codes: string[];
}

function groupByCategory(codes: string[]): Group[] {
  const teamsByCountry: Record<string, { country: string; codes: string[] }> = {};
  const fwc: string[] = [];
  const cc: string[] = [];

  for (const c of codes) {
    const s = STICKERS_BY_CODE[c];
    if (!s) continue;
    const cat = categoryOf(s);
    if (cat === 'FWC') fwc.push(c);
    else if (cat === 'CC') cc.push(c);
    else {
      const key = s.prefix;
      teamsByCountry[key] ??= { country: s.country ?? key, codes: [] };
      teamsByCountry[key].codes.push(c);
    }
  }

  const sortByNumber = (a: string, b: string) => {
    const na = parseInt(a.replace(/^[A-Z]+/, ''), 10);
    const nb = parseInt(b.replace(/^[A-Z]+/, ''), 10);
    return na - nb;
  };

  const groups: Group[] = [];
  for (const [prefix, val] of Object.entries(teamsByCountry).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    groups.push({ key: prefix, label: val.country, codes: val.codes.sort(sortByNumber) });
  }
  if (fwc.length) groups.push({ key: 'FWC', label: 'FWC', codes: fwc.sort(sortByNumber) });
  if (cc.length) groups.push({ key: 'CC', label: 'Coca-Cola', codes: cc.sort(sortByNumber) });
  return groups;
}
