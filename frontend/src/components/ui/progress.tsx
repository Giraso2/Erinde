import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const progressVariants = cva(
  'relative h-2 w-full overflow-hidden rounded-full bg-secondary/10',
  {
    variants: {
      variant: {
        default: '',
        success: '',
        warning: '',
        error: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const indicatorVariants = cva(
  'h-full w-full flex-1 transition-all duration-500 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-secondary',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  value?: number
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, variant, ...props }, ref) => {
  const clampedValue = Math.min(100, Math.max(0, value))
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ variant }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(indicatorVariants({ variant }))}
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
