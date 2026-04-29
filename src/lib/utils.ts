import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getEvColor(ev: number): string {
  if (ev > 8) return 'text-ev-strong';
  if (ev >= 4) return 'text-ev-moderate';
  if (ev > 0) return 'text-ev-neutral';
  return 'text-ev-negative';
}

export function getEvBgColor(ev: number): string {
  if (ev > 8) return 'bg-ev-strong/10 border-ev-strong/30';
  if (ev >= 4) return 'bg-ev-moderate/10 border-ev-moderate/30';
  if (ev > 0) return 'bg-ev-neutral/10 border-ev-neutral/30';
  return 'bg-ev-negative/10 border-ev-negative/30';
}

export function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case 'high':
      return 'text-ev-strong bg-ev-strong/10';
    case 'medium':
      return 'text-ev-moderate bg-ev-moderate/10';
    case 'low':
      return 'text-ev-neutral bg-ev-neutral/10';
    default:
      return 'text-ev-neutral bg-ev-neutral/10';
  }
}

export function getConfidenceLabel(confidence: string): string {
  return confidence.charAt(0).toUpperCase() + confidence.slice(1);
}

export function getSportIcon(sport: string): string {
  switch (sport.toLowerCase()) {
    case 'football':
      return '⚽';
    case 'nba':
    case 'basketball':
      return '🏀';
    case 'mlb':
    case 'baseball':
      return '⚾';
    default:
      return '🎯';
  }
}

export function getLeagueLabel(code: string): string {
  const leagues: Record<string, string> = {
    BL1: 'Bundesliga',
    PL: 'Premier League',
    PD: 'La Liga',
    SA: 'Serie A',
    FL1: 'Ligue 1',
    NBA: 'NBA',
    MLB: 'MLB',
  };
  return leagues[code] || code;
}

export function calculateEV(
  probability: number,
  odds: number
): number {
  const impliedProbability = 1 / odds;
  return (probability - impliedProbability) * 100;
}

export function calculateKelly(
  probability: number,
  odds: number,
  multiplier: number = 0.25
): number {
  const b = odds - 1;
  const p = probability;
  const q = 1 - p;
  const kelly = (b * p - q) / b;
  return Math.max(0, kelly * multiplier) * 100;
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(date);
}