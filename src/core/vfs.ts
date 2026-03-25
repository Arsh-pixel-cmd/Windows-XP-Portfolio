// src/core/vfs.ts
import { FileNode } from './types';

export class VfsError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'VfsError';
  }
}

export class FileNotFoundError extends VfsError {
  constructor(path: string) {
    super('ENOENT', `File or directory not found: ${path}`);
  }
}

export class FileAlreadyExistsError extends VfsError {
  constructor(path: string) {
    super('EEXIST', `File or directory already exists: ${path}`);
  }
}

export class NotADirectoryError extends VfsError {
  constructor(path: string) {
    super('ENOTDIR', `Not a directory: ${path}`);
  }
}

export class DirectoryNotEmptyError extends VfsError {
  constructor(path: string) {
    super('ENOTEMPTY', `Directory not empty: ${path}`);
  }
}

export class PermissionDeniedError extends VfsError {
  constructor(path: string) {
    super('EACCES', `Permission denied: ${path}`);
  }
}

/**
 * Strictly normalizes a path to an absolute form starting with C:/
 * Idempotent: normalizePath(normalizePath(p)) === normalizePath(p)
 */
export function normalizePath(path: string): string {
  // Enforce root
  let p = path.replace(/\\/g, '/');
  if (!p.startsWith('C:')) {
     // If it's a relative path fragment, we assume it's relative to something elsewhere, 
     // but the internal storage always uses absolute. For now, we'll just handle 
     // basic normalization. The resolvePath function handles relative joining.
  }
  
  const parts = p.split('/').filter(Boolean);
  const stack: string[] = [];
  
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (stack.length > 1) stack.pop(); // Don't pop C:
    } else {
      stack.push(part);
    }
  }
  
  return stack.join('/');
}

/**
 * Joins and normalizes paths.
 */
export function joinPath(base: string, target: string): string {
  if (target.startsWith('C:')) return normalizePath(target);
  return normalizePath(`${base}/${target}`);
}

export const INITIAL_FS: FileNode = {
  name: 'C:',
  type: 'directory',
  readonly: true,
  children: [
    {
      name: 'Users',
      type: 'directory',
      children: [
        {
          name: 'Arsh',
          type: 'directory',
          children: [
            {
              name: 'Documents',
              type: 'directory',
              children: [
                {
                  name: 'Resume.txt',
                  type: 'file',
                  content: 'Arsh Mishra - Senior Software Engineer\nSystems Architect | Full-Stack Developer'
                }
              ]
            },
            {
              name: 'Desktop',
              type: 'directory',
              children: []
            }
          ]
        }
      ]
    },
    {
      name: 'System',
      type: 'directory',
      readonly: true,
      children: [
        {
          name: 'logs.txt',
          type: 'file',
          readonly: true,
          content: '[INFO] System Kernel initialized\n'
        }
      ]
    }
  ]
};

/**
 * Primary interface: resolve a path to a Node. Throws if not found.
 */
export function resolvePath(fs: FileNode, path: string): FileNode {
  const normalized = normalizePath(path);
  const parts = normalized.split('/').filter(Boolean);
  
  if (parts[0] !== 'C:') throw new FileNotFoundError(path);
  
  let current: FileNode = fs;
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const next = current.children?.find(c => c.name === part);
    if (!next) throw new FileNotFoundError(path);
    current = next;
  }
  
  return current;
}

/**
 * Pure transformation: returns a new FS tree with the change.
 */
export function createFile(root: FileNode, path: string, content: string = ''): FileNode {
  const normalized = normalizePath(path);
  const pParts = normalized.split('/').filter(Boolean);
  const fileName = pParts.pop()!;
  
  return updateInternal(root, pParts, (parent) => {
    if (parent.readonly) throw new PermissionDeniedError(parent.name);
    if (parent.children?.some(c => c.name === fileName)) throw new FileAlreadyExistsError(path);
    
    return {
      ...parent,
      children: [...(parent.children || []), { name: fileName, type: 'file', content }]
    };
  });
}

export function createDirectory(root: FileNode, path: string): FileNode {
  const normalized = normalizePath(path);
  const pParts = normalized.split('/').filter(Boolean);
  const dirName = pParts.pop()!;
  
  return updateInternal(root, pParts, (parent) => {
    if (parent.readonly) throw new PermissionDeniedError(parent.name);
    if (parent.children?.some(c => c.name === dirName)) throw new FileAlreadyExistsError(path);
    
    return {
      ...parent,
      children: [...(parent.children || []), { name: dirName, type: 'directory', children: [] }]
    };
  });
}

export function writeFile(root: FileNode, path: string, content: string): FileNode {
  const normalized = normalizePath(path);
  const pParts = normalized.split('/').filter(Boolean);
  
  return updateInternal(root, pParts, (node) => {
    if (node.readonly) throw new PermissionDeniedError(path);
    if (node.type !== 'file') throw new PermissionDeniedError(path); // Cannot "write" to directory
    return { ...node, content };
  });
}

export function deleteNode(root: FileNode, path: string): FileNode {
  const normalized = normalizePath(path);
  if (normalized === 'C:') throw new PermissionDeniedError('Cannot delete root');
  
  const pParts = normalized.split('/').filter(Boolean);
  const targetName = pParts.pop()!;
  
  return updateInternal(root, pParts, (parent) => {
    if (parent.readonly) throw new PermissionDeniedError(path);
    const target = parent.children?.find(c => c.name === targetName);
    if (!target) throw new FileNotFoundError(path);
    if (target.readonly) throw new PermissionDeniedError(path);
    if (target.type === 'directory' && (target.children?.length || 0) > 0) {
      throw new DirectoryNotEmptyError(path);
    }
    
    return {
      ...parent,
      children: parent.children?.filter(c => c.name !== targetName)
    };
  });
}

export function moveNode(root: FileNode, from: string, to: string): FileNode {
  const srcNorm = normalizePath(from);
  const destNorm = normalizePath(to);
  
  if (srcNorm === 'C:') throw new PermissionDeniedError('Cannot move root');
  if (destNorm.startsWith(srcNorm)) throw new PermissionDeniedError('Cannot move directory into itself');
  
  const srcNode = resolvePath(root, srcNorm);
  
  // 1. Remove from source
  const fsWithoutNode = deleteNode(root, from);
  
  // 2. Add to destination
  const destParts = destNorm.split('/').filter(Boolean);
  return updateInternal(fsWithoutNode, destParts, (destParent) => {
    if (destParent.type !== 'directory') throw new NotADirectoryError(to);
    if (destParent.readonly) throw new PermissionDeniedError(to);
    if (destParent.children?.some(c => c.name === srcNode.name)) throw new FileAlreadyExistsError(`${to}/${srcNode.name}`);
    
    return {
      ...destParent,
      children: [...(destParent.children || []), srcNode]
    };
  });
}

/**
 * Private helper for immutable deep updates.
 */
function updateInternal(node: FileNode, pathParts: string[], transform: (node: FileNode) => FileNode): FileNode {
  if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'C:' && node.name === 'C:')) {
    return transform(node);
  }

  const [current, ...rest] = pathParts[0] === 'C:' ? pathParts.slice(1) : pathParts;
  
  const childIndex = node.children?.findIndex(c => c.name === current);
  if (childIndex === -1 || childIndex === undefined) throw new FileNotFoundError(current);

  const newChildren = [...(node.children || [])];
  newChildren[childIndex] = updateInternal(newChildren[childIndex], rest, transform);

  return { ...node, children: newChildren };
}

/**
 * UI Helper: Returns names of children.
 */
export function listDirectory(root: FileNode, path: string): string[] {
  const node = resolvePath(root, path);
  if (node.type !== 'directory') throw new NotADirectoryError(path);
  return node.children?.map(c => c.name) || [];
}

/**
 * UI Helper: Returns file content.
 */
export function readContent(root: FileNode, path: string): string {
  const node = resolvePath(root, path);
  if (node.type !== 'file') throw new PermissionDeniedError(path);
  return node.content || '';
}

/**
 * Checks if a path points to a directory.
 */
export function isDirectory(root: FileNode, path: string): boolean {
  try {
    const node = resolvePath(root, path);
    return node.type === 'directory';
  } catch {
    return false;
  }
}
