import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Eye, MessageCircle, X } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { FadeIn } from '../ui/FadeIn'
import { projects, type Project } from '../../data/portfolio'

interface PortfolioProps {
  /** Closes the modal and navigates the slide deck to Contact. */
  onDiscuss: () => void
}

/* ── Section ── */

export function Portfolio({ onDiscuss }: PortfolioProps) {
  const [selected, setSelected] = useState<Project | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!selected) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [selected])

  return (
    <section id="portfolio" className="section portfolio">
      <div className="container">
        <FadeIn>
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected work"
            description="A look at the possibilities of technology and creative production."
          />
        </FadeIn>

        <div className="work-grid">
          {projects.map((project, i) => {
            return (
              <FadeIn key={project.id} delay={Math.min(i * 0.08, 0.24)}>
                <article className="work-card">
                  {/* Whole card opens the project dialog */}
                  <button
                    type="button"
                    className="card-open-overlay"
                    onClick={() => setSelected(project)}
                    aria-label={`View ${project.title}`}
                  />
                  <div className="thumb">
                    <img src={project.image.src} alt={project.image.alt} loading="lazy" />
                    <span className="badge">{project.badge}</span>
                  </div>
                  <div className="work-body">
                    <span className="work-cat">{project.category}</span>
                    <h3 className="work-title">{project.title}</h3>
                    <p className="work-desc">{project.description}</p>
                    <ul className="work-tools">
                      {project.tools.map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <span className="work-view" aria-hidden="true">
                      <Eye size={15} aria-hidden="true" />
                      View Project
                    </span>
                  </div>
                </article>
              </FadeIn>
            )
          })}
        </div>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="modal-backdrop"
              onClick={() => setSelected(null)}
              role="presentation"
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              className="modal"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <button
                ref={closeRef}
                type="button"
                className="modal-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={16} aria-hidden="true" />
              </button>

              <img className="modal-img" src={selected.image.src} alt={selected.image.alt} />
              <span className="modal-badge">{selected.badge}</span>
              <span className="modal-cat">{selected.category}</span>
              <h3 id="project-modal-title" className="modal-title">
                {selected.title}
              </h3>
              <p className="modal-text">{selected.details}</p>

              <h4 className="modal-sub">Tools &amp; techniques</h4>
              <ul className="modal-tools">
                {selected.tools.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>

              <button type="button" className="modal-cta" onClick={() => { setSelected(null); onDiscuss() }}>
                <MessageCircle size={16} aria-hidden="true" />
                Discuss a project like this
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
