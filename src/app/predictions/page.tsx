"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PredictionRow } from '@/components/predictions/prediction-row'
import { cn, getEvColor, getLeagueLabel, getSportIcon } from '@/lib/utils'
import type { LivePrediction } from '@/lib/types'
import { Search, Filter, ArrowUpDown, RefreshCw, TrendingUp } from 'lucide-react'

// Extended mock data
const mockPredictions: LivePrediction[] = [
  {
    fixture_id: 1,
    sport: 'football',
    league: 'BL1',
    home_team: 'Bayern Munich',
    away_team: 'Dortmund',
    start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    home_odds: 1.45,
    away_odds: 2.85,
    model_probability: 0.68,
    implied_prob: 0.58,
    ev_percent: 10.2,
    kelly_percent: 4.2,
    recommended_side: 'Bayern Munich',
    confidence_score: 'high',
    odds_source: 'The Odds API',
  },
  {
    fixture_id: 2,
    sport: 'football',
    league: 'PL',
    home_team: 'Manchester City',
    away_team: 'Liverpool',
    start_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    home_odds: 2.10,
    away_odds: 3.40,
    model_probability: 0.52,
    implied_prob: 0.48,
    ev_percent: 5.8,
    kelly_percent: 2.1,
    recommended_side: 'Manchester City',
    confidence_score: 'medium',
    odds_source: 'The Odds API',
  },
  {
    fixture_id: 3,
    sport: 'nba',
    league: 'NBA',
    home_team: 'Lakers',
    away_team: 'Warriors',
    start_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    home_odds: 1.95,
    away_odds: 1.95,
    model_probability: 0.55,
    implied_prob: 0.50,
    ev_percent: 6.2,
    kelly_percent: 2.8,
    recommended_side: 'Lakers',
    confidence_score: 'medium',
    odds_source: 'SportsGameOdds',
  },
  {
    fixture_id: 4,
    sport: 'football',
    league: 'PD',
    home_team: 'Real Madrid',
    away_team: 'Barcelona',
    start_time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    home_odds: 2.50,
    away_odds: 2.75,
    model_probability: 0.48,
    implied_prob: 0.44,
    ev_percent: 4.1,
    kelly_percent: 1.5,
    recommended_side: 'Real Madrid',
    confidence_score: 'low',
    odds_source: 'The Odds API',
  },
  {
    fixture_id: 5,
    sport: 'football',
    league: 'PL',
    home_team: 'Arsenal',
    away_team: 'Chelsea',
    start_time: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    home_odds: 1.75,
    away_odds: 4.50,
    model_probability: 0.60,
    implied_prob: 0.55,
    ev_percent: 7.3,
    kelly_percent: 3.1,
    recommended_side: 'Arsenal',
    confidence_score: 'high',
    odds_source: 'The Odds API',
  },
  {
    fixture_id: 6,
    sport: 'mlb',
    league: 'MLB',
    home_team: 'Yankees',
    away_team: 'Red Sox',
    start_time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    home_odds: 1.65,
    away_odds: 2.30,
    model_probability: 0.62,
    implied_prob: 0.58,
    ev_percent: 5.5,
    kelly_percent: 2.0,
    recommended_side: 'Yankees',
    confidence_score: 'medium',
    odds_source: 'The Odds API',
  },
  {
    fixture_id: 7,
    sport: 'football',
    league: 'SA',
    home_team: 'Juventus',
    away_team: 'Inter',
    start_time: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
    home_odds: 2.80,
    away_odds: 2.60,
    model_probability: 0.46,
    implied_prob: 0.42,
    ev_percent: 3.2,
    kelly_percent: 1.2,
    recommended_side: 'Inter',
    confidence_score: 'low',
    odds_source: 'The Odds API',
  },
  {
    fixture_id: 8,
    sport: 'nba',
    league: 'NBA',
    home_team: 'Celtics',
    away_team: 'Heat',
    start_time: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
    home_odds: 1.40,
    away_odds: 3.00,
    model_probability: 0.72,
    implied_prob: 0.65,
    ev_percent: 8.4,
    kelly_percent: 3.8,
    recommended_side: 'Celtics',
    confidence_score: 'high',
    odds_source: 'The Odds API',
  },
  {
    fixture_id: 9,
    sport: 'football',
    league: 'FL1',
    home_team: 'PSG',
    away_team: 'Marseille',
    start_time: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    home_odds: 1.55,
    away_odds: 2.60,
    model_probability: 0.65,
    implied_prob: 0.60,
    ev_percent: 6.1,
    kelly_percent: 2.5,
    recommended_side: 'PSG',
    confidence_score: 'medium',
    odds_source: 'The Odds API',
  },
  {
    fixture_id: 10,
    sport: 'mlb',
    league: 'MLB',
    home_team: 'Dodgers',
    away_team: 'Giants',
    start_time: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    home_odds: 1.70,
    away_odds: 2.20,
    model_probability: 0.58,
    implied_prob: 0.52,
    ev_percent: 4.8,
    kelly_percent: 1.8,
    recommended_side: 'Dodgers',
    confidence_score: 'medium',
    odds_source: 'The Odds API',
  },
]

type SortOption = 'ev' | 'kelly' | 'time' | 'confidence'
type FilterOption = 'all' | 'high' | 'medium' | 'low'

export default function PredictionsPage() {
  const [search, setSearch] = useState('')
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [leagueFilter, setLeagueFilter] = useState<string>('all')
  const [confidenceFilter, setConfidenceFilter] = useState<FilterOption>('all')
  const [sortBy, setSortBy] = useState<SortOption>('ev')
  const [refreshing, setRefreshing] = useState(false)

  const filteredPredictions = useMemo(() => {
    let result = [...mockPredictions]

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
  }, [search, sportFilter, leagueFilter, confidenceFilter, sortBy])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const positiveEvCount = mockPredictions.filter(p => p.ev_percent > 0).length
  const strongEvCount = mockPredictions.filter(p => p.ev_percent > 4).length

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
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

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
            {filteredPredictions.map((prediction) => (
              <PredictionRow key={prediction.fixture_id} prediction={prediction} />
            ))}
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