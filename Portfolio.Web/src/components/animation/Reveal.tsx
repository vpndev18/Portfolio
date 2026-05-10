import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  children: ReactNode
}

export function Reveal({ delay = 0, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
