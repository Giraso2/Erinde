import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}

const variantStyles = {
  default: {
    iconBg: 'bg-secondary/10 text-secondary',
    trendUp: 'text-success',
    trendDown: 'text-error',
  },
  success: {
    iconBg: 'bg-success/10 text-success',
    trendUp: 'text-success',
    trendDown: 'text-error',
  },
  warning: {
    iconBg: 'bg-warning/10 text-warning',
    trendUp: 'text-success',
    trendDown: 'text-error',
  },
  error: {
    iconBg: 'bg-error/10 text-error',
    trendUp: 'text-success',
    trendDown: 'text-error',
  },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  variant = 'default',
}: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl border border-border bg-card p-6 shadow-soft"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend >= 0 ? styles.trendUp : styles.trendDown,
                )}
              >
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
              {description && (
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-2xl',
          styles.iconBg,
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  )
}
