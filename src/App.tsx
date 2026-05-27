import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Home, Search, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { HomeRoute } from './routes/HomeRoute';
import { SearchRoute } from './routes/SearchRoute';
import { ShareViewRoute } from './routes/ShareViewRoute';
import { SettingsRoute } from './routes/SettingsRoute';
import { Onboarding } from './components/Onboarding';
import { EnergyBar } from './components/Decoration';

export default function App() {
  const location = useLocation();
  const onShareView = location.pathname === '/share';

  return (
    <div className="min-h-full flex flex-col">
      {!onShareView && <Onboarding />}

      <header className="sticky top-0 z-30 bg-pitch/85 backdrop-blur-lg border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-2xl bg-magenta/40 blur-md"
            />
            <div className="relative w-11 h-11 rounded-2xl bg-magenta text-white font-display font-black text-[22px] leading-none flex items-center justify-center tracking-tight shadow-glow-magenta">
              26
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.32em] font-bold text-cyan leading-tight">
              Mi Álbum
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-[1.05] text-hi mt-0.5">
              MUNDIAL <span className="text-gradient-energy">2026</span>
            </div>
          </div>
        </div>
        <EnergyBar height={2} />
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 pb-28">
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/buscar" element={<SearchRoute />} />
          <Route path="/share" element={<ShareViewRoute />} />
          <Route path="/ajustes" element={<SettingsRoute />} />
          <Route path="*" element={<HomeRoute />} />
        </Routes>
      </main>

      {!onShareView && (
        <nav
          aria-label="Navegación principal"
          className="fixed bottom-0 inset-x-0 z-30 px-3 pb-3 pt-2"
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom), 0.75rem)',
          }}
        >
          <div className="max-w-md mx-auto rounded-2xl bg-pitch-elev/95 backdrop-blur-lg border border-line-strong shadow-card overflow-hidden">
            <div className="grid grid-cols-3 relative">
              <TabLink to="/" icon={<Home className="w-[18px] h-[18px]" strokeWidth={2.4} />} label="Álbum" />
              <TabLink to="/buscar" icon={<Search className="w-[18px] h-[18px]" strokeWidth={2.4} />} label="Buscar" />
              <TabLink to="/ajustes" icon={<Settings className="w-[18px] h-[18px]" strokeWidth={2.4} />} label="Ajustes" />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

function TabLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `relative flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold tracking-wide transition-colors ${
          isActive ? 'text-white' : 'text-lo hover:text-hi'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="nav-active"
              className="absolute inset-1.5 rounded-xl bg-magenta -z-0 shadow-glow-magenta"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{icon}</span>
          <span className="relative z-10 uppercase tracking-[0.14em]">{label}</span>
        </>
      )}
    </NavLink>
  );
}
