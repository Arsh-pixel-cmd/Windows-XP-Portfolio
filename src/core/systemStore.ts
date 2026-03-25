// src/core/systemStore.ts
import { SystemState, SystemEvent } from './types';
import { systemBus } from './eventBus';
import { INITIAL_FS, normalizePath, createFile, createDirectory, writeFile, joinPath, setLock, releaseAllLocks } from './vfs';
import { computeResources, createProcessInstance, validateSystemLimits, shouldProcessCrash } from './processManager';
import { log } from './logger';
import { systemScheduler } from './scheduler';

const SYSTEM_VERSION = '1.0.0';

const INITIAL_STATE: SystemState = {
  version: SYSTEM_VERSION,
  tick: 0,
  lastCrashTick: -100,
  startTime: Date.now(),
  processes: [],
  windows: [],
  fileSystem: INITIAL_FS,
  logs: [],
  eventHistory: [],
  resources: { cpuLoad: 2, memoryUsage: 124, isBlocked: false },
  currentPath: 'C:/Users/Arsh',
  activeWindowId: null,
  bootStatus: 'ready'
};

let currentState: SystemState = INITIAL_STATE;
const listeners = new Set<(state: SystemState) => void>();

export const systemStore = {
  getState: () => currentState,
  subscribe: (fn: (state: SystemState) => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  dispatch: (event: SystemEvent, parentEventId?: string) => {
    const eventId = `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    try {
      if (currentState.bootStatus !== 'ready' && event.type !== 'SYS_REBOOT' && event.type !== 'TICK') {
        throw new Error('System not ready');
      }

      validateEvent(event, currentState);
      
      const nextState = kernelReducer(currentState, event);
      
      if (nextState !== currentState) {
        // Update history (cap at 500)
        const newHistory = [event, ...nextState.eventHistory].slice(0, 500);
        currentState = { ...nextState, eventHistory: newHistory };
        
        listeners.forEach(fn => fn(currentState));
        
        if (event.type !== 'TICK' && event.type !== 'SYS_LOG') {
          log('INFO', `Executed ${event.type}`, { 
            eventType: event.type, 
            eventId,
            parentEventId 
          });
        }
      }
    } catch (error: any) {
      if (event.type !== 'TICK') {
        log('ERROR', error.message || 'Execution failed', { eventType: event.type, eventId, parentEventId });
      }
    }
  }
};

function validateEvent(event: SystemEvent, state: SystemState) {
  switch (event.type) {
    case 'PROC_START':
      validateSystemLimits(state);
      break;
    case 'SYS_IMPORT_STATE':
      if (event.payload.version !== SYSTEM_VERSION) {
        throw new Error(`Incompatible system version: ${event.payload.version}`);
      }
      break;
  }
}

function kernelReducer(state: SystemState, event: SystemEvent): SystemState {
  switch (event.type) {
    case 'TICK': {
      let nextState = { ...state, tick: event.payload.tick };
      
      // 1. Compute resources (with hysteresis)
      nextState.resources = computeResources(nextState.processes, nextState.tick, state);

      // 2. Deterministic Crash Simulation
      const crashedProcess = nextState.processes.find(p => shouldProcessCrash(nextState, p));
      if (crashedProcess) {
        return kernelReducer(nextState, { 
          type: 'PROC_CRASH', 
          payload: { pid: crashedProcess.pid, reason: 'Out of Memory / Segmentation Fault' } 
        });
      }

      return nextState;
    }

    case 'PROC_START': {
      const pid = Math.floor(Math.random() * 9000) + 1000;
      const windowId = `${event.payload.appType}_${pid}`;
      const newProcess = createProcessInstance(pid, event.payload.title, event.payload.appType, windowId, event.payload.params);
      
      const newWindow = {
        id: windowId,
        pid,
        title: event.payload.title,
        zIndex: state.windows.length + 10,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position: { x: 100 + (state.windows.length % 5) * 30, y: 100 + (state.windows.length % 5) * 30 },
        size: event.payload.params?.size || { width: 500, height: 400 }
      };

      return {
        ...state,
        processes: [...state.processes, newProcess],
        windows: [...state.windows, newWindow],
        activeWindowId: windowId
      };
    }

    case 'PROC_KILL':
    case 'PROC_CRASH': {
      const pid = event.payload.pid;
      const process = state.processes.find(p => p.pid === pid);
      if (!process) return state;

      // Clean up VFS locks
      const newFs = releaseAllLocks(state.fileSystem, pid);

      return {
        ...state,
        processes: state.processes.filter(p => p.pid !== pid),
        windows: state.windows.filter(w => w.id !== process.windowId),
        fileSystem: newFs,
        activeWindowId: state.activeWindowId === process.windowId ? null : state.activeWindowId,
        lastCrashTick: event.type === 'PROC_CRASH' ? state.tick : state.lastCrashTick
      };
    }

    case 'FS_CD':
      return { ...state, currentPath: normalizePath(joinPath(state.currentPath, event.payload.path)) };

    case 'FS_CREATE_FILE':
      return { ...state, fileSystem: createFile(state.fileSystem, joinPath(state.currentPath, event.payload.path), event.payload.content) };

    case 'FS_CREATE_DIR':
      return { ...state, fileSystem: createDirectory(state.fileSystem, joinPath(state.currentPath, event.payload.path)) };

    case 'FS_WRITE':
      return { ...state, fileSystem: writeFile(state.fileSystem, joinPath(state.currentPath, event.payload.path), event.payload.content) };

    case 'FS_LOCK':
      return { ...state, fileSystem: setLock(state.fileSystem, joinPath(state.currentPath, event.payload.path), event.payload.pid) };

    case 'FS_UNLOCK':
      return { ...state, fileSystem: setLock(state.fileSystem, joinPath(state.currentPath, event.payload.path), undefined) };

    case 'FS_DELETE':
      return { ...state, fileSystem: deleteNode(state.fileSystem, joinPath(state.currentPath, event.payload.path)) };

    case 'SYS_LOG':
      return { ...state, logs: [event.payload, ...state.logs].slice(0, 500) };

    case 'SYS_IMPORT_STATE':
      systemScheduler.reset(event.payload.tick);
      return { ...event.payload, startTime: Date.now() - event.payload.tick * 1000 };

    case 'SYS_REBOOT':
      systemScheduler.reset(0);
      return { ...INITIAL_STATE, startTime: Date.now() };

    default:
      return state;
  }
}

// Isolated Replay Engine
export function replayHistory(history: SystemEvent[]) {
  let tempState = INITIAL_STATE;
  history.reverse().forEach(evt => {
    tempState = kernelReducer(tempState, evt);
  });
  return tempState;
}

// Initialize System Bus & Scheduler
systemBus.subscribe((event) => systemStore.dispatch(event));
systemScheduler.start((event) => systemStore.dispatch(event));
