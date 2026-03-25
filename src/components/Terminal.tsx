import React, { useState, useEffect, useRef } from 'react';
import { Process, SystemState } from '../core/types';
import { systemBus } from '../core/eventBus';
import { resolvePath, FileSystemError } from '../core/vfs';

interface TerminalProps {
  process: Process;
  systemState: SystemState;
}

export const Terminal: React.FC<TerminalProps> = ({ systemState }) => {
  const [history, setHistory] = useState<string[]>(['Microsoft Windows XP [Version 5.1.2600]', '(C) Copyright 1985-2001 Microsoft Corp.', '']);
  const [currentDir, setCurrentDir] = useState('C:/Users/Arsh');
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCmd = input.trim();
    if (!fullCmd) return;

    setCmdHistory(prev => [fullCmd, ...prev]);
    setHistoryIndex(-1);

    const parts = fullCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    setHistory(prev => [...prev, `${currentDir}> ${fullCmd}`]);

    switch (cmd) {
      case 'help':
        setHistory(prev => [...prev, 'Available commands:', '  ls [path]      List files', '  cd <path>      Change directory', '  cat <file>     Read file content', '  ps             List running processes', '  kill <pid>     Terminate a process', '  clear          Clear screen', '  whoami         System identity']);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'whoami':
        setHistory(prev => [...prev, 'arsh_mishra // systems_architect // kernel_mode']);
        break;
      case 'ls': {
        try {
          const path = args[0] || '.';
          const dir = resolvePath(systemState.fileSystem, path, currentDir);
          if (dir.type !== 'directory') {
            setHistory(prev => [...prev, `ls: ${path}: Not a directory`]);
          } else {
            const files = Object.keys(dir.children || {}).join('  ');
            setHistory(prev => [...prev, files || '(empty directory)']);
          }
        } catch (err: any) {
          setHistory(prev => [...prev, `ls: ${err.message}`]);
        }
        break;
      }
      case 'cd': {
        try {
          const path = args[0] || 'C:/Users/Arsh';
          const dir = resolvePath(systemState.fileSystem, path, currentDir);
          if (dir.type !== 'directory') {
            setHistory(prev => [...prev, `cd: ${path}: Not a directory`]);
          } else {
             // Basic path normalization for display
             const newPath = path.startsWith('C:') ? path : `${currentDir}/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
             setCurrentDir(newPath);
          }
        } catch (err: any) {
          setHistory(prev => [...prev, `cd: ${err.message}`]);
        }
        break;
      }
      case 'cat': {
        try {
          const path = args[0];
          if (!path) {
            setHistory(prev => [...prev, 'Usage: cat <filename>']);
            break;
          }
          const file = resolvePath(systemState.fileSystem, path, currentDir);
          if (file.type === 'directory') {
            setHistory(prev => [...prev, `cat: ${path}: Is a directory`]);
          } else {
            setHistory(prev => [...prev, file.content || '']);
          }
        } catch (err: any) {
          setHistory(prev => [...prev, `cat: ${err.message}`]);
        }
        break;
      }
      case 'ps': {
        const header = 'PID    NAME         STATUS      CPU    MEM';
        const rows = systemState.processes.map(p => 
          `${p.pid.toString().padEnd(6)} ${p.name.padEnd(12)} ${p.status.padEnd(10)} ${p.cpuUsage.toFixed(1)}%   ${p.memoryUsage.toFixed(1)}MB`
        );
        setHistory(prev => [...prev, header, ...rows]);
        break;
      }
      case 'kill': {
        const pid = parseInt(args[0]);
        if (isNaN(pid)) {
          setHistory(prev => [...prev, 'Usage: kill <pid>']);
        } else {
          systemBus.emit({ type: 'PROC_KILL', payload: { pid } });
          setHistory(prev => [...prev, `Sent SIGTERM to process ${pid}`]);
        }
        break;
      }
      case 'open': {
        const app = args[0]?.replace('.exe', '');
        if (app) {
           systemBus.emit({ type: 'PROC_START', payload: { appType: app, title: `${app}.exe` } });
        } else {
          setHistory(prev => [...prev, 'Usage: open <app_name>']);
        }
        break;
      }
      default:
        setHistory(prev => [...prev, `'${cmd}' is not recognized as an internal or external command.`]);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="bg-black text-[#CCCCBB] font-mono p-2 h-full flex flex-col overflow-hidden text-sm selection:bg-white selection:text-black cursor-text"
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      <div className="flex-1 overflow-auto custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className="min-h-[1.2rem] whitespace-pre-wrap">{line}</div>
        ))}
        <form onSubmit={handleCommand} className="flex items-center">
          <span className="mr-2 text-green-500">{currentDir}&gt;</span>
          <input
            id="term-input"
            autoFocus
            autoComplete="off"
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none flex-1 text-[#CCCCBB] font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
