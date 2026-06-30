import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const skeletonVariants = cva('animate-pulse bg-secondary/10', {
  variants: {
    variant: {
      text: 'h-4 w-full rounded',
      circle: 'rounded-full',
      rect: 'rounded-xl',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
})

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    )
  },
)
Skeleton.displayName = 'Skeleton'

export { Skeleton }
