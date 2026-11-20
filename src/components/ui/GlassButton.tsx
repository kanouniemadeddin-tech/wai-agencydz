import type { MouseEventHandler, ReactNode } from 'react'

type Variant = 'primary' | 'glass' | 'glass-light' | 'outline'

interface GlassButtonProps {
  variant?: Variant
  size?: 'md' | 'lg'
  href?: string
  type?: 'button' | 'submit'
  onClick?: MouseEventHandler<HTMLElement>
  className?: string
  children: ReactNode
  ariaLabel?: string
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-blue text-white shadow-lg shadow-blue/30 hover:bg-[#1877cf] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue/40 active:translate-y-0',
  glass:
    'glass-dark text-white hover:bg-white/15 hover:-translate-y-0.5 active:translate-y-0',
  'glass-light':
    'glass-light text-navy hover:bg-white/80 hover:-translate-y-0.5 active:translate-y-0',
  outline:
    'border border-navy/25 text-navy hover:border-blue hover:text-blue hover:-translate-y-0.5 active:translate-y-0',
}

const sizeClasses = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
} as const

/** Pill button used for every primary/secondary action on the site. */
export function GlassButton({
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  onClick,
  className = '',
  children,
  ariaLabel,
}: GlassButtonProps) {
  const cls = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-display font-semibold whitespace-nowrap transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  if (href) {
    return (
      <a href={href} onClick={onClick} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }
  return (
    <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
