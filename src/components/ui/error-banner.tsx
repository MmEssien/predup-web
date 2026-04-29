"use client";

import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export function ErrorBanner({
  title = 'Error',
  message,
  onRetry,
  onDismiss,
  variant = 'error',
}: ErrorBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const variantStyles = {
    error: 'bg-destructive/10 border-destructive/30 text-destructive',
    warning: 'bg-ev-moderate/10 border-ev-moderate/30 text-ev-moderate',
    info: 'bg-primary/10 border-primary/30 text-primary',
  };

  const iconColors = {
    error: 'text-destructive',
    warning: 'text-ev-moderate',
    info: 'text-primary',
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border ${variantStyles[variant]} mb-4`}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${iconColors[variant]}`} />
        <div>
          {title && <p className="font-medium">{title}</p>}
          <p className="text-sm opacity-90">{message}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className={iconColors[variant]}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Offline indicator component
interface OfflineIndicatorProps {
  lastUpdated?: Date;
  onRefresh?: () => void;
}

export function OfflineIndicator({ lastUpdated, onRefresh }: OfflineIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="w-2 h-2 rounded-full bg-ev-negative animate-pulse" />
      <span>Backend offline</span>
      {lastUpdated && (
        <span className="text-muted-foreground/60">
          (Last update: {lastUpdated.toLocaleTimeString()})
        </span>
      )}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="text-primary hover:underline ml-2"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// Connection status indicator
interface ConnectionStatusProps {
  isConnected: boolean;
  latency?: number;
}

export function ConnectionStatus({ isConnected, latency }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${
          isConnected
            ? 'bg-ev-strong animate-pulse'
            : 'bg-ev-negative'
        }`}
      />
      <span className="text-xs text-muted-foreground">
        {isConnected
          ? latency
            ? `Connected (${latency}ms)`
            : 'Connected'
          : 'Disconnected'}
      </span>
    </div>
  );
}