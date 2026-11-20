import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AlertCircle, Mail, MessageCircle, X } from 'lucide-react'
import { buildMailtoUrl, buildWhatsAppUrl, isWhatsAppConfigured, site } from '../../config/site'
import { serviceOptions } from '../../data/services'

export interface Offer {
  name: string
  category?: string
  description?: string
  deliverables?: string[]
}

interface ServiceModalProps {
  offer: Offer | null
  onClose: () => void
}

interface Errors {
  name?: string
  message?: string
}

/**
 * Offer dialog: describes the chosen service/category and embeds the contact
 * form, so a client can inquire without scrolling to the bottom of the page.
 */
export function ServiceModal({ offer, onClose }: ServiceModalProps) {
  const [name, setName] = useState('')
  const [service, setService] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [notice, setNotice] = useState<'none' | 'not-configured' | 'opened-whatsapp' | 'opened-email'>('none')
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()

  // Reset per-open state whenever a new offer is opened.
  useEffect(() => {
    if (!offer) return
    setService(offer.name)
    setNotice('none')
    setErrors({})
    closeRef.current?.focus()
  }, [offer])

  // Lock page scroll and close on Escape while the dialog is open.
  useEffect(() => {
    if (!offer) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [offer, onClose])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'Please enter your name.'
    if (message.trim().length < 10)
      next.message = 'Please describe your project (at least 10 characters).'
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setNotice('none')
      return
    }

    const channel =
      (e.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'email'
        ? 'email'
        : 'whatsapp'

    if (channel === 'whatsapp') {
      if (!isWhatsAppConfigured) {
        // WhatsApp number still a placeholder — never open a broken wa.me link.
        setNotice('not-configured')
        return
      }
      const url = buildWhatsAppUrl({ name: name.trim(), service, message: message.trim() })
      window.open(url, '_blank', 'noopener,noreferrer')
      setNotice('opened-whatsapp')
      return
    }

    // Email channel opens the client's mail app with everything pre-filled.
    window.location.href = buildMailtoUrl({ name: name.trim(), service, message: message.trim() })
    setNotice('opened-email')
  }

  const fade = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 24, scale: 0.98 },
      }

  return (
    <AnimatePresence>
      {offer && (
        <motion.div
          className="modal-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="modal-backdrop" onClick={onClose} role="presentation" aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-modal-title"
            className="modal"
            initial={fade.initial}
            animate={fade.animate}
            exit={fade.exit}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <button
              ref={closeRef}
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={16} aria-hidden="true" />
            </button>

            {offer.category && <span className="modal-badge">{offer.category}</span>}
            <h3 id="offer-modal-title" className="modal-title">
              {offer.name}
            </h3>
            {offer.description && <p className="modal-text">{offer.description}</p>}

            {offer.deliverables && offer.deliverables.length > 0 && (
              <>
                <h4 className="modal-sub">What&apos;s included</h4>
                <ul className="modal-tools">
                  {offer.deliverables.map((d) => (
                    <li key={d} className="chip">
                      {d}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h4 className="modal-sub">Contact us about this</h4>
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="offer-name">
                  Name <span className="req">*</span>
                </label>
                <input
                  id="offer-name"
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'offer-name-error' : undefined}
                />
                {errors.name && (
                  <p id="offer-name-error" className="field-error">
                    <AlertCircle size={14} aria-hidden="true" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="offer-service">Service of interest</label>
                <select
                  id="offer-service"
                  className="input"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="offer-message">
                  Project message <span className="req">*</span>
                </label>
                <textarea
                  id="offer-message"
                  className="input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project, your goals and any deadlines…"
                  rows={4}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'offer-message-error' : undefined}
                />
                {errors.message && (
                  <p id="offer-message-error" className="field-error">
                    <AlertCircle size={14} aria-hidden="true" />
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="btn-row">
                <button type="submit" name="channel" value="whatsapp" className="btn btn-dark">
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp
                </button>
                <button type="submit" name="channel" value="email" className="btn btn-outline">
                  <Mail size={16} aria-hidden="true" />
                  Email
                </button>
              </div>

              {notice === 'not-configured' && (
                <p role="status" className="form-status">
                  Our WhatsApp line is being connected and isn&apos;t active yet. Reach us right now
                  by email at{' '}
                  <a className="inline-link" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  .
                </p>
              )}
              {notice === 'opened-whatsapp' && (
                <p role="status" className="form-status">
                  WhatsApp opened in a new tab with your message pre-filled. If it didn&apos;t open,
                  check your pop-up settings — or email us at{' '}
                  <a className="inline-link" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  .
                </p>
              )}
              {notice === 'opened-email' && (
                <p role="status" className="form-status">
                  Your email app opened with the message pre-filled. If nothing happened, write to
                  us directly at{' '}
                  <a className="inline-link" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  .
                </p>
              )}

              <p className="form-note">
                <Mail size={13} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                Or email us anytime at{' '}
                <a className="inline-link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
