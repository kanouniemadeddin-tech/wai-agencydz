import { motion, useReducedMotion } from 'motion/react'
import '../../styles/hero.css'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Hero tag pills — clicking one preselects the matching service in the contact form. */
const heroTags: { label: string; service: string }[] = [
  { label: 'E-commerce', service: 'E-commerce Development' },
  { label: 'AI Chatbots', service: 'AI Chatbots' },
  { label: 'Brand Identity', service: 'Brand Identity' },
]

interface HeroProps {
  /** Selects this service in the contact form and scrolls to it. */
  onSelectService: (serviceName: string) => void
}

export function Hero({ onSelectService }: HeroProps) {
  const reduce = useReducedMotion()

  /** Spec choreography: slide-up + fade with the shared cubic-bezier ease. */
  const fadeUp = (delay: number, y = 16, duration = 0.8) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration, delay, ease } }
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration, delay, ease },
        }

  return (
    <section id="home" className="wai-hero">
      {/* Full-viewport background video */}
      <motion.div
        className="wai-video-frame"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease }}
        aria-hidden="true"
      >
        <video src={VIDEO_URL} autoPlay muted loop playsInline preload="auto" />
      </motion.div>

      <div className="wai-hero-spacer" />

      {/* Footer content pinned to the bottom, over a white gradient fade-up */}
      <motion.div
        className="wai-hero-footer"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease }}
      >
        <div className="wai-hero-left">
          <motion.div className="wai-hero-sub" {...fadeUp(0.6)}>
            <span className="wai-dot" />
            <span>Digital solutions &amp; creative production</span>
          </motion.div>

          <motion.h1 className="wai-hero-heading" {...fadeUp(0.8, 20)}>
            Technology &amp; creativity,
            <br />
            built for business.
          </motion.h1>

          <motion.div className="wai-hero-actions" {...fadeUp(1.0)}>
            <a className="wai-btn-dark" href="#services">
              See Services
            </a>
            <a className="wai-btn-outline" href="#portfolio">
              Selected Work
            </a>
          </motion.div>
        </div>

        <motion.div className="wai-hero-tags" {...fadeUp(1.1)}>
          {heroTags.map((tag) => (
            <button
              key={tag.service}
              type="button"
              className="wai-hero-tag"
              onClick={() => onSelectService(tag.service)}
            >
              {tag.label}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
