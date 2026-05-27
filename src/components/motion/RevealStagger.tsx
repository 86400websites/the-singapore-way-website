'use client'

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

type RevealStaggerProps = {
  children: ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
  y?: number
  duration?: number
  once?: boolean
}

export default function RevealStagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0.04,
  y = 16,
  duration = 0.55,
  once = true,
}: RevealStaggerProps) {
  const reduceMotion = useReducedMotion()

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
        delayChildren: reduceMotion ? 0 : delayChildren,
      },
    },
  }

  const item = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration, ease: EASE } },
      }
    : {
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once, margin: '0px 0px -10% 0px' }}
        className={className}
      >
        {Array.isArray(children)
          ? children.map((child, i) => (
              <m.div key={i} variants={item}>
                {child}
              </m.div>
            ))
          : <m.div variants={item}>{children}</m.div>}
      </m.div>
    </LazyMotion>
  )
}
