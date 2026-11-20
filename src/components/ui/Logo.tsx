type LogoVariant = 'light' | 'dark' | 'icon'

const paths: Record<LogoVariant, { mark: string; text: string }> = {
  light: { mark: 'text-white', text: 'text-white' },
  dark: { mark: 'text-navy', text: 'text-navy' },
  icon: { mark: 'text-white', text: '' },
}

export function WMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 8 L12.5 25 L16 16 L19.5 25 L27 8"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface LogoProps {
  variant?: LogoVariant
  className?: string
}

/** Primary WAI logo — geometric W mark + wordmark. */
export function Logo({ variant = 'light', className = '' }: LogoProps) {
  const c = paths[variant]
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <WMark className={`h-7 w-7 shrink-0 ${c.mark}`} />
      {variant !== 'icon' && (
        <span className={`font-display text-lg font-semibold tracking-tight leading-none ${c.text}`}>
          WAI
          <span className="font-medium opacity-80"> Agency</span>
        </span>
      )}
    </span>
  )
}
