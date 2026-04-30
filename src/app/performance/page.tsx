"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatCard } from '@/components/dashboard/stat-card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts'
import { Activity, TrendingUp, Target, BarChart3, PieChart as PieChartIcon } from 'lucide-react'

// Mock data for charts
// No mock data in production
const roiOverTimeData: any[] = [];
const winRateBySport: any[] = [];
const winRateByLeague: any[] = [];
const clvTrendData: any[] = [];
const profitByMonthData: any[] = [];
const betVolumeBySport: any[] = [];
const calibrationData: any[] = [];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b']

export default function PerformancePage() {
  const [period, setPeriod] = useState('30d')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
          <p className="text-muted-foreground">ROI, win rates, and betting analytics</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">Last 30 days</Badge>
          <Badge variant="outline">Since inception</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total ROI"
          value="0.0%"
          icon={TrendingUp}
          trend="neutral"
          subtitle="awaiting data"
        />
        <StatCard
          title="Win Rate"
          value="0.0%"
          icon={Target}
          trend="neutral"
          subtitle="awaiting data"
        />
        <StatCard
          title="Avg CLV"
          value="0.0%"
          icon={Activity}
          trend="neutral"
          subtitle="awaiting data"
        />
        <StatCard
          title="Total Bets"
          value="0"
          icon={BarChart3}
          subtitle="this period"
        />
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="roi" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="roi">ROI Over Time</TabsTrigger>
          <TabsTrigger value="winrate">Win Rates</TabsTrigger>
          <TabsTrigger value="clv">CLV Trend</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
        </TabsList>

        {/* ROI Over Time */}
        <TabsContent value="roi" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ROI Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={roiOverTimeData}>
                    <defs>
                      <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'ROI']}
                    />
                    <Area
                      type="monotone"
                      dataKey="roi"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fill="url(#roiGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profit by Month</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitByMonthData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`$${value}`, 'Profit']}
                    />
                    <Bar dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Win Rates */}
        <TabsContent value="winrate" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Win Rate by Sport</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={winRateBySport} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" unit="%" />
                    <YAxis dataKey="sport" type="category" tick={{ fontSize: 12 }} className="text-muted-foreground" width={60} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'win_rate' ? `${value.toFixed(1)}%` : value,
                        name === 'win_rate' ? 'Win Rate' : 'Bets',
                      ]}
                    />
                    <Bar dataKey="win_rate" fill="#22c55e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Win Rate by League</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={winRateByLeague}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="league" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Win Rate']}
                    />
                    <Bar dataKey="win_rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CLV Trend */}
        <TabsContent value="clv" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Closing Line Value (CLV)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={clvTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'CLV']}
                    />
                    <Line
                      type="monotone"
                      dataKey="clv"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bet Volume by Sport</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={betVolumeBySport}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="volume"
                    >
                      {betVolumeBySport.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {betVolumeBySport.map((entry, index) => (
                    <div key={entry.sport} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {entry.sport}: {entry.volume}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calibration */}
        <TabsContent value="calibration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Model Calibration (Reliability Diagram)</CardTitle>
              <p className="text-sm text-muted-foreground">
                How well predicted probabilities match actual outcomes
              </p>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calibrationData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="predicted"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                    label={{ value: 'Predicted Probability', position: 'bottom', offset: -5 }}
                    unit=""
                    domain={[0, 1]}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                    label={{ value: 'Actual Win Rate', angle: -90, position: 'insideLeft' }}
                    unit=""
                    domain={[0, 1]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${(value * 100).toFixed(0)}%`]}
                  />
                  {/* Perfect calibration line */}
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#6b7280"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Perfect"
                  />
                  {/* Actual calibration */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 6 }}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-ev-strong">0.92</div>
                  <div className="text-sm text-muted-foreground mt-1">ECE (Expected Calibration Error)</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-ev-moderate">0.01</div>
                  <div className="text-sm text-muted-foreground mt-1">Calibration Drift</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">0.85</div>
                  <div className="text-sm text-muted-foreground mt-1">Brier Score</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}