"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getHealth } from '@/lib/api'
import type { ApiHealth } from '@/lib/types'
import { useEffect } from 'react'
import {
  Settings,
  Activity,
  Database,
  Cpu,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Save,
  Zap,
  Clock,
  TrendingUp,
} from 'lucide-react'

const mockHealth: ApiHealth = {
  status: 'healthy',
  service: 'predup',
  database: 'connected',
  models_loaded: 2,
}

const mockSettings = {
  enabledSports: {
    football: true,
    nba: true,
    mlb: false,
  },
  evThreshold: 4.0,
  kellyMultiplier: 0.25,
  autoRefreshInterval: 60,
  oddsSourcePriority: ['oddsapi', 'sportsgameodds', 'oddsportal'],
}

const mockApiStatus = [
  { name: 'The Odds API', status: 'connected', latency: 45, credits: 402 },
  { name: 'SportsGameOdds', status: 'degraded', latency: 250, notes: 'Intermittent timeouts' },
  { name: 'OddsPortal', status: 'connected', latency: 120, notes: 'Async only' },
]

const mockLeagueStatus = [
  { league: 'BL1 (Bundesliga)', status: 'production', threshold: 0.70, roi: '+5.2%' },
  { league: 'PL (Premier League)', status: 'production', threshold: 0.50, roi: '+3.8%' },
  { league: 'PD (La Liga)', status: 'testing', threshold: 0.35, roi: '+1.2%' },
  { league: 'SA (Serie A)', status: 'sandbox', threshold: 0.75, roi: '-2.1%' },
  { league: 'FL1 (Ligue 1)', status: 'paused', threshold: 0.75, roi: 'N/A' },
]

export default function SettingsPage() {
  const [health, setHealth] = useState<ApiHealth | null>(mockHealth)
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(mockSettings)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure predictions and monitor system health</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className={cn('h-4 w-4 mr-2', loading ? 'animate-spin' : '')} />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="sports">Sports & Leagues</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="health">API Health</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Prediction Settings
                </CardTitle>
                <CardDescription>Configure EV and Kelly sizing parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Minimum EV Threshold</div>
                    <div className="text-sm text-muted-foreground">Only show predictions above this EV%</div>
                  </div>
                  <Input
                    type="number"
                    value={settings.evThreshold}
                    onChange={(e) => setSettings({ ...settings, evThreshold: parseFloat(e.target.value) })}
                    className="w-20 text-right"
                    step="0.5"
                    min="0"
                    max="20"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Kelly Multiplier</div>
                    <div className="text-sm text-muted-foreground">Fraction of Kelly to use (0.25 = 1/4 Kelly)</div>
                  </div>
                  <Input
                    type="number"
                    value={settings.kellyMultiplier}
                    onChange={(e) => setSettings({ ...settings, kellyMultiplier: parseFloat(e.target.value) })}
                    className="w-20 text-right"
                    step="0.05"
                    min="0.1"
                    max="1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto Refresh Interval</div>
                    <div className="text-sm text-muted-foreground">Seconds between data refresh</div>
                  </div>
                  <Select
                    value={settings.autoRefreshInterval.toString()}
                    onValueChange={(v) => setSettings({ ...settings, autoRefreshInterval: parseInt(v) })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30s</SelectItem>
                      <SelectItem value="60">60s</SelectItem>
                      <SelectItem value="120">2min</SelectItem>
                      <SelectItem value="300">5min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Odds Source Priority
                </CardTitle>
                <CardDescription>Order of preference for odds data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {settings.oddsSourcePriority.map((source, index) => (
                  <div key={source} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                      {index + 1}
                    </div>
                    <span className="font-medium">{source}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sports & Leagues */}
        <TabsContent value="sports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enabled Sports</CardTitle>
              <CardDescription>Toggle sports for prediction generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.enabledSports).map(([sport, enabled]) => (
                <div key={sport} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {sport === 'football' ? '⚽' : sport === 'nba' ? '🏀' : '⚾'}
                    </div>
                    <div>
                      <div className="font-medium capitalize">{sport}</div>
                      <div className="text-sm text-muted-foreground">
                        {sport === 'football' ? 'Football, Soccer' : sport === 'nba' ? 'Basketball' : 'Baseball'}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      enabledSports: { ...settings.enabledSports, [sport]: checked }
                    })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">League Status</CardTitle>
              <CardDescription>Production status for each league</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLeagueStatus.map((league) => (
                  <div key={league.league} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{league.league}</div>
                      <div className="text-sm text-muted-foreground">
                        Threshold: {league.threshold} | ROI: {league.roi}
                      </div>
                    </div>
                    <Badge
                      variant={
                        league.status === 'production' ? 'success' :
                        league.status === 'testing' ? 'warning' :
                        league.status === 'sandbox' ? 'neutral' : 'secondary'
                      }
                    >
                      {league.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thresholds */}
        <TabsContent value="thresholds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Confidence Thresholds</CardTitle>
              <CardDescription>Configure when to accept/reject predictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">High Confidence Threshold</span>
                    <span className="text-muted-foreground">80%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-ev-strong" style={{ width: '80%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Medium Confidence Threshold</span>
                    <span className="text-muted-foreground">60%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-ev-moderate" style={{ width: '60%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Low Confidence Threshold</span>
                    <span className="text-muted-foreground">40%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-ev-neutral" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">EV Signal Strength</CardTitle>
              <CardDescription>Color coding for EV ranges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-ev-strong/10 rounded-lg border border-ev-strong/30">
                <span className="font-medium">Strong Signal</span>
                <span className="text-ev-strong">EV &gt; 8%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-ev-moderate/10 rounded-lg border border-ev-moderate/30">
                <span className="font-medium">Moderate Signal</span>
                <span className="text-ev-moderate">EV 4-8%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-ev-neutral/10 rounded-lg border border-ev-neutral/30">
                <span className="font-medium">Low Signal</span>
                <span className="text-ev-neutral">EV 1-4%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-ev-negative/10 rounded-lg border border-ev-negative/30">
                <span className="font-medium">Negative EV</span>
                <span className="text-ev-negative">EV &lt; 0%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Health */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">API Status</div>
                    <div className="text-2xl font-bold text-ev-strong flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Healthy
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Database</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <Database className="h-5 w-5 text-ev-strong" />
                      Connected
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Models Loaded</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-ev-moderate" />
                      {health?.models_loaded || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Odds API Status</CardTitle>
              <CardDescription>Real-time status of data sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockApiStatus.map((api) => (
                <div key={api.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">{api.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Latency: {api.latency}ms | {api.credits !== undefined ? `Credits: ${api.credits}` : api.notes}
                    </div>
                  </div>
                  <Badge
                    variant={api.status === 'connected' ? 'success' : 'warning'}
                  >
                    {api.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}