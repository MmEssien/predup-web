"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Calendar, ArrowUpDown, Download, Filter } from 'lucide-react'
import { cn, formatDate, formatCurrency, getLeagueLabel, getSportIcon } from '@/lib/utils'
import type { HistoricalPick } from '@/lib/types'

// Mock historical data
const mockHistory: HistoricalPick[] = [
  {
    fixture_id: 1,
    fixture: { id: 1, external_id: 1, date: '2026-04-28T15:00:00Z', home_team: 'Bayern Munich', away_team: 'Dortmund', status: 'FINISHED', home_score: 3, away_score: 1 },
    sport: 'football',
    league: 'BL1',
    predicted_value: 'Over 2.5',
    probability: 0.68,
    confidence: 'high',
    is_accepted: true,
    ev: 8.5,
    kelly_pct: 3.2,
    odds_taken: 1.85,
    closing_odds: 1.90,
    result: 'win',
    profit: 42.50,
    clv: 5.0,
    clv_percent: 2.7,
    created_at: '2026-04-28T10:00:00Z',
    settled_at: '2026-04-28T17:30:00Z',
  },
  {
    fixture_id: 2,
    fixture: { id: 2, external_id: 2, date: '2026-04-27T20:00:00Z', home_team: 'Manchester City', away_team: 'Arsenal', status: 'FINISHED', home_score: 1, away_score: 1 },
    sport: 'football',
    league: 'PL',
    predicted_value: 'BTTS Yes',
    probability: 0.58,
    confidence: 'medium',
    is_accepted: true,
    ev: 4.2,
    kelly_pct: 1.8,
    odds_taken: 1.75,
    closing_odds: 1.72,
    result: 'win',
    profit: 37.50,
    clv: -1.7,
    clv_percent: -1.0,
    created_at: '2026-04-27T14:00:00Z',
    settled_at: '2026-04-27T22:00:00Z',
  },
  {
    fixture_id: 3,
    fixture: { id: 3, external_id: 3, date: '2026-04-27T02:30:00Z', home_team: 'Lakers', away_team: 'Warriors', status: 'FINISHED', home_score: 112, away_score: 108 },
    sport: 'nba',
    league: 'NBA',
    predicted_value: 'Lakers +3.5',
    probability: 0.62,
    confidence: 'high',
    is_accepted: true,
    ev: 6.8,
    kelly_pct: 2.5,
    odds_taken: 1.90,
    closing_odds: 1.88,
    result: 'win',
    profit: 45.00,
    clv: -2.1,
    clv_percent: -1.1,
    created_at: '2026-04-26T22:00:00Z',
    settled_at: '2026-04-27T04:30:00Z',
  },
  {
    fixture_id: 4,
    fixture: { id: 4, external_id: 4, date: '2026-04-26T19:00:00Z', home_team: 'Real Madrid', away_team: 'Barcelona', status: 'FINISHED', home_score: 2, away_score: 3 },
    sport: 'football',
    league: 'PD',
    predicted_value: 'Real Madrid ML',
    probability: 0.48,
    confidence: 'low',
    is_accepted: true,
    ev: 3.5,
    kelly_pct: 1.2,
    odds_taken: 2.50,
    closing_odds: 2.45,
    result: 'loss',
    profit: -50.00,
    clv: -2.0,
    clv_percent: -0.8,
    created_at: '2026-04-26T12:00:00Z',
    settled_at: '2026-04-26T21:30:00Z',
  },
  {
    fixture_id: 5,
    fixture: { id: 5, external_id: 5, date: '2026-04-25T18:00:00Z', home_team: 'Dortmund', away_team: 'Schalke', status: 'FINISHED', home_score: 2, away_score: 2 },
    sport: 'football',
    league: 'BL1',
    predicted_value: 'Under 3.5',
    probability: 0.55,
    confidence: 'medium',
    is_accepted: true,
    ev: 5.2,
    kelly_pct: 2.0,
    odds_taken: 1.80,
    closing_odds: 1.85,
    result: 'push',
    profit: 0,
    clv: 2.8,
    clv_percent: 1.5,
    created_at: '2026-04-25T12:00:00Z',
    settled_at: '2026-04-25T20:00:00Z',
  },
  {
    fixture_id: 6,
    fixture: { id: 6, external_id: 6, date: '2026-04-24T23:00:00Z', home_team: 'Yankees', away_team: 'Red Sox', status: 'FINISHED', home_score: 5, away_score: 3 },
    sport: 'mlb',
    league: 'MLB',
    predicted_value: 'Yankees -1.5',
    probability: 0.54,
    confidence: 'low',
    is_accepted: true,
    ev: 2.8,
    kelly_pct: 1.0,
    odds_taken: 1.85,
    closing_odds: 1.90,
    result: 'loss',
    profit: -50.00,
    clv: 2.7,
    clv_percent: 1.5,
    created_at: '2026-04-24T18:00:00Z',
    settled_at: '2026-04-25T02:00:00Z',
  },
  {
    fixture_id: 7,
    fixture: { id: 7, external_id: 7, date: '2026-04-23T19:00:00Z', home_team: 'Inter', away_team: 'Milan', status: 'FINISHED', home_score: 1, away_score: 0 },
    sport: 'football',
    league: 'SA',
    predicted_value: 'Inter ML',
    probability: 0.52,
    confidence: 'medium',
    is_accepted: true,
    ev: 4.5,
    kelly_pct: 1.6,
    odds_taken: 2.80,
    closing_odds: 2.75,
    result: 'win',
    profit: 90.00,
    clv: -1.8,
    clv_percent: -0.6,
    created_at: '2026-04-23T12:00:00Z',
    settled_at: '2026-04-23T21:00:00Z',
  },
  {
    fixture_id: 8,
    fixture: { id: 8, external_id: 8, date: '2026-04-22T01:00:00Z', home_team: 'Celtics', away_team: 'Heat', status: 'FINISHED', home_score: 98, away_score: 95 },
    sport: 'nba',
    league: 'NBA',
    predicted_value: 'Celtics -5.5',
    probability: 0.60,
    confidence: 'high',
    is_accepted: true,
    ev: 7.2,
    kelly_pct: 2.8,
    odds_taken: 1.90,
    closing_odds: 1.92,
    result: 'win',
    profit: 45.00,
    clv: 1.1,
    clv_percent: 0.6,
    created_at: '2026-04-21T20:00:00Z',
    settled_at: '2026-04-22T03:00:00Z',
  },
]

type FilterOption = 'all' | 'win' | 'loss' | 'push'
type SortOption = 'date' | 'profit' | 'ev' | 'odds'

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [resultFilter, setResultFilter] = useState<FilterOption>('all')
  const [sortBy, setSortBy] = useState<SortOption>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredHistory = useMemo(() => {
    let result = [...mockHistory]

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(p =>
        p.fixture?.home_team?.toLowerCase().includes(searchLower) ||
        p.fixture?.away_team?.toLowerCase().includes(searchLower) ||
        p.predicted_value?.toLowerCase().includes(searchLower)
      )
    }

    if (sportFilter !== 'all') {
      result = result.filter(p => p.sport === sportFilter)
    }

    if (resultFilter !== 'all') {
      result = result.filter(p => p.result === resultFilter)
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.fixture?.date || 0).getTime() - new Date(b.fixture?.date || 0).getTime()
          break
        case 'profit':
          comparison = (a.profit || 0) - (b.profit || 0)
          break
        case 'ev':
          comparison = (a.ev || 0) - (b.ev || 0)
          break
        case 'odds':
          comparison = (a.odds_taken || 0) - (b.odds_taken || 0)
          break
      }
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return result
  }, [search, sportFilter, resultFilter, sortBy, sortOrder])

  const totalProfit = filteredHistory.reduce((sum, p) => sum + (p.profit || 0), 0)
  const winCount = filteredHistory.filter(p => p.result === 'win').length
  const lossCount = filteredHistory.filter(p => p.result === 'loss').length
  const pushCount = filteredHistory.filter(p => p.result === 'push').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historical Picks</h1>
          <p className="text-muted-foreground">
            {mockHistory.length} picks • Profit: {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={cn('text-2xl font-bold', totalProfit >= 0 ? 'text-ev-strong' : 'text-ev-negative')}>
                {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total Profit</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-ev-strong">{winCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Wins</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-ev-negative">{lossCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Losses</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-ev-neutral">{pushCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Pushes</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams or picks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

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

            <Select value={resultFilter} onValueChange={(v) => setResultFilter(v as FilterOption)}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="win">Wins</SelectItem>
                <SelectItem value="loss">Losses</SelectItem>
                <SelectItem value="push">Pushes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="profit">Profit</SelectItem>
                <SelectItem value="ev">EV</SelectItem>
                <SelectItem value="odds">Odds</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className={cn('h-4 w-4', sortOrder === 'desc' && 'rotate-180')} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Fixture</TableHead>
                <TableHead>Pick</TableHead>
                <TableHead className="text-right">Odds</TableHead>
                <TableHead className="text-right">Closing</TableHead>
                <TableHead className="text-center">Result</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">EV</TableHead>
                <TableHead className="text-right">CLV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((pick) => (
                <TableRow key={pick.fixture_id}>
                  <TableCell className="text-muted-foreground">
                    {pick.fixture ? formatDate(pick.fixture.date) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {pick.fixture?.home_team} vs {pick.fixture?.away_team}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>{getSportIcon(pick.sport || '')}</span>
                      <span>{getLeagueLabel(pick.league || '')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{pick.predicted_value}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {pick.odds_taken?.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {pick.closing_odds?.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        pick.result === 'win' ? 'success' :
                        pick.result === 'loss' ? 'danger' : 'neutral'
                      }
                    >
                      {pick.result?.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn(
                    'text-right font-medium',
                    pick.profit && pick.profit > 0 ? 'text-ev-strong' :
                    pick.profit && pick.profit < 0 ? 'text-ev-negative' : ''
                  )}>
                    {pick.profit && pick.profit !== 0 ? `${pick.profit > 0 ? '+' : ''}${pick.profit.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      pick.ev && pick.ev > 0 ? 'text-ev-strong' :
                      pick.ev && pick.ev < 0 ? 'text-ev-negative' : ''
                    )}>
                      {pick.ev ? `${pick.ev > 0 ? '+' : ''}${pick.ev.toFixed(1)}%` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {pick.clv !== undefined ? `${pick.clv > 0 ? '+' : ''}${pick.clv.toFixed(1)}%` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredHistory.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No historical picks found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}