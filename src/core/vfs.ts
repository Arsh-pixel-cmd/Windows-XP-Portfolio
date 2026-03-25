// src/core/vfs.ts
import { FileNode, FileNodeType } from './types';

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

export class FileLockedError extends VfsError {
  constructor(path: string, pid: number) {
    super('ELOCKED', `File is locked by process ${pid}: ${path}`);
  }
}

const NOW = Date.now();

export function normalizePath(path: string): string {
  let p = path.replace(/\\/g, '/');
  const parts = p.split('/').filter(Boolean);
  const stack: string[] = [];
  
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (stack.length > 1) stack.pop();
    } else {
      stack.push(part);
    }
  }
  
  return stack.join('/');
}

export function joinPath(base: string, target: string): string {
  if (target.startsWith('C:')) return normalizePath(target);
  return normalizePath(`${base}/${target}`);
}

const createNode = (name: string, type: FileNodeType, content?: string, readonly?: boolean): FileNode => ({
  name,
  type,
  content,
  readonly,
  createdAt: NOW,
  updatedAt: NOW,
  children: type === 'directory' ? [] : undefined
});

export const INITIAL_FS: FileNode = {
  ...createNode('C:', 'directory', undefined, true),
  children: [
    {
      ...createNode('Users', 'directory'),
      children: [
        {
          ...createNode('Arsh', 'directory'),
          children: [
            {
              ...createNode('Documents', 'directory'),
              children: [
                {
                  ...createNode('Resume.txt', 'file', 'Arsh Mishra - Senior Software Engineer\nSystems Architect | Full-Stack Developer'),
                }
              ]
            },
            {
              ...createNode('Desktop', 'directory'),
              children: [
                {
                  ...createNode('Resume.txt', 'file', `**ARSH MISHRA**
+91 9519217700 | arshmishra37@gmail.com
LinkedIn: linkedin.com/in/arsh-mishra-030093325
GitHub: github.com/Arsh-pixel-cmd

**EDUCATION**
- **B.Tech in Computer Science**, IILM University | 2024 – 2028 (Expected) | **9.32 / 10 CGPA**
- **Intermediate (12th)**, CBSE | 2024 | 61%
- **High School (10th)**, ICSE | 2022 | 75%

**WORK EXPERIENCE**
**Full-Stack Developer Intern** | SGCA Technologies Pvt. Ltd., Greater Noida | Mar 2025 – May 2025
- Engineered HR Nexus, an enterprise-grade HR SaaS platform with JWT authentication and Role-Based Access Control (RBAC).
- Developed robust REST APIs for payroll management, automated attendance, and leave approval workflows using Node.js/Express.
- Optimized backend efficiency, reducing API response times by 30–40% through query optimization and caching.
- Enhanced frontend performance, improving dashboard load times by 25%.

**PROJECTS**
**SmartSpend – AI Expense Management System** | Mar 2026 (Play Store Launch: Mid March 2026)
- Built a cross-platform AI-native expense tracker using Next.js 16 and Capacitor.
- Developed an AI-driven PDF import pipeline specialized in bank statements, processing 30–50 pages in 10–15 seconds.
- Integrated Groq and Gemini multimodal models for high-accuracy transaction extraction (92–95%).
- Utilized Supabase with PostgreSQL RLS for secure, scalable data storage; supporting 100–500 beta users.
- GitHub: github.com/Arsh-pixel-cmd/expense-tracker

**Jyotix-Astro – AI Astrology Platform** | Deployed
- Architected a serverless full-stack astrology platform using Next.js App Router and Firebase BaaS.
- Implemented a conversational AI astrologer using Gemini via GenKit for personalized readings.
- Integrated secure authentication, Razorpay for subscriptions, and multi-language support (English, Hindi, Urdu).
- Live: jyotix-astro.vercel.app

**DevLens Ultra – Browser Extension** | In Progress
- Developing a Manifest V3 Chrome extension that reverse-engineers CSS rules into React + Tailwind code.
- Optimized performance to maintain 60FPS using requestIdleCallback during complex DOM traversals.
- Implemented logic to filter 300+ browser default styles, extracting only meaningful design tokens.
- GitHub: github.com/Arsh-pixel-cmd/DevLens

**SKILLS**
- **Languages:** JavaScript, TypeScript, Python, Java, C++, C, C#
- **Frameworks:** React, Next.js, Node.js, Express.js, Tailwind CSS
- **Databases:** MongoDB, PostgreSQL, MySQL, Firebase Firestore
- **Cloud/DevOps:** AWS, Vercel, Supabase, Render, Netlify, Docker, GitHub Actions
- **CS Fundamentals:** Algorithms, OOP, DBMS, Computer Networks, Complexity Analysis

**ACHIEVEMENTS**
- Top 10/85 – Foodoscope (IIIT Delhi).
- Top 40/70 – HackOClock 2.0 (IILM University).
- Received Letter of Recommendation for technical excellence.

**LEADERSHIP**
**Lead Developer – NextGenX AI Club** | Oct 2025 – Present
- Leading a team of 5 developers to build the club’s digital infrastructure, including the official website and a DSA training platform.
- Enabled over 250+ members through technical mentorship and processed 500+ registrations for club events.
- Streamlined event management, reducing manual effort by 60% and improving platform load times by 35%.

**VOLUNTEERING**
**Student Volunteer – Nexus of Nerds** | May 2025 – Nov 2025
- Contributed to event planning, outreach, and community engagement for the tech society.
- Supported technical sessions and workshops across a network of 50+ universities.`),
                }
              ]
            }
          ]
        }
      ]
    },
    {
      ...createNode('System', 'directory', undefined, true),
      children: [
        {
          ...createNode('logs.txt', 'file', '[INFO] System Kernel initialized\n', true),
        }
      ]
    }
  ]
};

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
 * Pure transformation helpers
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

  return { ...node, children: newChildren, updatedAt: Date.now() };
}

export function createFile(root: FileNode, path: string, content: string = ''): FileNode {
  const normalized = normalizePath(path);
  const pParts = normalized.split('/').filter(Boolean);
  const fileName = pParts.pop()!;
  
  return updateInternal(root, pParts, (parent) => {
    if (parent.readonly) throw new PermissionDeniedError(parent.name);
    if (parent.children?.some(c => c.name === fileName)) throw new FileAlreadyExistsError(path);
    
    return {
      ...parent,
      children: [...(parent.children || []), createNode(fileName, 'file', content)]
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
      children: [...(parent.children || []), createNode(dirName, 'directory')]
    };
  });
}

export function writeFile(root: FileNode, path: string, content: string, pid?: number): FileNode {
  const normalized = normalizePath(path);
  const pParts = normalized.split('/').filter(Boolean);
  
  return updateInternal(root, pParts, (node) => {
    if (node.readonly) throw new PermissionDeniedError(path);
    if (node.type !== 'file') throw new PermissionDeniedError(path);
    if (node.lockedBy && node.lockedBy !== pid) throw new FileLockedError(path, node.lockedBy);
    
    return { ...node, content, updatedAt: Date.now() };
  });
}

export function setLock(root: FileNode, path: string, pid: number | undefined): FileNode {
  const normalized = normalizePath(path);
  const pParts = normalized.split('/').filter(Boolean);
  
  return updateInternal(root, pParts, (node) => {
    if (node.type !== 'file') throw new PermissionDeniedError(path);
    if (pid && node.lockedBy && node.lockedBy !== pid) throw new FileLockedError(path, node.lockedBy);
    return { ...node, lockedBy: pid };
  });
}

export function releaseAllLocks(node: FileNode, pid: number): FileNode {
  if (node.lockedBy === pid) {
    node = { ...node, lockedBy: undefined };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map(c => releaseAllLocks(c, pid))
    };
  }
  return node;
}

export function deleteNode(root: FileNode, path: string): FileNode {
  const normalized = normalizePath(path);
  if (normalized === 'C:') throw new PermissionDeniedError('Cannot delete root');
  const pParts = normalized.split('/').filter(Boolean);
  const targetName = pParts.pop()!;
  
  return updateInternal(root, pParts, (parent) => {
    const target = parent.children?.find(c => c.name === targetName);
    if (!target) throw new FileNotFoundError(path);
    if (target.readonly) throw new PermissionDeniedError(path);
    if (target.lockedBy) throw new FileLockedError(path, target.lockedBy);
    if (target.type === 'directory' && (target.children?.length || 0) > 0) throw new DirectoryNotEmptyError(path);
    
    return {
      ...parent,
      children: parent.children?.filter(c => c.name !== targetName)
    };
  });
}

export function moveNode(root: FileNode, from: string, to: string): FileNode {
  const srcNode = resolvePath(root, from);
  if (srcNode.lockedBy) throw new FileLockedError(from, srcNode.lockedBy);
  const fsWithoutNode = deleteNode(root, from);
  const destParts = normalizePath(to).split('/').filter(Boolean);
  
  return updateInternal(fsWithoutNode, destParts, (destParent) => {
    if (destParent.type !== 'directory') throw new NotADirectoryError(to);
    return {
      ...destParent,
      children: [...(destParent.children || []), srcNode]
    };
  });
}

export function listDirectory(root: FileNode, path: string): string[] {
  const node = resolvePath(root, path);
  if (node.type !== 'directory') throw new NotADirectoryError(path);
  return node.children?.map(c => c.name) || [];
}

export function readContent(root: FileNode, path: string): string {
  const node = resolvePath(root, path);
  if (node.type === 'directory') throw new PermissionDeniedError(path);
  return node.content || '';
}
