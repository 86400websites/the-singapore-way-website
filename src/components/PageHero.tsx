import Image from 'next/image'

interface PageHeroProps {
  title: string
  eyebrow?: string
  description?: string
  align?: 'left' | 'center'
  variant?: 'light' | 'dark' | 'red' | 'warm'
  className?: string
  /** Optional right-side hero image (16:9, white background). When set, the hero
   *  switches to a split layout: content left, image top-right/right. */
  image?: string
  imageAlt?: string
  /** Pass true for above-the-fold heroes to prioritise the image load. */
  priority?: boolean
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
  image,
  imageAlt = '',
  priority = false,
}: PageHeroProps) {
  const v = variantStyles[variant]
  const hasImage = Boolean(image)
  // A side image only reads well with left-aligned content.
  const effectiveAlign = hasImage ? 'left' : align
  const alignment = effectiveAlign === 'center' ? 'text-center' : 'text-left'
  const ruleMargin = effectiveAlign === 'center' ? 'mx-auto' : ''

  const content = (
    <div
      className={`${alignment} ${
        hasImage ? '' : `max-w-3xl ${effectiveAlign === 'center' ? 'mx-auto' : ''}`
      }`}
    >
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
        <p
          className={`${v.desc} text-[16px] md:text-[18px] leading-[1.7] mt-7 max-w-2xl ${
            effectiveAlign === 'center' ? 'mx-auto' : ''
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )

  return (
    <section className={`${v.bg} ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-28">
        {hasImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Text first in the DOM: leads on mobile (stacked above the
                illustration) and sits left on desktop. */}
            <div className="lg:col-span-6">{content}</div>
            <div className="lg:col-span-6">
              <div className="relative mx-auto lg:ml-auto w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[560px] aspect-[16/9]">
                <Image
                  src={image as string}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 1024px) 560px, (min-width: 640px) 420px, 320px"
                  className="object-contain"
                  priority={priority}
                />
              </div>
            </div>
          </div>
        ) : (
          content
        )}
      </div>
    </section>
  )
}
