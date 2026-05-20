interface PageHeroProps {
  title: string
  subtitle?: string
  description?: string
  dark?: boolean
  red?: boolean
  className?: string
}

export default function PageHero({ title, subtitle, description, dark = true, red = false, className = '' }: PageHeroProps) {
  const bg = red ? 'bg-[#C8102E]' : dark ? 'bg-[#111111]' : 'bg-white'
  const textColor = (dark || red) ? 'text-white' : 'text-[#111111]'
  const subtitleColor = (dark || red) ? 'text-[#CCCCCC]' : 'text-[#C8102E]'
  const descColor = (dark || red) ? 'text-[#AAAAAA]' : 'text-[#666666]'

  return (
    <section className={`${bg} ${textColor} py-20 md:py-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {subtitle && (
          <p className={`${subtitleColor} text-sm font-semibold tracking-widest uppercase mb-4`}>
            {subtitle}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight">
          {title}
        </h1>
        {description && (
          <p className={`${descColor} text-lg md:text-xl max-w-2xl mt-6 leading-relaxed`}>
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
