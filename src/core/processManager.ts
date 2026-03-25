// src/core/processManager.ts
import { Process, SystemResources, SystemState } from './types';

const PRIORITY_WEIGHTS = {
  LOW: 0.5,
  NORMAL: 1.0,
  HIGH: 2.0
};

/**
 * Computes deterministic resource usage with priority awareness.
 * Memory > 95% triggers potential crashes in shouldProcessCrash.
 */
export function computeResources(processes: Process[], tick: number, lastState?: SystemState): SystemResources {
  const baseCpu = 2; // Kernel overhead
  const baseMem = 124;

  const totalCpuMultiplier = processes.reduce((acc, p) => 
    acc + (p.status === 'running' ? PRIORITY_WEIGHTS[p.priority] : 0), 0
  );

  const cpuLoad = Math.min(100, baseCpu + totalCpuMultiplier * 5 + Math.sin(tick / 5) * 3);
  const memoryUsage = processes.reduce((acc, p) => acc + p.memory, baseMem);

  // Hysteresis calculation for backpressure
  let isBlocked = lastState?.resources.isBlocked || false;
  if (cpuLoad > 90) isBlocked = true;
  if (cpuLoad < 75) isBlocked = false;

  return {
    cpuLoad,
    memoryUsage,
    isOverloaded: cpuLoad > 85 || (memoryUsage / 16384) > 0.85,
    isBlocked
  };
}

/**
 * Enforces system limits with backpressure.
 */
export function validateSystemLimits(state: SystemState) {
  if (state.resources.isBlocked) {
    throw new Error('System overloaded: Process creation suspended (Backpressure active)');
  }
  if (state.processes.length >= 20) {
    throw new Error('Maximum process limit reached (20)');
  }
}

/**
 * Deterministic Crash Simulator with Cooldown
 */
export function shouldProcessCrash(state: SystemState, process: Process): boolean {
  if (process.status !== 'running') return false;
  
  const memoryPercent = (state.resources.memoryUsage / 16384) * 100;
  
  // Rule: Memory > 95% AND Tick Periodicity AND Cooldown (20 ticks)
  if (memoryPercent > 95 && state.tick % 10 === 0 && (state.tick - state.lastCrashTick) > 20) {
    return true;
  }
  return false;
}

export function createProcessInstance(
  pid: number, 
  name: string, 
  appType: string, 
  windowId: string, 
  params?: any
): Process {
  return {
    pid,
    name,
    appType,
    status: 'running',
    createdAt: Date.now(),
    cpu: 2, 
    memory: 40 + Math.random() * 60,
    priority: params?.priority || 'NORMAL',
    cpuTime: 0,
    windowId,
    params
  };
}
