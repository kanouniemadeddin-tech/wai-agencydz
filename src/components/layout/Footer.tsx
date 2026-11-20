import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react'
import { site, isWhatsAppConfigured } from '../../config/site'
import { serviceOptions } from '../../data/services'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  const year = new Date().getFullYear()

  const socials = [
    { label: 'Instagram', href: site.socials.instagram, Icon: Instagram },
    { label: 'LinkedIn', href: site.socials.linkedin, Icon: Linkedin },
    { label: 'Facebook', href: site.socials.facebook, Icon: Facebook },
  ].filter((s) => s.href !== '')

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#home" className="footer-brand" aria-label="WAI — home">
              WAI<span className="footer-brand-sub">Agency</span>
            </a>
            <p className="footer-desc">
              Digital solutions and creative production for businesses that want to move forward —
              from websites and automation to video and brand identity.
            </p>
          </div>

          <nav className="footer-col" aria-label="Footer navigation">
            <h3>Navigate</h3>
            <ul>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Services">
            <h3>Services</h3>
            <ul>
              {serviceOptions.slice(0, 5).map((name) => (
                <li key={name}>
                  <a href="#services">{name}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h3>Contact</h3>
            <ul>
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`}>
                    <Mail
                      size={14}
                      aria-hidden="true"
                      style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }}
                    />
                    {site.email}
                  </a>
                </li>
              )}
              {isWhatsAppConfigured && (
                <li>
                  <a href="#contact">WhatsApp</a>
                </li>
              )}
              {!site.email && !isWhatsAppConfigured && (
                <li>
                  <span className="footer-static">Contact channels coming soon</span>
                </li>
              )}
            </ul>
            {socials.length > 0 && (
              <div className="social-row">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="social-btn"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <span>© {year} WAI Agency. All rights reserved.</span>
            <span>Digital solutions · Creative production</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
