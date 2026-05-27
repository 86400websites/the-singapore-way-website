import * as React from 'react'

import { cn } from '@/lib/utils'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean
  accent?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, accent = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        interactive ? 'card-link' : 'card-editorial',
        accent && 'card-accent-top',
        'flex flex-col',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

const CardMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { aspect?: string }
>(({ className, aspect = 'aspect-[4/3]', ...props }, ref) => (
  <div ref={ref} className={cn('card-thumb', aspect, className)} {...props} />
))
CardMedia.displayName = 'CardMedia'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-2 px-7 pt-7 md:px-8 md:pt-8', className)}
      {...props}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

const CardEyebrow = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('eyebrow', className)} {...props} />
  ),
)
CardEyebrow.displayName = 'CardEyebrow'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-[19px] md:text-[20px] font-bold text-[#111111] leading-[1.25] tracking-[-0.005em]',
        className,
      )}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-[15px] text-[#666666] leading-[1.6]', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-4 px-7 py-6 md:px-8 md:py-7 flex-1', className)}
      {...props}
    />
  ),
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-wrap items-center gap-3 px-7 pb-7 md:px-8 md:pb-8',
        className,
      )}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardMedia,
  CardHeader,
  CardEyebrow,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}
