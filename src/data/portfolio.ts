/**
 * Portfolio showcase.
 *
 * IMPORTANT: every entry is a DEMONSTRATION CONCEPT built to show what WAI
 * Agency can deliver — not a completed client project. Do not add client
 * names, metrics or fabricated results.
 */
export type ProjectVisual = 'ecommerce' | 'chatbot' | 'brand' | 'content'

export interface ProjectImage {
  src: string
  alt: string
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  tools: string[]
  visual: ProjectVisual
  badge: string
  details: string
  /** Real photo matching the project description. */
  image: ProjectImage
}

export const projects: Project[] = [
  {
    id: 'ecommerce-experience',
    title: 'E-commerce Store Experience',
    category: 'E-commerce',
    description:
      'A modern online shopping experience featuring product catalogs, responsive design and streamlined shopping interactions.',
    tools: ['React', 'Tailwind CSS', 'Cart & checkout flows'],
    visual: 'ecommerce',
    badge: 'Concept Project',
    image: {
      src: '/images/portfolio/ecommerce.jpg',
      alt: 'Customer completing a purchase at a small store checkout, paying by card',
    },
    details:
      'A concept storefront demonstrating how a structured product catalog, clean category navigation and a distraction-free checkout can work together on both mobile and desktop.',
  },
  {
    id: 'ai-support-assistant',
    title: 'AI Customer Support Assistant',
    category: 'AI Solutions',
    description:
      'An AI-powered customer support concept designed to answer questions and simplify customer communication.',
    tools: ['AI chat integration', 'Website embed', 'Business knowledge base'],
    visual: 'chatbot',
    badge: 'Concept Project',
    image: {
      src: '/images/portfolio/ai-support.jpg',
      alt: 'White robotic hand reaching forward, representing AI automation',
    },
    details:
      'A support assistant concept that answers common customer questions directly on a business website, drawing from a curated knowledge base and escalating complex cases to the team.',
  },
  {
    id: 'brand-launch-system',
    title: 'Brand Launch Creative System',
    category: 'Creative Production',
    description:
      'A complete creative direction concept featuring visual identity, promotional graphics and advertising assets.',
    tools: ['Visual identity', 'Promotional graphics', 'Ad creative kit'],
    visual: 'brand',
    badge: 'Concept Project',
    image: {
      src: '/images/portfolio/brand-launch.jpg',
      alt: 'Designer desk with color swatches and brand style guides',
    },
    details:
      'A launch kit concept pairing a logo and identity system with promotional graphics and ad-ready creative assets, so a new brand enters the market with one consistent look.',
  },
  {
    id: 'content-workflow',
    title: 'Content Repurposing Workflow',
    category: 'Creative Production',
    description:
      'A creative production concept transforming long-form content into engaging short-form videos and social media formats.',
    tools: ['Video editing', 'Vertical formats', 'Content planning'],
    visual: 'content',
    badge: 'Concept Project',
    image: {
      src: '/images/portfolio/content-workflow.jpg',
      alt: 'Video editing timeline on a monitor with multiple clips',
    },
    details:
      'A production workflow concept that turns one long-form piece of content into a set of short vertical videos and social formats — keeping a consistent brand style across every cut.',
  },
]
