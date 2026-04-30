"use client"

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PredictionRow } from '@/components/predictions/prediction-row'
import { cn, getEvColor, getLeagueLabel, getSportIcon } from '@/lib/utils'
import type { LivePrediction } from '@/lib/types'
import { Search, Filter, ArrowUpDown, RefreshCw, TrendingUp } from 'lucide-react'

import { getLivePredictions, getHealth } from '@/lib/api'
import { ErrorBanner, ConnectionStatus } from '@/components/ui/error-banner'
import { Skeleton } from '@/components/ui/skeleton'

type SortOption = 'ev' | 'kelly' | 'time' | 'confidence'
type FilterOption = 'all' | 'high' | 'medium' | 'low'

export default function PredictionsPage() {
  const [search, setSearch] = useState('')
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [leagueFilter, setLeagueFilter] = useState<string>('all')
  const [confidenceFilter, setConfidenceFilter] = useState<FilterOption>('all')
  const [sortBy, setSortBy] = useState<SortOption>('ev')
  const [predictions, setPredictions] = useState<LivePrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBackendOnline, setIsBackendOnline] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [visibleCount, setVisibleCount] = useState(10)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      await getHealth()
      setIsBackendOnline(true)
      
      const data = await getLivePredictions()
      setPredictions(data)
      setLastUpdated(new Date())
    } catch (err) {
      setIsBackendOnline(false)
      setError('Backend connection failed. Please check backend status.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 minutes
    const interval = setInterval(() => {
      fetchData()
    }, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredPredictions = useMemo(() => {
    let result = [...predictions]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(p =>
        p.home_team.toLowerCase().includes(searchLower) ||
        p.away_team.toLowerCase().includes(searchLower)
      )
    }

// Sport filter
  if (sportFilter !== 'all') {
    result = result.filter(p => p.sport === sportFilter)
  }

  // Reset visible count when filters change
  if (sportFilter !== 'all' || leagueFilter !== 'all' || confidenceFilter !== 'all' || search) {
    setVisibleCount(10)
  }

  // League filter
    if (leagueFilter !== 'all') {
      result = result.filter(p => p.league === leagueFilter)
    }

    // Confidence filter
    if (confidenceFilter !== 'all') {
      result = result.filter(p => p.confidence_score === confidenceFilter)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'ev':
          return b.ev_percent - a.ev_percent
        case 'kelly':
          return b.kelly_percent - a.kelly_percent
        case 'time':
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        case 'confidence':
          const confOrder = { high: 3, medium: 2, low: 1 }
          return confOrder[b.confidence_score] - confOrder[a.confidence_score]
        default:
          return 0
      }
    })

    return result
  }, [predictions, search, sportFilter, leagueFilter, confidenceFilter, sortBy])

  const handleRefresh = async () => {
    await fetchData()
  }

  const positiveEvCount = predictions.filter(p => p.ev_percent > 0).length
  const strongEvCount = predictions.filter(p => p.ev_percent > 4).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Predictions</h1>
          <p className="text-muted-foreground">
            {positiveEvCount} positive EV • {strongEvCount} strong signals
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <ConnectionStatus isConnected={isBackendOnline} />
          <div className="text-sm text-muted-foreground">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4 mr-2', loading ? 'animate-spin' : undefined)} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <ErrorBanner
          message={error}
          onRetry={handleRefresh}
          onDismiss={() => setError(null)}
          variant="warning"
        />
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sport Filter */}
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="nba">NBA</SelectItem>
                <SelectItem value="mlb">MLB</SelectItem>
              </SelectContent>
            </Select>

            {/* League Filter */}
            <Select value={leagueFilter} onValueChange={setLeagueFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="League" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leagues</SelectItem>
                <SelectItem value="BL1">Bundesliga</SelectItem>
                <SelectItem value="PL">Premier League</SelectItem>
                <SelectItem value="PD">La Liga</SelectItem>
                <SelectItem value="SA">Serie A</SelectItem>
                <SelectItem value="FL1">Ligue 1</SelectItem>
                <SelectItem value="NBA">NBA</SelectItem>
                <SelectItem value="MLB">MLB</SelectItem>
              </SelectContent>
            </Select>

            {/* Confidence Filter */}
            <Select value={confidenceFilter} onValueChange={(v) => setConfidenceFilter(v as FilterOption)}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ev">Sort by EV</SelectItem>
                <SelectItem value="kelly">Sort by Kelly</SelectItem>
                <SelectItem value="time">Sort by Time</SelectItem>
                <SelectItem value="confidence">Sort by Confidence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-ev-strong/20 border border-ev-strong/40" />
          <span>EV &gt; 8% (Strong)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-ev-moderate/20 border border-ev-moderate/40" />
          <span>EV 4-8% (Moderate)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-ev-neutral/20 border border-ev-neutral/40" />
          <span>EV &lt; 4% (Low)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-ev-negative/20 border border-ev-negative/40" />
          <span>Negative EV</span>
        </div>
      </div>

      {/* Predictions Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Predictions ({filteredPredictions.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-2 p-3 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
            <div className="col-span-2">Sport / League</div>
            <div className="col-span-3">Matchup</div>
            <div className="col-span-1.5">Time</div>
            <div className="col-span-2">Odds</div>
            <div className="col-span-1.5 text-center">EV</div>
            <div className="col-span-1 text-center">Kelly</div>
            <div className="col-span-1 text-center">Conf</div>
          </div>

          {/* Table Body */}
          <div className="divide-y">
            {loading && predictions.length === 0 ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredPredictions.slice(0, visibleCount).map((prediction) => (
                  <PredictionRow key={prediction.fixture_id} prediction={prediction} />
                ))}
                
                {/* Show More Button */}
                {visibleCount < filteredPredictions.length && (
                  <div className="flex justify-center p-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setVisibleCount(v => Math.min(v + 10, filteredPredictions.length))}
                      className="w-full max-w-xs"
                    >
                      Show More ({filteredPredictions.length - visibleCount} remaining)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {filteredPredictions.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No predictions match your filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}