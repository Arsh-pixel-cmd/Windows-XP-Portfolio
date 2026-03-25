// src/core/processManager.ts
import { Process, SystemResources } from './types';

export const SYSTEM_LIMITS = {
  MAX_MEMORY: 1024, // 1GB
  MAX_PROCESSES: 20,
  BASE_MEMORY_USAGE: 124, // System kernel base memory
};

/**
 * Computes deterministic resource usage for the current state.
 * CPU uses a sin-wave jitter model: base + sin(tick/5) * variance
 */
export function computeResources(processes: Process[], tick: number): SystemResources {
  const totalMemory = processes.reduce((acc, p) => acc + p.memory, SYSTEM_LIMITS.BASE_MEMORY_USAGE);
  
  const totalCpu = processes.reduce((acc, p) => {
    if (p.status !== 'running') return acc;
    // Each process has a base CPU and a jitter
    const base = p.cpu;
    const jitter = Math.sin((tick + p.pid) / 5) * 2;
    return acc + Math.max(0.5, base + jitter);
  }, 2); // 2% base system load

  return {
    cpuLoad: Math.min(100, totalCpu),
    memoryUsage: totalMemory
  };
}

/**
 * Creates a new process instance with initial resource allocation.
 */
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
    memory: 40 + Math.random() * 40, // Initial allocation
    cpu: 2 + Math.random() * 5,     // Base CPU load
    createdAt: Date.now(),
    cpuTime: 0,
    windowId,
    params
  };
}

export class ResourceLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceLimitError';
  }
}

export function validateSystemLimits(processes: Process[]) {
  if (processes.length >= SYSTEM_LIMITS.MAX_PROCESSES) {
    throw new ResourceLimitError('Maximum process limit reached');
  }
  
  const currentMem = processes.reduce((acc, p) => acc + p.memory, SYSTEM_LIMITS.BASE_MEMORY_USAGE);
  if (currentMem > SYSTEM_LIMITS.MAX_MEMORY * 0.9) {
    throw new ResourceLimitError('System low on memory');
  }
}
