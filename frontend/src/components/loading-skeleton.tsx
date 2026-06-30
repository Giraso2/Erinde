import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  type: 'card' | 'table' | 'list' | 'chart'
  count?: number
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <Skeleton variant="rect" className="mb-4 h-40 w-full" />
      <div className="space-y-3">
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
        <Skeleton variant="text" className="h-4 w-2/3" />
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft">
      <div className="border-b border-border p-4">
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              className="h-4 flex-1"
            />
          ))}
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="border-b border-border p-4 last:border-0">
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, col) => (
              <Skeleton
                key={col}
                variant="text"
                className="h-3 flex-1"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
        >
          <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-1/3" />
            <Skeleton variant="text" className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="space-y-2">
        <Skeleton variant="text" className="h-5 w-1/4" />
        <Skeleton variant="text" className="h-3 w-1/3" />
      </div>
      <div className="relative mt-6 h-64">
        <div className="absolute inset-0 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton variant="text" className="h-2 w-8" />
              <div className="h-px flex-1 bg-border" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-end gap-4 px-14 pb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rect"
              className="flex-1"
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count })

  switch (type) {
    case 'card':
      return (
        <div className={cn('grid gap-4', count > 1 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : '')}>
          {items.map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )
    case 'table':
      return (
        <div className="space-y-4">
          {items.map((_, i) => <TableSkeleton key={i} />)}
        </div>
      )
    case 'list':
      return (
        <div className="space-y-4">
          {items.map((_, i) => <ListSkeleton key={i} />)}
        </div>
      )
    case 'chart':
      return (
        <div className={cn('grid gap-4', count > 1 ? 'grid-cols-1 lg:grid-cols-2' : '')}>
          {items.map((_, i) => <ChartSkeleton key={i} />)}
        </div>
      )
  }
}
