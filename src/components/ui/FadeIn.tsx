import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}

/** Standard scroll-reveal wrapper. Honours prefers-reduced-motion. */
export function FadeIn({ children, delay = 0, className, y = 24 }: FadeInProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
