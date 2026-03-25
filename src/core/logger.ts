// src/core/logger.ts
import { LogEntry, LogLevel } from './types';
import { systemBus } from './eventBus';

let logCounter = 0;

/**
 * System Logger
 * Emits SYS_LOG events to the event bus.
 * Metadata includes eventId for traceability.
 */
export const log = (
  level: LogLevel, 
  message: string, 
  meta?: { eventType?: string; path?: string; pid?: number; [key: string]: any }
) => {
  const entry: LogEntry = {
    id: `evt-${Date.now()}-${logCounter++}`,
    timestamp: Date.now(),
    level,
    message,
    meta
  };

  systemBus.emit({ type: 'SYS_LOG', payload: entry });
};
