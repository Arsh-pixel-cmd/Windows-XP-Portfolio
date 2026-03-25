// src/core/vfs.ts
import { FileNode } from './types';

export class FileSystemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileSystemError';
  }
}

export const INITIAL_FS: FileNode = {
  name: 'C:',
  type: 'directory',
  children: {
    'Users': {
      name: 'Users',
      type: 'directory',
      children: {
        'Arsh': {
          name: 'Arsh',
          type: 'directory',
          children: {
            'Documents': {
              name: 'Documents',
              type: 'directory',
              children: {
                'Resume.txt': {
                  name: 'Resume.txt',
                  type: 'file',
                  content: 'Arsh Mishra - Senior Software Engineer\nSystems Architect | Full-Stack Developer',
                  permissions: { read: true, write: true, delete: true }
                },
                'Projects.txt': {
                  name: 'Projects.txt',
                  type: 'file',
                  content: 'DevLens Ultra, Neural Visualizer, Arsh OS...',
                  permissions: { read: true, write: true, delete: true }
                }
              },
              permissions: { read: true, write: true, delete: true }
            },
            'Desktop': {
              name: 'Desktop',
              type: 'directory',
              children: {},
              permissions: { read: true, write: true, delete: true }
            }
          },
          permissions: { read: true, write: true, delete: true }
        }
      },
      permissions: { read: true, write: false, delete: false }
    },
    'System': {
      name: 'System',
      type: 'directory',
      children: {
        'logs.txt': {
          name: 'logs.txt',
          type: 'file',
          content: '[INFO] System Kernel initialized v4.0.0\n',
          permissions: { read: true, write: false, delete: false }
        }
      },
      permissions: { read: true, write: false, delete: false }
    }
  },
  permissions: { read: true, write: false, delete: false }
};

export function resolvePath(fs: FileNode, path: string, currentPath: string = 'C:/Users/Arsh'): FileNode {
  let absolutePath = path.startsWith('C:') ? path : `${currentPath}/${path}`;
  // Normalize path
  const parts = absolutePath.split('/').filter(p => p && p !== '.');
  const normalizedParts: string[] = [];
  
  for (const part of parts) {
    if (part === '..') {
      normalizedParts.pop();
    } else {
      normalizedParts.push(part);
    }
  }

  if (normalizedParts[0] === 'C:') normalizedParts.shift();
  
  let current: FileNode = fs;
  for (const part of normalizedParts) {
    if (current.type !== 'directory' || !current.children || !current.children[part]) {
      throw new FileSystemError(`File or directory not found: ${path}`);
    }
    current = current.children[part];
  }
  
  return current;
}

export function updateFS(fs: FileNode, path: string, updates: Partial<FileNode>): FileNode {
  // Simple immutable update logic (recursive)
  const parts = path.replace('C:/', '').split('/').filter(Boolean);
  
  const deepUpdate = (node: FileNode, pathParts: string[]): FileNode => {
    if (pathParts.length === 0) {
      return { ...node, ...updates };
    }
    
    const [current, ...rest] = pathParts;
    if (!node.children || !node.children[current]) {
      throw new FileSystemError(`Path not found: ${path}`);
    }
    
    return {
      ...node,
      children: {
        ...node.children,
        [current]: deepUpdate(node.children[current], rest)
      }
    };
  };
  
  return deepUpdate(fs, parts);
}
