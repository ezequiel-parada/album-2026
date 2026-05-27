import { useState } from 'react';
import { Upload, AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { parseImport, type ImportResult } from '@/lib/exportImport';
import { useAlbum } from '@/store/useAlbum';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ImportDialog({ open, onClose }: Props) {
  const replaceAll = useAlbum((s) => s.replaceAll);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const reset = () => {
    setResult(null);
    setFileName(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFile = async (file: File) => {
    setFileName(file.name);
    const text = await file.text();
    setResult(parseImport(text));
  };

  const onConfirm = () => {
    if (result && result.ok) {
      replaceAll({ counts: result.counts });
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importar álbum"
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onConfirm}
            disabled={!result || !result.ok}
          >
            Reemplazar mi álbum
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-cyan/40 bg-cyan/5 hover:bg-cyan/10 rounded-2xl p-6 cursor-pointer transition-colors">
          <Upload className="w-7 h-7 text-cyan" strokeWidth={2.2} />
          <span className="font-display font-black text-base text-hi uppercase tracking-wide">
            Elegir archivo .json
          </span>
          <span className="text-xs text-lo text-center">
            {fileName ?? 'Tocá para buscar el archivo en tu dispositivo'}
          </span>
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </label>

        {result && !result.ok && (
          <div className="rounded-xl bg-magenta/15 border border-magenta/40 text-hi p-3 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-magenta shrink-0 mt-0.5" />
            <span>{result.reason}</span>
          </div>
        )}

        {result && result.ok && (
          <div className="rounded-xl bg-sun/10 border border-sun/40 text-hi p-3.5 text-sm space-y-1.5">
            <div className="font-semibold">
              Vas a <strong className="text-sun">reemplazar tu álbum actual</strong> con el del archivo:
            </div>
            <ul className="list-disc list-inside text-hi/90 text-sm space-y-0.5">
              <li>
                <span className="font-display font-black tabular-nums">
                  {result.totalHave}
                </span>{' '}
                figuritas marcadas como tengo
              </li>
              <li>
                <span className="font-display font-black tabular-nums">
                  {result.totalDup}
                </span>{' '}
                repetidas
              </li>
            </ul>
            <div className="text-xs text-lo pt-1">
              Esta acción no se puede deshacer.
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
