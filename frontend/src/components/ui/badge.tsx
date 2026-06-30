import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-primary/10 text-primary border border-transparent',
        secondary:
          'bg-secondary/10 text-secondary border border-transparent',
        success:
          'bg-success/10 text-success border border-transparent',
        warning:
          'bg-warning/10 text-warning border border-transparent',
        error:
          'bg-error/10 text-error border border-transparent',
        outline:
          'border border-border text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    )
  },
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
