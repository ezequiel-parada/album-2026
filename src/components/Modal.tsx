import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EnergyDivider } from './Decoration';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: Props) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-pitch-deep/75 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
          <motion.div
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 40, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 24, scale: 0.97 }
            }
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="relative w-full sm:max-w-lg sm:mx-4 bg-pitch-elev sm:rounded-2xl rounded-t-2xl border border-line-strong shadow-card overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <h3 className="font-display font-black text-xl sm:text-2xl text-hi tracking-tight uppercase">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-lo hover:text-hi hover:bg-line transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <EnergyDivider />
            <div className="px-5 py-4 overflow-y-auto">{children}</div>
            {footer && (
              <>
                <EnergyDivider className="opacity-60" />
                <div className="px-5 py-3.5 bg-pitch-card/70 flex flex-wrap justify-end gap-2">
                  {footer}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
