import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import '../../styles/hero.css'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
]

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** 4-dot grid icon for the right-side circle button. */
function GridDots() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="3" r="1.6" />
      <circle cx="9" cy="3" r="1.6" />
      <circle cx="3" cy="9" r="1.6" />
      <circle cx="9" cy="9" r="1.6" />
    </svg>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Body scroll lock + Escape closes the menu overlay
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <motion.header
        className={`wai-nav${scrolled ? ' is-scrolled' : ''}`}
        initial={reduce ? { opacity: 0 } : { y: -16, opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="wai-nav-inner">
          <div className="wai-nav-left">
            <a href="#home" className="wai-brand" aria-label="WAI — home">
              <span className="wai-brand-text">WAI</span>
              <span className="wai-brand-sub">Agency</span>
            </a>

            <button
              type="button"
              className="wai-menu-btn"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="wai-menu"
              aria-label="Open menu"
            >
              <span className="wai-pill-circle">
                <Plus size={12} strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="wai-menu-label">Menu</span>
            </button>

            <div className="wai-tags-pill" aria-hidden="true">
              <span>AI &amp; Web Solutions</span>
              <span>Creative Production</span>
            </div>
          </div>

          <div className="wai-nav-right">
            <nav className="wai-nav-links" aria-label="Main navigation">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="wai-nav-link">
                  {link.label}
                </a>
              ))}
            </nav>

            <a href="#contact" className="wai-right-pill" aria-label="Start a project">
              <span className="wai-pill-circle wai-pill-circle-dark">
                <GridDots />
              </span>
              <span className="wai-right-label">Digital Solutions</span>
            </a>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="wai-menu"
            className="wai-menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="wai-menu-top">
              <a href="#home" className="wai-brand" onClick={() => setOpen(false)} aria-label="WAI — home">
                <span className="wai-brand-text">WAI</span>
                <span className="wai-brand-sub">Agency</span>
              </a>
              <button type="button" className="wai-menu-close" onClick={() => setOpen(false)} aria-label="Close menu">
                <span className="wai-pill-circle">
                  <Plus size={12} strokeWidth={3} style={{ transform: 'rotate(45deg)' }} aria-hidden="true" />
                </span>
                <span className="wai-menu-close-label">Close</span>
              </button>
            </div>

            <nav className="wai-menu-links" aria-label="Menu navigation">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    // Unlock the page before the anchor's default scroll runs,
                    // otherwise the body scroll-lock can swallow the jump.
                    document.body.style.overflow = ''
                    setOpen(false)
                  }}
                  initial={reduce ? undefined : { opacity: 0, y: 24 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08 * i, ease }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="wai-menu-foot">
              <a
                href="#contact"
                className="wai-menu-cta"
                onClick={() => {
                  document.body.style.overflow = ''
                  setOpen(false)
                }}
              >
                Start a Project
              </a>
              <span className="wai-menu-note">AI &amp; Web Solutions · Creative Production</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
