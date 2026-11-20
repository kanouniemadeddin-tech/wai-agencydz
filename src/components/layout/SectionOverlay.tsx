import { X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface SectionOverlayProps {
  label: string
  onClose: () => void
  /** 'surface' renders the overlay on the light-gray portfolio background. */
  tone?: 'white' | 'surface'
  children: ReactNode
}

/**
 * Full-screen section overlay: hero stays mounted underneath; this panel
 * covers the viewport, scrolls internally and closes via its own button
 * or the Escape key.
 */
export function SectionOverlay({ label, onClose, tone = 'white', children }: SectionOverlayProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={`overlay${tone === 'surface' ? ' overlay-surface' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.4, ease }}
    >
      <div className="overlay-bar">
        <span className="overlay-brand">
          WAI
          {label}
        </span>
        <button type="button" className="overlay-close" onClick={onClose} aria-label="Close section">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="overlay-body">{children}</div>
    </motion.div>
  )
}
