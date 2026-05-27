import { useState } from 'react';
import { Download, Trash2, Upload, BookOpen, AlertTriangle } from 'lucide-react';
import { useAlbum } from '@/store/useAlbum';
import { downloadAlbum } from '@/lib/exportImport';
import { ImportDialog } from '@/components/ImportDialog';
import { Modal } from '@/components/Modal';

export function SettingsRoute() {
  const counts = useAlbum((s) => s.counts);
  const reset = useAlbum((s) => s.reset);
  const setOnboardingDone = useAlbum((s) => s.setOnboardingDone);
  const [importOpen, setImportOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <div className="space-y-5">
      <header className="space-y-1.5">
        <div className="eyebrow">Configuración</div>
        <h1 className="display text-5xl sm:text-6xl leading-[0.95] text-hi tracking-tight">
          AJUSTES
        </h1>
      </header>

      <SettingSection
        icon={<Download className="w-5 h-5" strokeWidth={2.4} />}
        accent="#A3FF3C"
        title="Guardar mi álbum"
        description="Descargá un archivo con todo tu progreso para usarlo en otro dispositivo o como copia de seguridad."
      >
        <button
          type="button"
          className="btn-primary w-full sm:w-auto"
          onClick={() => downloadAlbum({ counts })}
        >
          <Download className="w-4 h-4" />
          Descargar mi álbum
        </button>
      </SettingSection>

      <SettingSection
        icon={<Upload className="w-5 h-5" strokeWidth={2.4} />}
        accent="#22D3EE"
        title="Importar un álbum"
        description="Cargá un archivo que descargaste antes. Reemplaza tu álbum actual."
      >
        <button
          type="button"
          className="btn-secondary w-full sm:w-auto"
          onClick={() => setImportOpen(true)}
        >
          <Upload className="w-4 h-4" />
          Importar desde archivo
        </button>
      </SettingSection>

      <SettingSection
        icon={<BookOpen className="w-5 h-5" strokeWidth={2.4} />}
        accent="#FFD60A"
        title="Volver a ver la guía"
        description="Vuelve a mostrar el tutorial inicial la próxima vez que abras la app."
      >
        <button
          type="button"
          className="btn-secondary w-full sm:w-auto"
          onClick={() => setOnboardingDone(false)}
        >
          Mostrar guía otra vez
        </button>
      </SettingSection>

      <section className="relative overflow-hidden rounded-2xl border border-magenta/40 bg-magenta/10 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-magenta text-white inline-flex items-center justify-center shadow-glow-magenta">
            <AlertTriangle className="w-4 h-4" strokeWidth={2.6} />
          </span>
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-magenta">
              Zona peligrosa
            </div>
            <h2 className="font-display font-black text-xl text-hi tracking-tight leading-tight">
              BORRAR TODO
            </h2>
          </div>
        </div>
        <p className="text-sm text-lo">
          Marca todas las figuritas como faltantes y borra las repetidas. Esta
          acción no se puede deshacer.
        </p>
        <button
          type="button"
          className="btn-danger w-full sm:w-auto"
          onClick={() => setResetOpen(true)}
        >
          <Trash2 className="w-4 h-4" />
          Borrar mi álbum
        </button>
      </section>

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="¿Borrar todo el álbum?"
        footer={
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setResetOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                reset();
                setResetOpen(false);
              }}
            >
              Sí, borrar todo
            </button>
          </>
        }
      >
        <p className="text-sm text-lo">
          Vas a perder todo el progreso guardado en este dispositivo. Si querés
          conservarlo, primero descargá el archivo en la sección anterior.
        </p>
      </Modal>
    </div>
  );
}

function SettingSection({
  icon,
  accent,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  accent: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative card p-4 sm:p-5 space-y-3 overflow-hidden">
      <div className="flex items-center gap-2.5">
        <span
          className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-pitch shrink-0"
          style={{ background: accent }}
          aria-hidden
        >
          {icon}
        </span>
        <h2 className="font-display font-black text-xl text-hi tracking-tight uppercase leading-tight">
          {title}
        </h2>
      </div>
      <p className="text-sm text-lo">{description}</p>
      {children}
    </section>
  );
}
