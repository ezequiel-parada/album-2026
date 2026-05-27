import { useState } from 'react';
import { ArrowRight, Check, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAlbum } from '@/store/useAlbum';
import {
  DiagonalStripes,
  EnergyBar,
  GrainOverlay,
  HalftoneBackground,
} from './Decoration';

const STEPS = [
  {
    title: 'TOCÁ\nPARA MARCAR',
    eyebrow: 'PASO 01 · COLECCIÓN',
    body: 'Cada figurita es una tarjeta con su código. Tocala una vez para marcarla como "la tengo".',
    icon: <Check className="w-12 h-12" strokeWidth={3.2} />,
    accent: '#A3FF3C',
  },
  {
    title: '¿REPETIDA?\nTOCALA DE NUEVO',
    eyebrow: 'PASO 02 · DUPLICADAS',
    body: 'Cada toque extra suma una repetida. Usá el botón "−" si te equivocaste.',
    icon: <span className="font-display font-black text-5xl tabular-nums">×2</span>,
    accent: '#22D3EE',
  },
  {
    title: 'BUSCÁ\nY FILTRÁ FÁCIL',
    eyebrow: 'PASO 03 · EXPLORAR',
    body: 'Escribí un código como "ARG18" o filtrá por grupo, país o por las que te faltan.',
    icon: <Search className="w-12 h-12" strokeWidth={2.6} />,
    accent: '#FF2E63',
  },
];

export function Onboarding() {
  const done = useAlbum((s) => s.onboardingDone);
  const setDone = useAlbum((s) => s.setOnboardingDone);
  const [step, setStep] = useState(0);

  if (done) return null;
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[60] bg-pitch flex flex-col overflow-hidden">
      <HalftoneBackground intensity="strong" size="lg" />
      <DiagonalStripes className="opacity-60" />
      <GrainOverlay opacity={0.08} />
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${current.accent}55 0%, transparent 70%)`,
          transition: 'background 600ms ease',
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${current.accent}33 0%, transparent 70%)`,
          transition: 'background 600ms ease',
        }}
      />

      <header className="relative px-6 pt-7 pb-3 flex items-center gap-3">
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-1 rounded-2xl bg-magenta/40 blur-md"
          />
          <div className="relative w-11 h-11 rounded-2xl bg-magenta text-white font-display font-black text-[22px] flex items-center justify-center leading-none">
            26
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.32em] font-bold text-cyan">
            Mi Álbum
          </div>
          <div className="font-display font-black text-xl text-hi tracking-tight">
            MUNDIAL <span className="text-gradient-energy">2026</span>
          </div>
        </div>
      </header>

      <div className="relative flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.32 }}
            className="max-w-md w-full text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
              className="relative mx-auto w-24 h-24 rounded-3xl border-2 flex items-center justify-center"
              style={{
                color: current.accent,
                borderColor: current.accent,
                background: `${current.accent}1A`,
                boxShadow: `0 0 0 1px ${current.accent}, 0 12px 40px -10px ${current.accent}`,
              }}
            >
              {current.icon}
            </motion.div>
            <div className="space-y-3">
              <div
                className="text-[11px] uppercase tracking-[0.32em] font-bold"
                style={{ color: current.accent }}
              >
                {current.eyebrow}
              </div>
              <h2
                className="display text-5xl sm:text-6xl leading-[0.95] text-hi whitespace-pre-line"
              >
                {current.title}
              </h2>
              <p className="text-base text-lo max-w-xs mx-auto">{current.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative p-6 space-y-5">
        <div className="flex justify-center gap-2" role="tablist" aria-label="Progreso del tutorial">
          {STEPS.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-label={`Paso ${i + 1}`}
              onClick={() => setStep(i)}
              className="relative h-2 rounded-full"
              style={{ width: i === step ? 32 : 10 }}
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-line-strong"
              />
              {i === step && (
                <motion.span
                  layoutId="onboard-dot"
                  className="absolute inset-0 rounded-full"
                  style={{ background: s.accent }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center gap-3">
          <button type="button" className="btn-ghost" onClick={() => setDone(true)}>
            Saltar
          </button>
          {isLast ? (
            <button type="button" className="btn-primary" onClick={() => setDone(true)}>
              ¡Empezar!
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setStep((s) => s + 1)}
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <EnergyBar height={3} className="rounded-full" />
      </div>
    </div>
  );
}
