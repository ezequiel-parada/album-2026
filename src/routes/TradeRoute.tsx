import { useEffect, useMemo, useState } from 'react';
import { Check, ClipboardPaste, Copy } from 'lucide-react';
import { STICKERS_BY_CODE } from '@/data/stickers';
import { categoryOf } from '@/lib/category';
import { useAlbum } from '@/store/useAlbum';
import { parseTradeMessage } from '@/lib/parseTradeMessage';
import { computeTrade } from '@/lib/tradeMatch';
import { buildTradeReply } from '@/lib/whatsappShare';
import { EnergyBar, GrainOverlay, HalftoneBackground } from '@/components/Decoration';

export function TradeRoute() {
  const counts = useAlbum((s) => s.counts);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseTradeMessage(text), [text]);
  const result = useMemo(() => computeTrade(counts, parsed), [counts, parsed]);

  const giveGroups = useMemo(() => groupByCategory(result.iGive), [result.iGive]);
  const getGroups = useMemo(() => groupByCategory(result.iGet), [result.iGet]);

  // Selección a proponer. Por defecto: la lista más chica entera y, de la más
  // grande, las primeras N (N = tamaño de la más chica) para emparejar cantidades.
  const [selGive, setSelGive] = useState<Set<string>>(new Set());
  const [selGet, setSelGet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const { iGive, iGet } = result;
    const n = Math.min(iGive.length, iGet.length);
    setSelGive(new Set(iGive.length <= iGet.length ? iGive : iGive.slice(0, n)));
    setSelGet(new Set(iGet.length <= iGive.length ? iGet : iGet.slice(0, n)));
  }, [result]);

  const toggle = (which: 'give' | 'get', code: string) => {
    const setter = which === 'give' ? setSelGive : setSelGet;
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const hasInput = text.trim().length > 0;
  const hasParsed = parsed.missing.length > 0 || parsed.dup.length > 0;
  const hasResult = result.iGive.length > 0 || result.iGet.length > 0;
  const hasSelection = selGive.size > 0 || selGet.size > 0;
  const reply = useMemo(
    () =>
      buildTradeReply({
        iGive: result.iGive.filter((c) => selGive.has(c)),
        iGet: result.iGet.filter((c) => selGet.has(c)),
      }),
    [result, selGive, selGet],
  );

  const onPaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) setText(clip);
    } catch {
      /* ignore: el usuario puede pegar a mano */
    }
  };

  const onCopyReply = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-line-strong bg-pitch-elev p-6 sm:p-7">
        <HalftoneBackground intensity="normal" size="md" />
        <GrainOverlay opacity={0.05} />
        <div className="relative space-y-2">
          <div className="text-[10px] uppercase tracking-[0.32em] font-bold text-lime">
            Intercambio
          </div>
          <h1 className="display text-4xl sm:text-6xl leading-[0.92] text-hi tracking-tight">
            PROPONER CAMBIO
          </h1>
          <p className="text-sm text-lo">
            Pegá el mensaje con las figuritas de otra persona y te decimos cuáles
            se pueden cambiar.
          </p>
        </div>
        <EnergyBar className="mt-5 rounded-full" height={2} />
      </section>

      <section className="card p-4 sm:p-5 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={'Pegá acá el mensaje de la otra persona\n(Me faltan… / Repetidas…)'}
          className="w-full resize-y rounded-xl border border-line bg-pitch-card p-3 text-sm text-hi placeholder:text-lo/60 focus:outline-none focus:border-line-strong"
        />
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className="btn-secondary" onClick={onPaste}>
            <ClipboardPaste className="w-4 h-4" />
            Pegar del portapapeles
          </button>
          {hasInput && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setText('')}
            >
              Limpiar
            </button>
          )}
        </div>
      </section>

      {hasInput && !hasParsed && (
        <Notice
          title="NO SE RECONOCIÓ LA LISTA"
          body="No encontramos figuritas en ese texto. Asegurate de pegar el mensaje completo, con las secciones de faltantes y repetidas."
        />
      )}

      {hasParsed && (
        <>
          {!hasResult ? (
            <Notice
              title="SIN COINCIDENCIAS"
              body="Por ahora no hay figuritas para cambiar con esta persona."
            />
          ) : (
            <div className="space-y-5">
              <p className="text-xs text-lo">
                Tocá las figuritas para elegir cuáles proponer. Dejamos
                pre-seleccionada la misma cantidad de cada lado.
              </p>
              <TradeColumn
                accent="#A3FF3C"
                eyebrow="Le puedo dar"
                title="MIS REPETIDAS QUE LE FALTAN"
                groups={giveGroups}
                total={result.iGive.length}
                selected={selGive}
                onToggle={(c) => toggle('give', c)}
              />
              <TradeColumn
                accent="#22D3EE"
                eyebrow="Me puede dar"
                title="MIS FALTANTES QUE TIENE REPETIDAS"
                groups={getGroups}
                total={result.iGet.length}
                selected={selGet}
                onToggle={(c) => toggle('get', c)}
              />

              <button
                type="button"
                className="btn-primary"
                onClick={onCopyReply}
                disabled={!hasSelection}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied
                  ? '¡Copiado!'
                  : `Copiar respuesta (${selGive.size + selGet.size})`}
              </button>
            </div>
          )}

          {parsed.unmatched.length > 0 && (
            <p className="text-xs text-lo">
              No se reconocieron: {parsed.unmatched.join(', ')}.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function TradeColumn({
  accent,
  eyebrow,
  title,
  groups,
  total,
  selected,
  onToggle,
}: {
  accent: string;
  eyebrow: string;
  title: string;
  groups: Group[];
  total: number;
  selected: Set<string>;
  onToggle: (code: string) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.28em] font-bold"
            style={{ color: accent }}
          >
            {eyebrow}
          </div>
          <h2 className="font-display font-black text-xl text-hi tracking-tight uppercase">
            {title}
          </h2>
        </div>
        <span
          className="font-display font-black text-lg tabular-nums"
          style={{ color: accent }}
        >
          {selected.size}/{total}
        </span>
      </div>

      {total === 0 ? (
        <p className="text-sm text-lo">Nada por acá.</p>
      ) : (
        <div className="space-y-3">
          {groups.map(({ key, label, codes }) => (
            <div key={key} className="card p-4">
              <header className="flex items-baseline justify-between mb-3">
                <h3 className="font-display font-black text-base text-hi tracking-tight uppercase">
                  {label}
                </h3>
                <span className="font-display font-black text-sm text-lo tabular-nums">
                  {codes.length}
                </span>
              </header>
              <ul className="flex flex-wrap gap-1.5">
                {codes.map((c) => {
                  const on = selected.has(c);
                  return (
                    <li key={c}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => onToggle(c)}
                        className={`rounded-lg px-2.5 py-1.5 text-sm font-display font-black tabular-nums border transition-colors ${
                          on
                            ? 'text-pitch'
                            : 'bg-pitch border-line text-lo opacity-60 hover:opacity-100'
                        }`}
                        style={
                          on
                            ? { backgroundColor: accent, borderColor: accent }
                            : undefined
                        }
                      >
                        {c}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-8 text-center space-y-3">
      <h2 className="font-display font-black text-2xl text-hi tracking-tight uppercase">
        {title}
      </h2>
      <p className="text-lo">{body}</p>
    </div>
  );
}

interface Group {
  key: string;
  label: string;
  codes: string[];
}

function groupByCategory(codes: string[]): Group[] {
  // Preservamos el orden del catálogo (grupos A, B, C…) usando el índice global
  // de cada figurita en lugar de ordenar por nombre de país.
  const teamsByCountry: Record<
    string,
    { country: string; order: number; codes: string[] }
  > = {};
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
      teamsByCountry[key] ??= { country: s.country ?? key, order: s.index, codes: [] };
      teamsByCountry[key].codes.push(c);
    }
  }

  const sortByNumber = (a: string, b: string) => {
    const na = parseInt(a.replace(/^[A-Z]+/, ''), 10);
    const nb = parseInt(b.replace(/^[A-Z]+/, ''), 10);
    return na - nb;
  };

  const groups: Group[] = [];
  for (const [prefix, val] of Object.entries(teamsByCountry).sort(
    ([, a], [, b]) => a.order - b.order,
  )) {
    groups.push({ key: prefix, label: val.country, codes: val.codes.sort(sortByNumber) });
  }
  if (fwc.length) groups.push({ key: 'FWC', label: 'FWC', codes: fwc.sort(sortByNumber) });
  if (cc.length) groups.push({ key: 'CC', label: 'Coca-Cola', codes: cc.sort(sortByNumber) });
  return groups;
}
