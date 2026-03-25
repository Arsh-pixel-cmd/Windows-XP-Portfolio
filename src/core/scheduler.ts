// src/core/scheduler.ts
import { SystemEvent } from './types';

/**
 * Drift-aware System Scheduler
 * Uses recursive setTimeout to correct for JS timer drift.
 */
class Scheduler {
  private tickCount = 0;
  private startTime = 0;
  private isRunning = false;
  private dispatch: ((event: SystemEvent) => void) | null = null;

  start(dispatch: (event: SystemEvent) => void) {
    this.dispatch = dispatch;
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = Date.now();
    this.tickCount = 0;
    this.scheduleNext();
    
    console.log('[Scheduler] Drift-aware System TICK started');
  }

  private scheduleNext() {
    if (!this.isRunning) return;

    const tick = () => {
      this.tickCount++;
      const now = Date.now();
      
      // Calculate next delay to correct for drift
      const expectedTime = this.startTime + this.tickCount * 1000;
      const drift = now - expectedTime;
      const nextDelay = Math.max(0, 1000 - drift);

      if (this.dispatch) {
        this.dispatch({ 
          type: 'TICK', 
          payload: { 
            tick: this.tickCount,
            timestamp: now
          }
        });
      }

      setTimeout(tick, nextDelay);
    };

    setTimeout(tick, 1000);
  }

  stop() {
    this.isRunning = false;
  }
  
  reset(tick = 0) {
    this.tickCount = tick;
    this.startTime = Date.now() - tick * 1000;
  }
}

export const systemScheduler = new Scheduler();
