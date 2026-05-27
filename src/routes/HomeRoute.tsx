import { useMemo, useState } from 'react';
import { Share2 } from 'lucide-react';
import { STICKERS } from '@/data/stickers';
import { useAlbum } from '@/store/useAlbum';
import {
  emptyFilters,
  filterStickers,
  TEAM_GROUP_KEYS,
  type Filters,
} from '@/lib/filter';
import { ProgressHeader } from '@/components/ProgressHeader';
import { GroupSelect } from '@/components/GroupSelect';
import { StatusPills } from '@/components/StatusPills';
import { SearchBox } from '@/components/SearchBox';
import { GroupSection } from '@/components/GroupSection';
import { SpecialsSection } from '@/components/SpecialsSection';
import { ShareDialog } from '@/components/ShareDialog';

export function HomeRoute() {
  const counts = useAlbum((s) => s.counts);
  const [filters, setFilters] = useState<Filters>(() => emptyFilters());
  const [shareOpen, setShareOpen] = useState(false);

  const visible = useMemo(
    () => filterStickers(STICKERS, counts, filters),
    [counts, filters],
  );

  const byGroup = useMemo(() => {
    const map = new Map<string, typeof visible>();
    const specials: typeof visible = [];
    for (const s of visible) {
      if (s.prefix === 'FWC' || s.prefix === 'CC') {
        specials.push(s);
      } else if (s.group) {
        const list = map.get(s.group) ?? [];
        list.push(s);
        map.set(s.group, list);
      }
    }
    return { groups: map, specials };
  }, [visible]);

  const showGroups = filters.group !== 'SPECIALS';
  const showSpecials = filters.group === 'ALL' || filters.group === 'SPECIALS';

  const onQueryChange = (q: string) => {
    setFilters((prev) => ({
      ...prev,
      query: q,
      // Si el usuario empieza a buscar, abrimos a todos los grupos para que el match aparezca.
      group: q.trim() ? 'ALL' : prev.group,
    }));
  };

  return (
    <div className="space-y-6">
      <ProgressHeader />

      <div className="space-y-3 sticky top-[88px] z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-3 pb-3 bg-pitch/85 backdrop-blur-lg border-b border-line">
        <SearchBox value={filters.query} onChange={onQueryChange} />
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-start">
          <GroupSelect
            value={filters.group}
            onChange={(g) => setFilters({ ...filters, group: g })}
          />
          <button
            type="button"
            className="btn-primary sm:h-12"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="w-4 h-4" />
            Compartir
          </button>
        </div>
        <StatusPills
          value={filters.status}
          onChange={(s) => setFilters({ ...filters, status: s })}
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState filters={filters} onReset={() => setFilters(emptyFilters())} />
      ) : (
        <div className="space-y-12">
          {showGroups &&
            TEAM_GROUP_KEYS.map((g) => {
              const list = byGroup.groups.get(g);
              if (!list || list.length === 0) return null;
              return <GroupSection key={g} group={g} stickers={list} />;
            })}
          {showSpecials && byGroup.specials.length > 0 && (
            <SpecialsSection stickers={byGroup.specials} />
          )}
        </div>
      )}

      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}

function EmptyState({
  filters,
  onReset,
}: {
  filters: Filters;
  onReset: () => void;
}) {
  const hint = filters.query
    ? `No hay figuritas que coincidan con "${filters.query}".`
    : 'No hay figuritas en estos filtros.';
  return (
    <div className="text-center py-16 px-6 space-y-3">
      <p className="font-display font-black text-2xl text-hi">{hint}</p>
      <p className="text-lo text-sm">Probá cambiando los filtros.</p>
      <button type="button" className="btn-secondary mt-2" onClick={onReset}>
        Mostrar todas
      </button>
    </div>
  );
}
