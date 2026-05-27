import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CURRENT_SCHEMA_VERSION, type AlbumState } from '@/types';

interface AlbumStore extends AlbumState {
  increment: (code: string) => void;
  decrement: (code: string) => void;
  setCount: (code: string, n: number) => void;
  reset: () => void;
  replaceAll: (state: Pick<AlbumState, 'counts'>) => void;
  /** flag de onboarding visto */
  onboardingDone: boolean;
  setOnboardingDone: (v: boolean) => void;
}

const initialState: AlbumState & { onboardingDone: boolean } = {
  version: CURRENT_SCHEMA_VERSION,
  counts: {},
  updatedAt: new Date(0).toISOString(),
  onboardingDone: false,
};

function clamp(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export const useAlbum = create<AlbumStore>()(
  persist(
    (set) => ({
      ...initialState,
      increment: (code) =>
        set((s) => ({
          counts: { ...s.counts, [code]: clamp((s.counts[code] ?? 0) + 1) },
          updatedAt: new Date().toISOString(),
        })),
      decrement: (code) =>
        set((s) => {
          const next = clamp((s.counts[code] ?? 0) - 1);
          const counts = { ...s.counts };
          if (next === 0) delete counts[code];
          else counts[code] = next;
          return { counts, updatedAt: new Date().toISOString() };
        }),
      setCount: (code, n) =>
        set((s) => {
          const v = clamp(n);
          const counts = { ...s.counts };
          if (v === 0) delete counts[code];
          else counts[code] = v;
          return { counts, updatedAt: new Date().toISOString() };
        }),
      reset: () =>
        set(() => ({
          counts: {},
          updatedAt: new Date().toISOString(),
        })),
      replaceAll: ({ counts }) =>
        set(() => ({
          counts: { ...counts },
          updatedAt: new Date().toISOString(),
        })),
      setOnboardingDone: (v) => set(() => ({ onboardingDone: v })),
    }),
    {
      name: 'album-panini-2026',
      version: CURRENT_SCHEMA_VERSION,
    },
  ),
);

export function statusFromCount(n: number | undefined): 'missing' | 'have' | 'duplicate' {
  if (!n || n <= 0) return 'missing';
  if (n === 1) return 'have';
  return 'duplicate';
}
