interface PageHeroProps {
  title: string
  eyebrow?: string
  description?: string
  align?: 'left' | 'center'
  variant?: 'light' | 'dark' | 'red' | 'warm'
  className?: string
}

const variantStyles = {
  light: {
    bg: 'bg-white',
    title: 'text-[#111111]',
    desc: 'text-[#666666]',
    eyebrow: 'text-[#C8102E]',
    rule: 'bg-[#C8102E]',
  },
  warm: {
    bg: 'bg-[#fbf5f2]',
    title: 'text-[#111111]',
    desc: 'text-[#555555]',
    eyebrow: 'text-[#C8102E]',
    rule: 'bg-[#C8102E]',
  },
  dark: {
    bg: 'bg-[#111111]',
    title: 'text-white',
    desc: 'text-[#BBBBBB]',
    eyebrow: 'text-[#F5A6B2]',
    rule: 'bg-[#C8102E]',
  },
  red: {
    bg: 'bg-[#C8102E]',
    title: 'text-white',
    desc: 'text-[#FBD9DE]',
    eyebrow: 'text-white',
    rule: 'bg-white',
  },
}

export default function PageHero({
  title,
  eyebrow,
  description,
  align = 'left',
  variant = 'light',
  className = '',
}: PageHeroProps) {
  const v = variantStyles[variant]
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'
  const ruleMargin = align === 'center' ? 'mx-auto' : ''

  return (
    <section className={`${v.bg} ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className={`${alignment} max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {eyebrow && (
            <p className={`${v.eyebrow} text-[11px] font-bold tracking-[0.16em] uppercase mb-5`}>
              {eyebrow}
            </p>
          )}
          <h1
            className={`${v.title} text-3xl sm:text-4xl md:text-[44px] lg:text-5xl font-bold leading-[1.12] tracking-[-0.01em]`}
          >
            {title}
          </h1>
          <span className={`${v.rule} ${ruleMargin} block w-12 h-[3px] rounded-full mt-7`} aria-hidden="true" />
          {description && (
            <p className={`${v.desc} text-[16px] md:text-[18px] leading-[1.7] mt-7 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
