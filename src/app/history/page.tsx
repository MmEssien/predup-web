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

import { getHistoricalPicks } from '@/lib/api'
import { ErrorBanner } from '@/components/ui/error-banner'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect } from 'react'

type FilterOption = 'all' | 'win' | 'loss' | 'push'
type SortOption = 'date' | 'profit' | 'ev' | 'odds'

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [resultFilter, setResultFilter] = useState<FilterOption>('all')
  const [sortBy, setSortBy] = useState<SortOption>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [history, setHistory] = useState<HistoricalPick[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistoricalPicks()
      setHistory(data)
    } catch (err) {
      setError('Backend connection failed. Could not load history.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredHistory = useMemo(() => {
    let result = [...history]

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
  }, [history, search, sportFilter, resultFilter, sortBy, sortOrder])

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
            {history.length} picks • Profit: {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
          </p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <ArrowUpDown className={cn('h-4 w-4 mr-2', loading ? 'animate-spin' : undefined)} />
          Refresh
        </Button>
      </div>

      {error && (
        <ErrorBanner
          message={error}
          onRetry={fetchData}
          onDismiss={() => setError(null)}
          variant="error"
        />
      )}

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
              {loading && history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex justify-center"><Skeleton className="h-8 w-full max-w-sm" /></div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((pick) => (
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
                ))
              )}
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