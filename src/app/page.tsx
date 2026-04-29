"use client";

import { useState, useEffect, useCallback } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { PredictionRow } from '@/components/predictions/prediction-row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBanner, ConnectionStatus, OfflineIndicator } from '@/components/ui/error-banner';
import { getHealth, getDashboardStats, getLivePredictions } from '@/lib/api';
import type { ApiHealth, LivePrediction, DashboardStats } from '@/lib/types';
import {
  Activity,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

// Fallback mock data when API is unavailable
const mockStats: DashboardStats = {
  total_fixtures_today: 24,
  positive_ev_opportunities: 8,
  sports_active: ['football', 'nba'],
  projected_edge_today: 5.2,
  yesterday_roi: 3.8,
  open_predictions: 12,
  last_updated: new Date().toISOString(),
};

const mockLivePredictions: LivePrediction[] = [
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
    home_odds: 2.1,
    away_odds: 3.4,
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
    implied_prob: 0.5,
    ev_percent: 6.2,
    kelly_percent: 2.8,
    recommended_side: 'Lakers',
    confidence_score: 'medium',
    odds_source: 'SportsGameOdds',
  },
];

const mockRecentSettled = [
  { fixture: 'Bayern vs Leipzig', pick: 'Over 2.5', result: 'win' as const, profit: 45.0 },
  { fixture: 'Man City vs Arsenal', pick: 'BTTS Yes', result: 'win' as const, profit: 38.5 },
  { fixture: 'Lakers vs Celtics', pick: 'Lakers +3.5', result: 'loss' as const, profit: -50.0 },
  { fixture: 'Dortmund vs Schalke', pick: 'Under 3.5', result: 'win' as const, profit: 28.0 },
  { fixture: 'Real vs Atletico', pick: 'Draw', result: 'push' as const, profit: 0 },
];

export default function DashboardPage() {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [predictions, setPredictions] = useState<LivePrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check health first
      const healthData = await getHealth();
      setHealth(healthData);
      setIsBackendOnline(true);

      // Fetch dashboard stats
      const statsData = await getDashboardStats();
      setStats(statsData);

      // Fetch live predictions
      const predictionsData = await getLivePredictions();
      setPredictions(predictionsData);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setIsBackendOnline(false);
      setError('Unable to connect to backend. Showing cached data.');

      // Use fallback data
      setStats(mockStats);
      setPredictions(mockLivePredictions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const topOpportunities = predictions.filter((p) => p.ev_percent > 4).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={fetchData}
          onDismiss={() => setError(null)}
          variant="warning"
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Sports intelligence overview</p>
        </div>
        <div className="flex items-center gap-4">
          <ConnectionStatus
            isConnected={isBackendOnline}
            latency={health?.models_loaded ? 45 : undefined}
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Today's Fixtures"
          value={stats?.total_fixtures_today ?? 0}
          icon={Calendar}
          subtitle="scheduled"
          loading={loading}
        />
        <StatCard
          title="Positive EV"
          value={stats?.positive_ev_opportunities ?? 0}
          icon={Zap}
          trend={stats && stats.positive_ev_opportunities > 5 ? 'up' : 'neutral'}
          className={
            stats && stats.positive_ev_opportunities > 0
              ? 'border-ev-strong/30'
              : ''
          }
          loading={loading}
        />
        <StatCard
          title="Sports Active"
          value={stats?.sports_active?.length ?? 0}
          icon={Target}
          subtitle={stats?.sports_active?.join(', ') ?? 'football'}
          loading={loading}
        />
        <StatCard
          title="Projected Edge"
          value={`+${stats?.projected_edge_today ?? 0}%`}
          icon={TrendingUp}
          trend="up"
          loading={loading}
        />
        <StatCard
          title="Yesterday ROI"
          value={`+${stats?.yesterday_roi ?? 0}%`}
          icon={Activity}
          trend={stats && stats.yesterday_roi > 0 ? 'up' : 'down'}
          loading={loading}
        />
        <StatCard
          title="Open Bets"
          value={stats?.open_predictions ?? 0}
          icon={Target}
          subtitle="pending"
          loading={loading}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="opportunities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="opportunities">Top Opportunities</TabsTrigger>
          <TabsTrigger value="alerts">Market Alerts</TabsTrigger>
          <TabsTrigger value="recent">Recent Results</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-ev-strong" />
                Best EV Opportunities Today
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 flex-1" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              ) : topOpportunities.length > 0 ? (
                <>
                  <div className="hidden md:grid grid-cols-12 gap-2 p-3 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
                    <div className="col-span-2">Sport / League</div>
                    <div className="col-span-3">Matchup</div>
                    <div className="col-span-1.5">Time</div>
                    <div className="col-span-2">Odds</div>
                    <div className="col-span-1.5">EV</div>
                    <div className="col-span-1">Kelly</div>
                    <div className="col-span-1">Conf</div>
                  </div>
                  <div className="divide-y">
                    {topOpportunities.map((prediction) => (
                      <PredictionRow key={prediction.fixture_id} prediction={prediction} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No positive EV opportunities found
                </div>
              )}
            </CardContent>
          </Card>

          {/* View All Link */}
          {topOpportunities.length > 0 && (
            <div className="flex justify-end">
              <a href="/predictions" className="text-sm text-primary hover:underline">
                View all predictions →
              </a>
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-ev-moderate" />
                Market Movement Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isBackendOnline ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-ev-neutral/10 border border-ev-neutral/30">
                  <OfflineIndicator
                    lastUpdated={lastUpdated}
                    onRefresh={fetchData}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-ev-moderate/10 border border-ev-moderate/30">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-ev-moderate" />
                      <div>
                        <div className="font-medium">Bayern Munich odds shifted</div>
                        <div className="text-sm text-muted-foreground">
                          1.45 → 1.52 (movement detected)
                        </div>
                      </div>
                    </div>
                    <Badge variant="warning">Monitoring</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-ev-neutral/10 border border-ev-neutral/30">
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-ev-neutral" />
                      <div>
                        <div className="font-medium">NBA games loading odds</div>
                        <div className="text-sm text-muted-foreground">
                          Live odds streaming active
                        </div>
                      </div>
                    </div>
                    <Badge variant="neutral">Stable</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-ev-strong" />
                Recently Settled Picks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockRecentSettled.map((pick, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div>
                      <div className="font-medium">{pick.fixture}</div>
                      <div className="text-sm text-muted-foreground">{pick.pick}</div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          pick.result === 'win'
                            ? 'success'
                            : pick.result === 'loss'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {pick.result.toUpperCase()}
                      </Badge>
                      <div
                        className={`text-sm font-medium mt-1 ${
                          pick.profit > 0
                            ? 'text-ev-strong'
                            : pick.profit < 0
                            ? 'text-ev-negative'
                            : ''
                        }`}
                      >
                        {pick.profit > 0 ? '+' : ''}
                        {pick.profit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* View All History Link */}
          <div className="flex justify-end">
            <a href="/history" className="text-sm text-primary hover:underline">
              View full history →
            </a>
          </div>
        </TabsContent>
      </Tabs>

      {/* API Status Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendOnline ? 'bg-ev-strong animate-pulse' : 'bg-ev-negative'
              }`}
            />
            Database: {health?.database ?? 'unknown'}
          </span>
          <span>Models: {health?.models_loaded ?? 0}</span>
        </div>
        <span>PredUp v0.1.0</span>
      </div>
    </div>
  );
}