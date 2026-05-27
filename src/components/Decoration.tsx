import type { CSSProperties } from 'react';

/**
 * Decorative primitives used throughout the redesign.
 * All accept className so the parent can absolutely-position them.
 * Defaults assume they're rendered inside a `relative` wrapper.
 */

export function HalftoneBackground({
  className = '',
  size = 'md',
  intensity = 'normal',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  intensity?: 'normal' | 'strong';
}) {
  const bgSize = size === 'sm' ? '10px 10px' : size === 'lg' ? '22px 22px' : '14px 14px';
  const image =
    intensity === 'strong'
      ? 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1.2px)'
      : 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.2px)';
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ backgroundImage: image, backgroundSize: bgSize }}
    />
  );
}

export function DiagonalStripes({
  className = '',
  color = 'rgba(255,255,255,0.05)',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(-45deg, ${color} 0 2px, transparent 2px 16px)`,
      }}
    />
  );
}

export function GrainOverlay({
  className = '',
  opacity = 0.06,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 mix-blend-overlay bg-noise ${className}`}
      style={{ opacity }}
    />
  );
}

/**
 * Diagonal slash svg, intended for hero corner decoration.
 * Color via `style={{ color: '#FF2E63' }}` (uses currentColor).
 */
export function EnergySlash({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className={`pointer-events-none ${className}`}
      style={style}
    >
      <g style={{ color: 'currentColor' }}>
        <rect x="-20" y="120" width="280" height="6" transform="rotate(-32 100 100)" fill="currentColor" opacity="0.9" />
        <rect x="-20" y="138" width="280" height="3" transform="rotate(-32 100 100)" fill="currentColor" opacity="0.55" />
        <rect x="-20" y="150" width="280" height="2" transform="rotate(-32 100 100)" fill="currentColor" opacity="0.3" />
      </g>
    </svg>
  );
}

/**
 * 1px gradient divider line in magenta -> sun -> lime.
 */
export function EnergyDivider({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-px w-full ${className}`}
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, rgba(255,46,99,0.7) 18%, rgba(255,214,10,0.7) 50%, rgba(163,255,60,0.7) 82%, transparent 100%)',
      }}
    />
  );
}

/**
 * Thicker gradient bar — for header underline.
 */
export function EnergyBar({
  className = '',
  height = 2,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        height,
        background:
          'linear-gradient(90deg, #FF2E63 0%, #FFD60A 50%, #A3FF3C 100%)',
      }}
    />
  );
}
