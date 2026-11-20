import type { ReactNode } from 'react'

interface GlassCardProps {
  tone?: 'dark' | 'light'
  hover?: boolean
  className?: string
  children: ReactNode
}

/**
 * Frosted glass surface. `hover` adds a gentle lift without visual heaviness.
 */
export function GlassCard({ tone = 'dark', hover = false, className = '', children }: GlassCardProps) {
  const base = tone === 'dark' ? 'glass-dark' : 'glass-light'
  const hoverCls = hover
    ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(8,10,40,0.35)]'
    : ''
  return <div className={`${base} rounded-3xl ${hoverCls} ${className}`}>{children}</div>
}
