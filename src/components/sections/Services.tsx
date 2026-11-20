import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { FadeIn } from '../ui/FadeIn'
import { serviceCategories } from '../../data/services'

interface ServicesProps {
  /** Selects this service in the contact form and scrolls to it. */
  onSelectService: (serviceName: string) => void
}

export function Services({ onSelectService }: ServicesProps) {
  return (
    <section id="services" className="section">
      <div className="container">
        <FadeIn>
          <SectionHeading
            eyebrow="Services"
            title="What we do"
            description="From intelligent digital solutions to creative production, we help businesses turn ideas into effective digital experiences."
          />
        </FadeIn>

        {serviceCategories.map((category) => (
          <div key={category.id} className="service-category">
            <FadeIn>
              <div className="service-cat-head">
                <div className="service-cat-index">
                  <span className="idx">{category.index}</span>
                  <h3>
                    <button
                      type="button"
                      className="service-cat-btn"
                      onClick={() => onSelectService(category.name)}
                    >
                      {category.name}
                      <ArrowRight size={17} aria-hidden="true" />
                    </button>
                  </h3>
                </div>
                {category.description && <p className="service-cat-desc">{category.description}</p>}
              </div>
            </FadeIn>

            <div className="service-grid">
              {category.services.map((service, i) => {
                const Icon = service.icon
                return (
                  <FadeIn key={service.id} delay={Math.min(i * 0.06, 0.24)}>
                    <div className="card service-card">
                      <button
                        type="button"
                        className="card-open-overlay"
                        onClick={() => onSelectService(service.name)}
                        aria-label={`Open ${service.name}`}
                      />
                      <span className="icon-chip">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <h4>
                        <button
                          type="button"
                          className="service-card-title-btn"
                          onClick={() => onSelectService(service.name)}
                        >
                          {service.name}
                          <ArrowRight size={14} aria-hidden="true" style={{ display: 'inline', marginLeft: 6 }} />
                        </button>
                      </h4>
                      <p>{service.description}</p>
                      <ul className="chip-list">
                        {service.deliverables.map((d) => (
                          <li key={d} className="chip">
                            {d}
                          </li>
                        ))}
                      </ul>
                      <span className="link-cta" aria-hidden="true">
                        Discuss this service
                        <ArrowRight size={15} aria-hidden="true" />
                      </span>
                    </div>
                  </FadeIn>
                )
              })}

              {/* Category summary tile completes the grid for 5-item categories */}
              <FadeIn delay={0.24}>
                <div className="card service-card service-card-note">
                  <button
                    type="button"
                    className="card-open-overlay"
                    onClick={() => onSelectService('Other')}
                    aria-label="Tell us what you need"
                  />
                  <span className="note-label">{category.name}</span>
                  <p>
                    {category.index === '01'
                      ? 'Technology that works quietly in the background of your business.'
                      : 'Creative work that makes your brand look the way it deserves.'}
                  </p>
                  <span className="link-cta" aria-hidden="true">
                    Tell us what you need
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </FadeIn>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
