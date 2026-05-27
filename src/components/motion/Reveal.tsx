'use client'

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
  as?: 'div' | 'section' | 'article' | 'span'
  once?: boolean
}

export default function Reveal({
  children,
  delay = 0,
  y = 16,
  duration = 0.55,
  className,
  as = 'div',
  once = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  const initial = reduceMotion ? { opacity: 0 } : { opacity: 0, y }
  const whileInView = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }

  const MotionTag = m[as]

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionTag
        initial={initial}
        whileInView={whileInView}
        viewport={{ once, margin: '0px 0px -10% 0px' }}
        transition={{ duration, delay, ease: EASE }}
        className={className}
      >
        {children}
      </MotionTag>
    </LazyMotion>
  )
}
