import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import type {
  DashboardStats,
  HealthReport,
  LivePrediction,
  HistoricalPick,
  PerformanceMetrics,
  FixtureDetail,
  Settings,
  ApiHealth,
  UpcomingMatch,
  Prediction,
} from './types';

// Get API URL from environment, with fallback for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Configuration constants
const REQUEST_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };

    // If no config, reject immediately
    if (!config) {
      return Promise.reject(error);
    }

    // Check if it's a network error (no response)
    const isNetworkError = !error.response;
    const isTimeoutError = error.code === 'ECONNABORTED';

    // Retry logic for network errors or timeouts (up to MAX_RETRIES)
    if (isNetworkError || isTimeoutError) {
      config._retryCount = (config._retryCount || 0) + 1;

      if (config._retryCount < MAX_RETRIES) {
        console.log(`[API] Retry attempt ${config._retryCount}/${MAX_RETRIES} for ${config.url}`);

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * config._retryCount));

        return api(config);
      }
    }

    // Log error details
    if (error.response) {
      console.error(`[API] Error ${error.response.status}: ${error.response.statusText}`);
    } else if (isNetworkError) {
      console.error('[API] Network error - backend may be offline');
    } else if (isTimeoutError) {
      console.error('[API] Request timeout');
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'Request timeout - please try again';
      }
      return 'Backend unavailable - check connection';
    }
    return `Server error: ${error.response.status}`;
  }
  return 'Unknown error occurred';
}

// API client with retry wrapper
async function apiRequest<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  options?: {
    params?: Record<string, unknown>;
    data?: unknown;
    retries?: number;
  }
): Promise<T> {
  const { params, data } = options || {};

  try {
    const response = method === 'get'
      ? await api.get<T>(url, { params })
      : method === 'post'
      ? await api.post<T>(url, data, { params })
      : method === 'put'
      ? await api.put<T>(url, data, { params })
      : await api.delete<T>(url, { params });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// ============ API Functions ============

// Health & Status
export async function getHealth(): Promise<ApiHealth> {
  return apiRequest<ApiHealth>('get', '/health');
}

// Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('get', '/dashboard');
}

// Predictions
export async function getLivePredictions(params?: {
  sport?: string;
  min_ev?: number;
  confidence?: string;
}): Promise<LivePrediction[]> {
  return apiRequest<LivePrediction[]>('get', '/predictions/live', { params });
}

export async function getUpcomingFixtures(params?: {
  days_ahead?: number;
  limit?: number;
  sport?: string;
}): Promise<UpcomingMatch[]> {
  return apiRequest<UpcomingMatch[]>('get', '/fixtures/upcoming', { params });
}

export async function predictFixture(fixtureId: number): Promise<Prediction> {
  return apiRequest<Prediction>('post', '/predict', {
    data: { fixture_id: fixtureId, confidence_threshold: 0.75 },
  });
}

export async function predictBatch(fixtureIds: number[]): Promise<Prediction[]> {
  const result = await apiRequest<{ predictions: Prediction[] }>('post', '/predict/batch', {
    data: { fixture_ids: fixtureIds, confidence_threshold: 0.75 },
  });
  return result.predictions;
}

// Historical
export async function getHistoricalPicks(params?: {
  start_date?: string;
  end_date?: string;
  sport?: string;
  league?: string;
}): Promise<HistoricalPick[]> {
  return apiRequest<HistoricalPick[]>('get', '/predictions/history', { params });
}

// Performance
export async function getHealthReport(params?: {
  period_days?: number;
  weeks_back?: number;
}): Promise<HealthReport> {
  return apiRequest<HealthReport>('get', '/health/report', { params });
}

export async function getPerformanceMetrics(): Promise<PerformanceMetrics> {
  return apiRequest<PerformanceMetrics>('get', '/performance');
}

// Fixture Detail
export async function getFixtureDetail(fixtureId: number): Promise<FixtureDetail> {
  return apiRequest<FixtureDetail>('get', `/fixtures/${fixtureId}`);
}

// Settings
export async function getSettings(): Promise<Settings> {
  return apiRequest<Settings>('get', '/settings');
}

export async function updateSettings(settings: Partial<Settings>): Promise<Settings> {
  return apiRequest<Settings>('put', '/settings', { data: settings });
}

// Settlement
export async function settlePredictions(daysBack: number = 1) {
  return apiRequest<unknown>('post', '/settle', { data: { days_back: daysBack } });
}

// Lineup Analysis
export async function analyzeLineup(
  fixtureId: number,
  homeTeamId: number,
  awayTeamId: number,
  matchDate: string
) {
  return apiRequest<unknown>('post', '/lineup/analyze', {
    data: {
      fixture_id: fixtureId,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      match_date: matchDate,
    },
  });
}

// Calibration
export async function getCalibrationStatus() {
  return apiRequest<unknown>('get', '/calibration/status');
}

export async function loadCalibrators(directory: string = 'models/calibrators') {
  return apiRequest<unknown>('post', '/calibration/load', { params: { directory } });
}

// Models
export async function getModels() {
  return apiRequest<unknown>('get', '/models');
}

// Export for external use
export { api };
export default api;