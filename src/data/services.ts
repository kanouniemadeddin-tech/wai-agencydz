import {
  Globe,
  ShoppingBag,
  MessagesSquare,
  Workflow,
  Blocks,
  Clapperboard,
  Smartphone,
  PenTool,
  Fingerprint,
  Megaphone,
  type LucideIcon,
} from 'lucide-react'

export interface ServiceCategory {
  id: string
  index: string
  name: string
  description?: string
  services: Service[]
}

export interface Service {
  id: string
  name: string
  description: string
  deliverables: string[]
  icon: LucideIcon
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'ai-web-solutions',
    index: '01',
    name: 'AI & Web Solutions',
    services: [
      {
        id: 'business-website',
        name: 'Business Websites',
        description:
          'Professional websites that present your business clearly and convert visitors into inquiries.',
        deliverables: ['Responsive layout', 'Custom UI/UX', 'Contact integrations', 'SEO foundations'],
        icon: Globe,
      },
      {
        id: 'ecommerce',
        name: 'E-commerce Development',
        description:
          'Online stores designed to showcase your products and make buying simple on every device.',
        deliverables: ['Product catalog', 'Cart & checkout', 'Responsive shopping', 'Store management'],
        icon: ShoppingBag,
      },
      {
        id: 'ai-chatbot',
        name: 'AI Chatbots',
        description:
          'AI-powered assistants that answer customer questions and support your business around the clock.',
        deliverables: ['Automated responses', 'Business info assistant', 'Website integration'],
        icon: MessagesSquare,
      },
      {
        id: 'automation',
        name: 'Business Automation',
        description:
          'Automation of repetitive tasks and workflows so your team can focus on real work.',
        deliverables: ['Workflow automation', 'Task automation', 'Data processing', 'Process optimization'],
        icon: Workflow,
      },
      {
        id: 'custom-solutions',
        name: 'Custom Digital Solutions',
        description:
          'Tailored web applications and business tools built around the way your business actually works.',
        deliverables: ['Web applications', 'Business tools', 'API integrations', 'Specialized systems'],
        icon: Blocks,
      },
    ],
  },
  {
    id: 'creative-production',
    index: '02',
    name: 'Creative Production',
    services: [
      {
        id: 'promotional-video',
        name: 'Promotional Videos',
        description:
          'Commercial videos and product presentations that communicate your offer with clarity and style.',
        deliverables: ['Commercial videos', 'Product presentations', 'Brand promotion'],
        icon: Clapperboard,
      },
      {
        id: 'social-reels',
        name: 'Social Media Reels',
        description:
          'Short-form vertical videos edited for the formats your audience actually watches.',
        deliverables: ['Short-form video', 'Vertical editing', 'Social formats'],
        icon: Smartphone,
      },
      {
        id: 'graphic-design',
        name: 'Graphic Design',
        description:
          'Promotional graphics and marketing materials designed to be clear, on-brand and effective.',
        deliverables: ['Promotional graphics', 'Marketing materials', 'Ad visuals'],
        icon: PenTool,
      },
      {
        id: 'brand-identity',
        name: 'Brand Identity',
        description:
          'Logo and visual identity systems that give your business a consistent, memorable face.',
        deliverables: ['Logo design', 'Identity system', 'Brand guidelines', 'Color & typography'],
        icon: Fingerprint,
      },
      {
        id: 'ad-creatives',
        name: 'Advertising Creatives',
        description:
          'Campaign visuals and product advertisements built to perform across ad platforms.',
        deliverables: ['Campaign visuals', 'Product ads', 'Creative assets'],
        icon: Megaphone,
      },
    ],
  },
]

/** Flat list of selectable services for the contact form (categories included for general inquiries). */
export const serviceOptions: string[] = [
  ...serviceCategories.flatMap((category) => [category.name, ...category.services.map((s) => s.name)]),
  'Other',
]

/** A resolvable offer (service or category) shown in the offer dialog. */
export interface OfferDetail {
  name: string
  category?: string
  description?: string
  deliverables?: string[]
}

/** Looks up a service or category by name for the offer dialog. */
export function findOffer(name: string): OfferDetail | null {
  for (const category of serviceCategories) {
    if (category.name === name) {
      return { name: category.name, description: category.description }
    }
    const service = category.services.find((s) => s.name === name)
    if (service) {
      return {
        name: service.name,
        category: category.name,
        description: service.description,
        deliverables: service.deliverables,
      }
    }
  }
  if (name === 'Other') {
    return {
      name: 'Other',
      description:
        'A custom digital or creative project built around what your business needs — tell us about it and we will shape the solution with you.',
    }
  }
  return null
}
