import { Layers, MessagesSquare, Rocket, SlidersHorizontal } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { FadeIn } from '../ui/FadeIn'

const values = [
  {
    Icon: Layers,
    title: 'Technology + Creativity',
    description: 'One agency combining technical development and creative production.',
  },
  {
    Icon: SlidersHorizontal,
    title: 'Tailored Solutions',
    description: 'Work designed around individual business needs.',
  },
  {
    Icon: Rocket,
    title: 'Modern Approach',
    description: 'Using current tools, technologies and design practices.',
  },
  {
    Icon: MessagesSquare,
    title: 'Clear Communication',
    description: 'Simple collaboration and transparent project expectations.',
  },
]

export function WhyWAI() {
  return (
    <section id="why" className="section">
      <div className="container">
        <FadeIn>
          <SectionHeading
            eyebrow="Why WAI"
            align="center"
            title="Why work with WAI?"
            description="Two disciplines, one team — and a process built around your business."
          />
        </FadeIn>

        <div className="why-grid">
          {values.map(({ Icon, title, description }, i) => (
            <FadeIn key={title} delay={Math.min(i * 0.08, 0.24)}>
              {/* Charcoal gradient art cards with grain — monochrome Zeronode treatment */}
              <div className={`why-card grain ${i % 2 === 0 ? 'fluid-dark' : 'fluid-dark-alt'}`}>
                <span className="why-icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
