import { Badge } from '@/components/ui/badge'
import { cn, getEvColor, getConfidenceColor, getLeagueLabel, getSportIcon } from '@/lib/utils'
import type { LivePrediction } from '@/lib/types'
import { TrendingUp, Clock } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import Link from 'next/link'

interface PredictionRowProps {
  prediction: LivePrediction
}

export function PredictionRow({ prediction }: PredictionRowProps) {
  const evClass = getEvColor(prediction.ev_percent)
  const confBadgeClass = getConfidenceColor(prediction.confidence_score)

  return (
    <Link
      href={`/fixtures/${prediction.fixture_id}`}
      className="block hover:bg-muted/30 transition-colors rounded-lg"
    >
      <div className="grid grid-cols-12 gap-2 p-3 items-center text-sm border-b last:border-0">
        {/* Sport & League */}
        <div className="col-span-2 flex items-center gap-1.5">
          <span className="text-lg">{getSportIcon(prediction.sport || '')}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {getLeagueLabel(prediction.league || '')}
          </span>
        </div>

        {/* Matchup */}
        <div className="col-span-3 font-medium">
          <div className="truncate">{prediction.home_team}</div>
          <div className="text-xs text-muted-foreground truncate">{prediction.away_team}</div>
        </div>

        {/* Start Time / Status */}
        <div className="col-span-1.5 flex flex-col items-start gap-1">
          {prediction.status === 'LIVE' || prediction.status === 'IN_PLAY' || prediction.status === '1H' || prediction.status === '2H' ? (
            <Badge variant="success" className="animate-pulse py-0 px-1 text-[10px]">LIVE</Badge>
          ) : new Date(prediction.start_time).toDateString() === new Date().toDateString() ? (
            <Badge variant="warning" className="py-0 px-1 text-[10px]">TODAY</Badge>
          ) : (
            <Badge variant="outline" className="py-0 px-1 text-[10px]">UPCOMING</Badge>
          )}
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(prediction.start_time)}
          </div>
        </div>

        {/* Odds */}
        <div className="col-span-2 flex gap-2 text-xs">
          <span className={prediction.recommended_side === prediction.home_team ? 'font-bold text-ev-strong' : 'text-muted-foreground'}>
            {prediction.home_odds.toFixed(2)}
          </span>
          <span className={prediction.recommended_side === prediction.away_team ? 'font-bold text-ev-strong' : 'text-muted-foreground'}>
            {prediction.away_odds.toFixed(2)}
          </span>
        </div>

        {/* EV */}
        <div className="col-span-1.5 text-center">
          <span className={cn('font-bold text-sm', evClass)}>
            {prediction.ev_percent > 0 ? '+' : ''}{prediction.ev_percent.toFixed(1)}%
          </span>
        </div>

        {/* Kelly */}
        <div className="col-span-1 text-center text-xs text-muted-foreground hidden md:inline">
          {prediction.kelly_percent.toFixed(1)}%
        </div>

        {/* Confidence */}
        <div className="col-span-1 text-center">
          <Badge className={cn('text-xs px-1.5 py-0.5', confBadgeClass)}>
            {prediction.confidence_score}
          </Badge>
        </div>

        {/* Source */}
        <div className="col-span-1 text-xs text-muted-foreground text-right hidden lg:inline">
          {prediction.odds_source}
        </div>
      </div>
    </Link>
  )
}