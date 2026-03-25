// src/core/systemStore.ts
import { SystemState, SystemEvent } from './types';
import { systemBus } from './eventBus';
import { INITIAL_FS, normalizePath, resolvePath, createFile, createDirectory, writeFile, deleteNode, moveNode, joinPath } from './vfs';
import { computeResources, createProcessInstance, validateSystemLimits } from './processManager';
import { log } from './logger';
import { systemScheduler } from './scheduler';

const INITIAL_STATE: SystemState = {
  tick: 0,
  processes: [],
  windows: [],
  fileSystem: INITIAL_FS,
  logs: [],
  resources: { cpuLoad: 2, memoryUsage: 124 },
  currentPath: 'C:/Users/Arsh',
  activeWindowId: null,
  bootStatus: 'booting'
};

let currentState: SystemState = INITIAL_STATE;
const listeners = new Set<(state: SystemState) => void>();

export const systemStore = {
  getState: () => currentState,
  subscribe: (fn: (state: SystemState) => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  dispatch: (event: SystemEvent) => {
    // 1. Assign eventId (for traceability)
    const eventId = `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // 2. State-level Validation
    try {
      validateEvent(event, currentState);
      
      // 3. No-Op Guard
      if (isNoOp(event, currentState)) return;

      // 4. Pure Execution
      const nextState = kernelReducer(currentState, event);
      
      // 5. Update and Notify
      if (nextState !== currentState) {
        currentState = nextState;
        listeners.forEach(fn => fn(currentState));
        
        // 6. Log Success (INFO)
        if (event.type !== 'TICK' && event.type !== 'SYS_LOG') {
          log('INFO', `Executed ${event.type}`, { eventType: event.type, eventId });
        }
      }
    } catch (error: any) {
      // 7. Log Failure (ERROR)
      log('ERROR', error.message || 'Execution failed', { eventType: event.type, eventId });
    }
  }
};

/**
 * Validates if an event can be executed against the current state.
 * Throws errors if validation fails.
 */
function validateEvent(event: SystemEvent, state: SystemState) {
  switch (event.type) {
    case 'FS_CD':
      resolvePath(state.fileSystem, joinPath(state.currentPath, event.payload.path));
      break;
    case 'FS_WRITE':
    case 'FS_DELETE':
      resolvePath(state.fileSystem, joinPath(state.currentPath, event.payload.path));
      break;
    case 'PROC_START':
      validateSystemLimits(state.processes);
      break;
    case 'PROC_KILL':
      if (!state.processes.some(p => p.pid === event.payload.pid)) {
        throw new Error(`Process ${event.payload.pid} not found`);
      }
      break;
  }
}

/**
 * Checks if an event would result in no change to the state.
 */
function isNoOp(event: SystemEvent, state: SystemState): boolean {
  if (event.type === 'FS_CD') {
    return normalizePath(joinPath(state.currentPath, event.payload.path)) === state.currentPath;
  }
  return false;
}

/**
 * Pure Kernel Reducer: Strictly for state transitions.
 */
function kernelReducer(state: SystemState, event: SystemEvent): SystemState {
  switch (event.type) {
    case 'TICK': {
      const nextTick = state.tick + 1;
      return {
        ...state,
        tick: nextTick,
        resources: computeResources(state.processes, nextTick)
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

    case 'FS_DELETE':
      return { ...state, fileSystem: deleteNode(state.fileSystem, joinPath(state.currentPath, event.payload.path)) };

    case 'FS_MOVE':
      return { ...state, fileSystem: moveNode(state.fileSystem, joinPath(state.currentPath, event.payload.from), joinPath(state.currentPath, event.payload.to)) };

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
        position: { x: 100 + state.windows.length * 30, y: 100 + state.windows.length * 30 },
        size: event.payload.params?.size || { width: 500, height: 400 }
      };

      return {
        ...state,
        processes: [...state.processes, newProcess],
        windows: [...state.windows, newWindow],
        activeWindowId: windowId
      };
    }

    case 'PROC_KILL': {
      const process = state.processes.find(p => p.pid === event.payload.pid);
      if (!process) return state;
      return {
        ...state,
        processes: state.processes.filter(p => p.pid !== event.payload.pid),
        windows: state.windows.filter(w => w.id !== process.windowId),
        activeWindowId: state.activeWindowId === process.windowId ? null : state.activeWindowId
      };
    }

    case 'WIN_FOCUS':
      return {
        ...state,
        activeWindowId: event.payload.id,
        windows: state.windows.map(w => 
          w.id === event.payload.id ? { ...w, zIndex: Math.max(...state.windows.map(win => win.zIndex)) + 1 } : w
        )
      };

    case 'SYS_LOG':
      return { ...state, logs: [event.payload, ...state.logs].slice(0, 200) };

    case 'SYS_REBOOT':
      return { ...INITIAL_STATE, bootStatus: 'booting' };

    default:
      return state;
  }
}

// Initialize System Bus & Scheduler
systemBus.subscribe((event) => systemStore.dispatch(event));
systemScheduler.start((event) => systemStore.dispatch(event));
