// src/core/scheduler.ts
import { SystemEvent } from './types';

/**
 * Decoupled System Scheduler
 * Drives the system TICK at 1000ms intervals.
 */
class Scheduler {
  private timer: number | null = null;
  private dispatch: ((event: SystemEvent) => void) | null = null;

  start(dispatch: (event: SystemEvent) => void) {
    this.dispatch = dispatch;
    if (this.timer) return;

    // System TICK: 1000ms
    this.timer = window.setInterval(() => {
      this.dispatch!({ type: 'TICK' });
    }, 1000);
    
    console.log('[Scheduler] System TICK started (1000ms)');
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const systemScheduler = new Scheduler();
