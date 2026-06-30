import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-secondary/10 text-secondary hover:bg-secondary/20',
        primary:
          'bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow-md',
        secondary:
          'bg-secondary text-white shadow-sm hover:bg-secondary/90 hover:shadow-md',
        outline:
          'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost:
          'hover:bg-secondary/10 hover:text-secondary',
        danger:
          'bg-error text-white shadow-sm hover:bg-error/90 hover:shadow-md',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 min-h-12 px-6 text-base',
        xl: 'h-14 min-h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
