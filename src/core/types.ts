// src/core/types.ts

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export type LogEntry = {
  id: string; // eventId
  timestamp: number;
  level: LogLevel;
  message: string;
  meta?: {
    eventType?: string;
    path?: string;
    pid?: number;
    eventId?: string;
    parentEventId?: string; // For correlation
    [key: string]: any;
  };
};

export type ProcessStatus = 'running' | 'suspended' | 'crashed' | 'terminated';

export interface Process {
  pid: number;
  name: string;
  appType: string;
  status: ProcessStatus;
  memory: number; // in MB
  cpu: number;    // % usage
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  createdAt: number;
  cpuTime: number; 
  windowId: string;
  params?: Record<string, any>;
}

export type FileNodeType = 'file' | 'directory';

export interface FileNode {
  name: string;
  type: FileNodeType;
  content?: string;
  children?: FileNode[];
  readonly?: boolean;
  createdAt: number;
  updatedAt: number;
  lockedBy?: number; // PID of the process locking this file
}

export interface SystemResources {
  cpuLoad: number;
  memoryUsage: number;
  isOverloaded?: boolean;
  isBlocked?: boolean; // For hysteresis-based process blocking
}

export interface WindowInstance {
  id: string;
  pid: number;
  title: string;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DesktopIconData {
  id: string;
  label: string;
  appType: string;
  x: number;
  y: number;
}

export interface SystemState {
  version: string; // "1.0.0"
  tick: number;
  lastCrashTick: number; // For cooldown management
  startTime: number; // For drift correction
  processes: Process[];
  windows: WindowInstance[];
  fileSystem: FileNode;
  logs: LogEntry[];
  eventHistory: SystemEvent[]; // For debugging/replay (capped at 500)
  resources: SystemResources;
  currentPath: string; // Normalized Absolute Path
  activeWindowId: string | null;
  bootStatus: 'booting' | 'loading' | 'ready';
  desktopIcons: DesktopIconData[];
}

export type SystemEvent =
  | { type: 'TICK'; payload: { tick: number; timestamp: number } }
  | { type: 'FS_CREATE_FILE'; payload: { path: string; content?: string } }
  | { type: 'FS_CREATE_DIR'; payload: { path: string } }
  | { type: 'FS_WRITE'; payload: { path: string; content: string; pid?: number } }
  | { type: 'FS_DELETE'; payload: { path: string } }
  | { type: 'FS_MOVE'; payload: { from: string; to: string } }
  | { type: 'FS_RENAME'; payload: { path: string; newName: string } }
  | { type: 'FS_CD'; payload: { path: string } }
  | { type: 'FS_LOCK'; payload: { path: string; pid: number } }
  | { type: 'FS_UNLOCK'; payload: { path: string; pid: number } }
  | { type: 'PROC_START'; payload: { appType: string; title: string; priority?: 'LOW' | 'NORMAL' | 'HIGH'; params?: any } }
  | { type: 'PROC_KILL'; payload: { pid: number } }
  | { type: 'PROC_PRIORITY'; payload: { pid: number; priority: 'LOW' | 'NORMAL' | 'HIGH' } }
  | { type: 'PROC_CRASH'; payload: { pid: number; reason: string } }
  | { type: 'WIN_FOCUS'; payload: { id: string } }
  | { type: 'WIN_MINIMIZE'; payload: { id: string } }
  | { type: 'WIN_MAXIMIZE'; payload: { id: string } }
  | { type: 'WIN_MOVE'; payload: { id: string; x: number; y: number } }
  | { type: 'WIN_RESIZE'; payload: { id: string; width: number; height: number } }
  | { type: 'ICON_MOVE'; payload: { id: string; x: number; y: number } }
  | { type: 'SYS_LOG'; payload: LogEntry }
  | { type: 'SYS_REBOOT'; payload?: void }
  | { type: 'SYS_IMPORT_STATE'; payload: SystemState }
  | { type: 'SYS_EXPORT_STATE'; payload?: void }
  | { type: 'SYS_REFRESH' };
