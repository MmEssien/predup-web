// Core types for PredUp frontend

export type Sport = 'football' | 'nba' | 'mlb';

export type Confidence = 'high' | 'medium' | 'low';

export type LeagueCode = 'BL1' | 'PL' | 'PD' | 'SA' | 'FL1' | 'ELC' | 'ECD' | 'NBA' | 'MLB';

export interface Team {
  id: number;
  name: string;
  short_name?: string;
  tla?: string;
  crest_url?: string;
}

export interface Fixture {
  id: number;
  external_id: number;
  competition?: Competition;
  date: string;
  home_team: string;
  away_team: string;
  venue?: string;
  status: 'SCHEDULED' | 'FINISHED' | 'LIVE';
  home_score?: number;
  away_score?: number;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  area_name?: string;
}

export interface Prediction {
  id?: number;
  fixture_id: number;
  fixture?: Fixture;
  sport?: Sport;
  league?: LeagueCode;
  predicted_value?: string;
  probability?: number;
  confidence?: Confidence;
  is_accepted?: boolean;
  ev?: number;
  kelly_pct?: number;
  odds_home?: number;
  odds_away?: number;
  odds_taken?: number;
  closing_odds?: number;
  implied_probability?: number;
  edge_pct?: number;
  source?: string;
  created_at?: string;
}

export interface LivePrediction extends Prediction {
  home_team: string;
  away_team: string;
  start_time: string;
  status: string;
  matchup?: string;
  home_odds: number;
  away_odds: number;
  model_probability: number;
  implied_prob: number;
  ev_percent: number;
  kelly_percent: number;
  recommended_side: string;
  confidence_score: Confidence;
  odds_source: string;
}

export interface HistoricalPick extends Prediction {
  settled_at?: string;
  result?: 'win' | 'loss' | 'push';
  profit?: number;
  clv?: number;
  clv_percent?: number;
  calibration_drift?: number;
}

export interface DashboardStats {
  total_fixtures_today: number;
  positive_ev_opportunities: number;
  sports_active: string[];
  projected_edge_today: number;
  yesterday_roi: number;
  open_predictions: number;
  last_updated: string;
  pipeline_status?: string;
  next_run?: string;
  error?: string;
}

export interface HealthReport {
  report_date: string;
  total_bets: number;
  total_roi: number;
  bl1_roi: number;
  bl1_bets: number;
  pl_roi: number;
  pl_bets: number;
  calibration_ece: number;
  calibration_drift: number;
  max_drawdown_pct: number;
  recommendation: string;
  recommendation_reason: string;
  recent_reports: HealthReport[];
}

export interface PerformanceMetrics {
  roi_over_time: { date: string; roi: number }[];
  win_rate_by_sport: { sport: string; win_rate: number; bets: number }[];
  win_rate_by_league: { league: string; win_rate: number; bets: number }[];
  clv_trend: { date: string; clv: number }[];
  profit_by_month: { month: string; profit: number }[];
  bet_volume_by_sport: { sport: string; volume: number }[];
  calibration_data: { predicted: number; actual: number }[];
}

export interface FixtureDetail {
  fixture: Fixture;
  odds: {
    home: number;
    draw?: number;
    away: number;
    sources: { name: string; home: number; away: number; updated: string }[];
  };
  prediction: Prediction;
  edge_explanation: string;
  kelly_stake: number;
  recent_form: { home: string[]; away: string[] };
  injuries: { team: string; players: { name: string; severity: string }[] }[];
  lineup_status: { home: string; away: string };
  confidence_score: number;
  market_movement: { time: string; odds: number }[];
}

export interface Settings {
  enabled_sports: Sport[];
  ev_threshold: number;
  kelly_multiplier: number;
  auto_refresh_interval: number;
  api_health: { status: string; latency_ms: number };
  odds_source_priority: string[];
}

export interface ApiHealth {
  status: string;
  service: string;
  database: string;
  models_loaded: number;
}

export interface UpcomingMatch {
  fixture_id: number;
  external_id: number;
  competition?: string;
  date: string;
  home_team: string;
  away_team: string;
  venue?: string;
}