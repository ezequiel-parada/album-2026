import { useMemo, useState } from 'react';
import { Copy, Share2, Check, MessageCircle } from 'lucide-react';
import { Modal } from './Modal';
import { STICKERS } from '@/data/stickers';
import { useAlbum } from '@/store/useAlbum';
import { buildShareUrl } from '@/lib/share';
import { buildWhatsappText, hasAnyToShare } from '@/lib/whatsappShare';

interface Props {
  open: boolean;
  onClose: () => void;
}

type Kind = 'missing' | 'dup';

export function ShareDialog({ open, onClose }: Props) {
  const counts = useAlbum((s) => s.counts);
  const [kind, setKind] = useState<Kind>('missing');
  const [copied, setCopied] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  const codes = useMemo(() => {
    if (kind === 'missing') {
      return STICKERS.filter((s) => (counts[s.code] ?? 0) === 0).map((s) => s.code);
    }
    return STICKERS.filter((s) => (counts[s.code] ?? 0) >= 2).map((s) => s.code);
  }, [counts, kind]);

  const url = useMemo(
    () => (open ? buildShareUrl(kind, codes) : ''),
    [open, kind, codes],
  );

  const whatsappText = useMemo(
    () => (open ? buildWhatsappText(counts) : ''),
    [open, counts],
  );
  const hasAny = useMemo(() => hasAnyToShare(counts), [counts]);

  const onCopyWhatsapp = async () => {
    try {
      await navigator.clipboard.writeText(whatsappText);
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const onShare = async () => {
    if (!navigator.share) {
      onCopy();
      return;
    }
    try {
      await navigator.share({
        title: kind === 'missing' ? 'Las que me faltan' : 'Las que tengo repetidas',
        text:
          kind === 'missing'
            ? 'Estas son las figuritas que me faltan del álbum.'
            : 'Estas son las figuritas que tengo repetidas.',
        url,
      });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Compartir lista"
      footer={
        <>
          <button
            type="button"
            className="btn-secondary"
            onClick={onCopyWhatsapp}
            disabled={!hasAny}
            title={!hasAny ? 'No hay repetidas ni faltantes para compartir.' : undefined}
          >
            {copiedWa ? <Check className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
            {copiedWa ? '¡Copiado!' : 'Copiar para WhatsApp'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCopy}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '¡Copiado!' : 'Copiar link'}
          </button>
          <button type="button" className="btn-primary" onClick={onShare}>
            <Share2 className="w-4 h-4" />
            Compartir
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-1.5">
          <button
            type="button"
            className={kind === 'missing' ? 'chip-on' : 'chip-off'}
            onClick={() => setKind('missing')}
          >
            Las que me faltan
          </button>
          <button
            type="button"
            className={kind === 'dup' ? 'chip-on' : 'chip-off'}
            onClick={() => setKind('dup')}
          >
            Las que tengo repetidas
          </button>
        </div>

        <p className="text-sm text-lo">
          {codes.length === 0 ? (
            kind === 'missing' ? (
              <>¡No te falta ninguna! No hay nada para compartir.</>
            ) : (
              <>No tenés repetidas para cambiar.</>
            )
          ) : (
            <>
              Vas a compartir{' '}
              <span className="font-display font-black text-hi tabular-nums">
                {codes.length}
              </span>{' '}
              {codes.length === 1 ? 'figurita' : 'figuritas'}.
            </>
          )}
        </p>

        {codes.length > 0 && (
          <div className="rounded-xl border border-line bg-pitch-card p-3 text-xs break-all text-lo font-mono tracking-tight">
            {url}
          </div>
        )}
      </div>
    </Modal>
  );
}
