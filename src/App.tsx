import { useState } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { Services } from './components/sections/Services'
import { Portfolio } from './components/sections/Portfolio'
import { WhyWAI } from './components/sections/WhyWAI'
import { Contact } from './components/sections/Contact'
import { ServiceModal, type Offer } from './components/sections/ServiceModal'
import { findOffer } from './data/services'

export default function App() {
  // The service preselected in the contact form (set from Services cards).
  const [service, setService] = useState('')

  const scrollToContact = () => {
    const target = document.getElementById('contact')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  const [offer, setOffer] = useState<Offer | null>(null)

  /** Opens the offer dialog describing the chosen offer, with contact form inside. */
  const openOffer = (name: string) => {
    const target = findOffer(name)
    if (target) setOffer(target)
  }

  return (
    <>
      <a href="#home" className="skip-link">
        Skip to content
      </a>

      <Header />

      <main>
        <Hero onSelectService={openOffer} />
        <Services onSelectService={openOffer} />
        <Portfolio onDiscuss={scrollToContact} />
        <WhyWAI />
        <Contact service={service} onServiceChange={setService} />
      </main>

      {/* Offer dialog: offer details + embedded contact form */}
      <ServiceModal offer={offer} onClose={() => setOffer(null)} />

      <Footer />
    </>
  )
}
