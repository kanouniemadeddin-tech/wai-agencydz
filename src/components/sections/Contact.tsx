import { useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Mail, MessageCircle } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { FadeIn } from '../ui/FadeIn'
import { serviceOptions } from '../../data/services'
import { buildMailtoUrl, buildWhatsAppUrl, isWhatsAppConfigured, site } from '../../config/site'

interface ContactProps {
  service: string
  onServiceChange: (service: string) => void
}

interface Errors {
  name?: string
  service?: string
  message?: string
}

export function Contact({ service, onServiceChange }: ContactProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [notice, setNotice] = useState<'none' | 'not-configured' | 'opened-whatsapp' | 'opened-email'>('none')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'Please enter your name.'
    if (!service) next.service = 'Please select a service.'
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
        // The WhatsApp number is still a placeholder — do not open a broken wa.me link.
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

  return (
    <section id="contact" className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="contact-grid">
          <div>
            <FadeIn>
              <SectionHeading
                eyebrow="Contact"
                title="Let's build something great."
                description="Have an idea, a project or a business challenge? Tell us about it and let's discuss how WAI Agency can help."
              />
            </FadeIn>
            <FadeIn delay={0.12}>
              <ul className="contact-points">
                <li>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  Your message opens a direct WhatsApp chat with WAI Agency.
                </li>
                <li>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  Nothing is sent automatically — you review the message before sending.
                </li>
                <li>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  A short, clear brief helps us respond faster.
                </li>
                <li>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  Prefer email? Write to us directly at{' '}
                  <a className="inline-link" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </li>
              </ul>
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <div className="contact-panel">
              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="contact-name">
                    Name <span className="req">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="field-error">
                      <AlertCircle size={14} aria-hidden="true" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="contact-service">
                    Service of interest <span className="req">*</span>
                  </label>
                  <select
                    id="contact-service"
                    className="input"
                    value={service}
                    onChange={(e) => onServiceChange(e.target.value)}
                    aria-invalid={!!errors.service}
                    aria-describedby={errors.service ? 'contact-service-error' : undefined}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p id="contact-service-error" className="field-error">
                      <AlertCircle size={14} aria-hidden="true" />
                      {errors.service}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="contact-message">
                    Project message <span className="req">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    className="input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project, your goals and any deadlines…"
                    rows={5}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="field-error">
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
                    Our WhatsApp line is being connected and isn&apos;t active yet. Your message is
                    ready — it will open directly in WhatsApp as soon as the channel is live. You
                    can also reach us now by email at{' '}
                    <a className="inline-link" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                    .
                  </p>
                )}
                {notice === 'opened-whatsapp' && (
                  <p role="status" className="form-status">
                    WhatsApp opened in a new tab with your message pre-filled. If it didn&apos;t
                    open, check your pop-up settings.
                  </p>
                )}
                {notice === 'opened-email' && (
                  <p role="status" className="form-status">
                    Your email app opened with the message pre-filled. If nothing happened, write
                    to us directly at{' '}
                    <a className="inline-link" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                    .
                  </p>
                )}

                <p className="form-note">
                  Submitting opens WhatsApp with your message pre-filled — nothing is sent
                  automatically.
                </p>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
