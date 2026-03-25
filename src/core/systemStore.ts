// src/core/systemStore.ts
import { SystemState, SystemEvent } from './types';
import { systemBus } from './eventBus';
import { INITIAL_FS, normalizePath, createFile, createDirectory, writeFile, joinPath, setLock, releaseAllLocks, deleteNode } from './vfs';
import { computeResources, createProcessInstance, validateSystemLimits, shouldProcessCrash } from './processManager';
import { log } from './logger';
import { systemScheduler } from './scheduler';

const SYSTEM_VERSION = '1.0.0';

const INITIAL_STATE_ICONS = [
  { id: 'about', label: 'About.exe', appType: 'about', x: 20, y: 20 },
  { id: 'projects', label: 'Projects.exe', appType: 'projects', x: 20, y: 110 },
  { id: 'systems', label: 'Systems.exe', appType: 'systems', x: 20, y: 200 },
  { id: 'experiments', label: 'Experiments.exe', appType: 'experiments', x: 20, y: 290 },
  { id: 'terminal', label: 'cmd.exe', appType: 'terminal', x: 20, y: 380 },
  { id: 'contact', label: 'Contact.exe', appType: 'contact', x: 20, y: 470 },
  { id: 'notepad', label: 'Notepad.exe', appType: 'notepad', x: 110, y: 20 },
  { id: 'monitor', label: 'SysMon.exe', appType: 'monitor', x: 110, y: 110 },
  { id: 'logviewer', label: 'EventLog.exe', appType: 'logviewer', x: 110, y: 200 },
  { id: 'resume', label: 'Resume.txt', appType: 'resume', x: 200, y: 20, params: { filePath: 'C:/Users/Arsh/Desktop/Resume.txt' } },
  { id: 'identity', label: 'Identity.exe', appType: 'identity', x: 200, y: 110 },
  { id: 'tips', label: 'Hints.exe', appType: 'tips', x: 200, y: 200 },
];

const loadInitialIcons = () => {
  const saved = localStorage.getItem('xp_desktop_icons');
  if (!saved) return INITIAL_STATE_ICONS;
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return INITIAL_STATE_ICONS;
    
    // Merge: Keep saved positions, but take ALL other properties from INITIAL_STATE_ICONS
    // to ensure params, appType, and labels stay in sync with system updates.
    const merged = [...parsed];
    INITIAL_STATE_ICONS.forEach(initial => {
      const existingIndex = merged.findIndex(m => m.id === initial.id);
      if (existingIndex === -1) {
        merged.push(initial);
      } else {
        // Keep user's position, update everything else (params, appType, etc.)
        merged[existingIndex] = {
          ...initial,
          x: merged[existingIndex].x,
          y: merged[existingIndex].y,
        };
      }
    });
    return merged;
  } catch {
    return INITIAL_STATE_ICONS;
  }
};

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
  bootStatus: 'ready',
  desktopIcons: loadInitialIcons()
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
          // Persist desktop icons
          if (event.type === 'ICON_MOVE') {
            localStorage.setItem('xp_desktop_icons', JSON.stringify(nextState.desktopIcons));
          }
          
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
  const e = event as any;
  switch (event.type) {
    case 'PROC_START':
      validateSystemLimits(state);
      break;
    case 'SYS_IMPORT_STATE':
      if (e.payload.version !== SYSTEM_VERSION) {
        throw new Error(`Incompatible system version: ${e.payload.version}`);
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

    case 'PROC_PRIORITY': {
      return {
        ...state,
        processes: state.processes.map(p => 
          p.pid === event.payload.pid ? { ...p, priority: event.payload.priority } : p
        )
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

    case 'SYS_REFRESH':
      localStorage.removeItem('xp_desktop_icons');
      return { ...state, desktopIcons: INITIAL_STATE_ICONS };

    case 'ICON_MOVE':
      return {
        ...state,
        desktopIcons: state.desktopIcons.map(icon => 
          icon.id === event.payload.id ? { ...icon, x: event.payload.x, y: event.payload.y } : icon
        )
      };

    case 'WIN_FOCUS': {
      const window = state.windows.find(w => w.id === event.payload.id);
      if (!window) return state;
      const maxZ = Math.max(...state.windows.map(w => w.zIndex), 0);
      return {
        ...state,
        activeWindowId: event.payload.id,
        windows: state.windows.map(w => 
          w.id === event.payload.id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
        )
      };
    }

    case 'WIN_MINIMIZE':
      return {
        ...state,
        activeWindowId: state.activeWindowId === event.payload.id ? null : state.activeWindowId,
        windows: state.windows.map(w => 
          w.id === event.payload.id ? { ...w, isMinimized: true } : w
        )
      };

    case 'WIN_MAXIMIZE':
      return {
        ...state,
        windows: state.windows.map(w => 
          w.id === event.payload.id ? { ...w, isMaximized: !w.isMaximized, isMinimized: false } : w
        )
      };

    case 'WIN_MOVE':
      return {
        ...state,
        windows: state.windows.map(w => 
          w.id === event.payload.id ? { ...w, position: { x: event.payload.x, y: event.payload.y } } : w
        )
      };

    case 'WIN_RESIZE':
      return {
        ...state,
        windows: state.windows.map(w => 
          w.id === event.payload.id ? { ...w, size: { width: event.payload.width, height: event.payload.height } } : w
        )
      };

    case 'SYS_LOG':
      return { ...state, logs: [event.payload, ...state.logs].slice(0, 500) };

    case 'SYS_IMPORT_STATE':
      systemScheduler.reset(event.payload.tick);
      return { ...event.payload, startTime: Date.now() - event.payload.tick * 1000 };

    case 'SYS_EXPORT_STATE':
      return state; // No-op for state mutation, handled by logger in dispatch

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
