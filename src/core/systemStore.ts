// src/core/systemStore.ts
import { SystemState, SystemEvent, Process, WindowInstance } from './types';
import { systemBus } from './eventBus';
import { INITIAL_FS, updateFS } from './vfs';

const INITIAL_RESOURCES = {
  cpuLoad: 2,
  memoryUsed: 124,
  totalMemory: 16384,
  fps: 60
};

let currentState: SystemState = {
  processes: [],
  windows: [],
  fileSystem: INITIAL_FS,
  resources: INITIAL_RESOURCES,
  activeWindowId: null,
  bootStatus: 'booting'
};

const listeners = new Set<(state: SystemState) => void>();

export const systemStore = {
  getState: () => currentState,
  subscribe: (fn: (state: SystemState) => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  dispatch: (event: SystemEvent) => {
    currentState = kernelReducer(currentState, event);
    listeners.forEach(fn => fn(currentState));
    // Auto-log to VFS
    if (event.type !== 'SYS_LOG') {
       systemStore.dispatch({ type: 'SYS_LOG', payload: { level: 'INFO', message: `Event: ${event.type}` } });
    }
  }
};

function kernelReducer(state: SystemState, event: SystemEvent): SystemState {
  switch (event.type) {
    case 'PROC_START': {
      const pid = Math.floor(Math.random() * 9000) + 1000;
      const windowId = `${event.payload.appType}_${pid}`;
      const newProcess: Process = {
        pid,
        name: event.payload.title,
        appType: event.payload.appType,
        status: 'running',
        createdAt: Date.now(),
        cpuUsage: 2 + Math.random() * 3,
        memoryUsage: 20 + Math.random() * 50,
        windowId
      };
      
      const newWindow: WindowInstance = {
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
    case 'WIN_MOVE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === event.payload.id ? { ...w, position: { x: event.payload.x, y: event.payload.y } } : w
        )
      };
    case 'FS_WRITE': {
      try {
        const newFS = updateFS(state.fileSystem, event.payload.path, { content: event.payload.content });
        return { ...state, fileSystem: newFS };
      } catch (e) {
        console.error(e);
        return state;
      }
    }
    case 'SYS_LOG': {
      const logEntry = `[${event.payload.level}] ${new Date().toISOString()}: ${event.payload.message}\n`;
      try {
        const logFile = state.fileSystem.children?.['System']?.children?.['logs.txt'];
        const currentLogs = logFile?.content || '';
        const newFS = updateFS(state.fileSystem, 'C:/System/logs.txt', { content: currentLogs + logEntry });
        return { ...state, fileSystem: newFS };
      } catch (e) {
         return state;
      }
    }
    default:
      return state;
  }
}

// OS Kernel Tick (Scheduler)
setInterval(() => {
  const state = systemStore.getState();
  if (state.processes.length === 0) return;

  const totalCpu = state.processes.reduce((acc, p) => acc + (p.status === 'running' ? p.cpuUsage : 0), 2);
  const totalMem = state.processes.reduce((acc, p) => acc + p.memoryUsage, 124);
  const fps = Math.max(30, Math.floor(60 - (totalCpu * 0.2)));

  // We optimize by only updating if values change significantly or every X ticks
  // For simplicity here, we just update resources
  currentState = {
    ...state,
    resources: {
      ...state.resources,
      cpuLoad: totalCpu,
      memoryUsed: totalMem,
      fps
    },
    processes: state.processes.map(p => ({
      ...p,
      cpuUsage: p.status === 'running' ? Math.max(1, p.cpuUsage + (Math.random() - 0.5)) : 0,
      memoryUsage: p.memoryUsage + (Math.random() - 0.5)
    }))
  };
  listeners.forEach(fn => fn(currentState));
}, 2000);

// Plug the bus into the store
systemBus.subscribe((event) => {
  systemStore.dispatch(event);
});
