import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
  /** Ghosted oversized section number rendered behind the heading. */
  index?: string
}

/** Consistent section header: ghost number, eyebrow pill, title, optional lead text. */
export function SectionHeading({ eyebrow, title, description, align = 'left', index }: SectionHeadingProps) {
  return (
    <div className={`section-head${align === 'center' ? ' center' : ''}`}>
      {index && (
        <span className="section-ghost" aria-hidden="true">
          {index}
        </span>
      )}
      <span className="pill">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-lead">{description}</p>}
    </div>
  )
}
