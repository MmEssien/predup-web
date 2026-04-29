import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
  loading?: boolean
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, className, loading }: StatCardProps) {
  const trendColors = {
    up: 'text-ev-strong',
    down: 'text-ev-negative',
    neutral: 'text-muted-foreground',
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 bg-muted rounded animate-pulse" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {(subtitle || trendValue) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                {subtitle && <span>{subtitle}</span>}
                {trendValue && trend && (
                  <span className={trendColors[trend]}>{trendValue}</span>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}