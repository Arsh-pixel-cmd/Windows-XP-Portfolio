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
    [key: string]: any;
  };
};

export type ProcessStatus = 'running' | 'suspended' | 'terminated';

export interface Process {
  pid: number;
  name: string;
  appType: string;
  status: ProcessStatus;
  memory: number; // in MB
  cpu: number;    // % usage
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
}

export interface SystemResources {
  cpuLoad: number;
  memoryUsage: number;
}

export type SystemEvent =
  | { type: 'TICK'; payload?: undefined }
  | { type: 'FS_CREATE_FILE'; payload: { path: string; content?: string } }
  | { type: 'FS_CREATE_DIR'; payload: { path: string } }
  | { type: 'FS_WRITE'; payload: { path: string; content: string } }
  | { type: 'FS_DELETE'; payload: { path: string } }
  | { type: 'FS_MOVE'; payload: { from: string; to: string } }
  | { type: 'FS_RENAME'; payload: { path: string; newName: string } }
  | { type: 'FS_CD'; payload: { path: string } }
  | { type: 'FS_PWD'; payload?: undefined }
  | { type: 'PROC_START'; payload: { appType: string; title: string; params?: any } }
  | { type: 'PROC_KILL'; payload: { pid: number } }
  | { type: 'WIN_FOCUS'; payload: { id: string } }
  | { type: 'WIN_MINIMIZE'; payload: { id: string } }
  | { type: 'WIN_MAXIMIZE'; payload: { id: string } }
  | { type: 'WIN_MOVE'; payload: { id: string; x: number; y: number } }
  | { type: 'WIN_RESIZE'; payload: { id: string; width: number; height: number } }
  | { type: 'SYS_LOG'; payload: LogEntry }
  | { type: 'SYS_REBOOT'; payload?: undefined };

export interface SystemState {
  tick: number;
  processes: Process[];
  windows: WindowInstance[];
  fileSystem: FileNode;
  logs: LogEntry[];
  resources: SystemResources;
  currentPath: string; // Normalized Absolute Path
  activeWindowId: string | null;
  bootStatus: 'booting' | 'loading' | 'ready';
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
