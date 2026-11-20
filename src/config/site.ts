/**
 * Central site configuration.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  BEFORE LAUNCH: replace every value marked "PLACEHOLDER" with real data.
 *  Nothing marked as a placeholder is ever rendered publicly by the site —
 *  contact buttons stay disabled and social icons stay hidden until these
 *  values are configured.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const site = {
  name: 'WAI Agency',
  tagline: 'Technology and creativity, built for business.',
  description:
    'WAI Agency builds digital solutions and creates compelling visual experiences that help businesses move forward.',

  /** Production domain. */
  url: 'https://waiagency.dz',

  /** Real email address — shown in the footer and contact section. */
  email: 'waiagencyfor@gmail.com',

  whatsapp: {
    /** Real WhatsApp number, international format, digits only. */
    number: '213652053208',
  },

  socials: {
    /** Real profile URLs only. Empty string = the icon is hidden from the site. */
    instagram: '',
    linkedin: '',
    facebook: '',
  },
} as const

/** True only when the WhatsApp number has been replaced with a real number. */
export const isWhatsAppConfigured = /^[0-9]{8,15}$/.test(site.whatsapp.number)

export interface WhatsAppInquiry {
  name?: string
  service?: string
  message?: string
}

/** Builds the official wa.me deep link with a formatted, URL-encoded message. */
export function buildWhatsAppUrl({ name, service, message }: WhatsAppInquiry): string {
  const lines = [
    'Hello WAI Agency,',
    name ? `My name is ${name}.` : '',
    service ? `I'm interested in: ${service}.` : '',
    message ? `Project details:\n${message}` : '',
    "I'd like to discuss this project.",
  ]
  const text = lines.filter(Boolean).join('\n\n')
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`
}

export interface EmailInquiry {
  name?: string
  service?: string
  message?: string
}

/** Builds a mailto: link with subject and body pre-filled for the client's email app. */
export function buildMailtoUrl({ name, service, message }: EmailInquiry): string {
  const subject = service ? `Project inquiry — ${service}` : 'Project inquiry — WAI Agency'
  const lines = [
    'Hello WAI Agency,',
    name ? `My name is ${name}.` : '',
    service ? `I'm interested in: ${service}.` : '',
    message ? `Project details:\n${message}` : '',
    "I'd like to discuss this project.",
  ]
  const body = lines.filter(Boolean).join('\n\n')
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
