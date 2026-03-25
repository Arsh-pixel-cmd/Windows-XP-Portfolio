// src/core/types.ts

export type ProcessStatus = 'starting' | 'running' | 'suspended' | 'terminated';

export interface Process {
  pid: number;
  name: string;
  appType: string;
  status: ProcessStatus;
  createdAt: number;
  cpuUsage: number;
  memoryUsage: number;
  windowId: string;
}

export type FileNodeType = 'file' | 'directory';

export interface FileNode {
  name: string;
  type: FileNodeType;
  content?: string;
  children?: Record<string, FileNode>;
  parent?: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
}

export interface SystemResources {
  cpuLoad: number;
  memoryUsed: number;
  totalMemory: number;
  fps: number;
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

export type SystemEvent =
  | { type: 'PROC_START'; payload: { appType: string; title: string; params?: any } }
  | { type: 'PROC_KILL'; payload: { pid: number } }
  | { type: 'PROC_SUSPEND'; payload: { pid: number } }
  | { type: 'PROC_RESUME'; payload: { pid: number } }
  | { type: 'FS_CREATE'; payload: { path: string; type: FileNodeType; content?: string } }
  | { type: 'FS_DELETE'; payload: { path: string } }
  | { type: 'FS_WRITE'; payload: { path: string; content: string } }
  | { type: 'WIN_FOCUS'; payload: { id: string } }
  | { type: 'WIN_MINIMIZE'; payload: { id: string } }
  | { type: 'WIN_MAXIMIZE'; payload: { id: string } }
  | { type: 'WIN_MOVE'; payload: { id: string; x: number; y: number } }
  | { type: 'WIN_RESIZE'; payload: { id: string; width: number; height: number } }
  | { type: 'SYS_LOG'; payload: { level: 'INFO' | 'WARN' | 'ERROR'; message: string } };

export interface SystemState {
  processes: Process[];
  windows: WindowInstance[];
  fileSystem: FileNode;
  resources: SystemResources;
  activeWindowId: string | null;
  bootStatus: 'booting' | 'loading' | 'ready';
}
