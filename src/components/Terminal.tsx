import React, { useState, useEffect, useRef } from 'react';
import { SystemState } from '../core/types';
import { systemBus } from '../core/eventBus';
import { listDirectory, readContent } from '../core/vfs';

interface TerminalProps {
  systemState: SystemState;
}

export const Terminal: React.FC<TerminalProps> = ({ systemState }) => {
  const [history, setHistory] = useState<string[]>(['Microsoft Windows XP [Version 5.1.2600]', '(C) Copyright 1985-2001 Microsoft Corp.', '']);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentDir = systemState.currentPath;

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
        setHistory(prev => [...prev, 
          'Available commands:', 
          '  ls [path]      List files', 
          '  cd <path>      Change directory', 
          '  cat <file>     Read file content', 
          '  mkdir <name>   Create directory', 
          '  touch <name>   Create file', 
          '  rm <path>      Delete file/empty dir', 
          '  ps             List processes', 
          '  kill <pid>     Stop process', 
          '  priority <pid> <L|N|H>  Set process priority',
          '  crash <pid>    Force deterministic crash',
          '  export         Export system state snapshot',
          '  clear          Clear screen', 
          '  whoami         Identity'
        ]);
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
          const files = listDirectory(systemState.fileSystem, path === '.' ? currentDir : path);
          setHistory(prev => [...prev, files.join('  ') || '(empty directory)']);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          setHistory(prev => [...prev, `ls: ${message}`]);
        }
        break;
      }
      case 'cd': {
        const path = args[0] || 'C:/Users/Arsh';
        systemBus.emit({ type: 'FS_CD', payload: { path } });
        break;
      }
      case 'cat': {
        try {
          const path = args[0];
          if (!path) {
            setHistory(prev => [...prev, 'Usage: cat <filename>']);
          } else {
            const content = readContent(systemState.fileSystem, path);
            setHistory(prev => [...prev, content]);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          setHistory(prev => [...prev, `cat: ${message}`]);
        }
        break;
      }
      case 'mkdir': {
        const path = args[0];
        if (path) systemBus.emit({ type: 'FS_CREATE_DIR', payload: { path } });
        else setHistory(prev => [...prev, 'Usage: mkdir <name>']);
        break;
      }
      case 'touch': {
        const path = args[0];
        if (path) systemBus.emit({ type: 'FS_CREATE_FILE', payload: { path } });
        else setHistory(prev => [...prev, 'Usage: touch <name>']);
        break;
      }
      case 'rm': {
        const path = args[0];
        if (path) systemBus.emit({ type: 'FS_DELETE', payload: { path } });
        else setHistory(prev => [...prev, 'Usage: rm <path>']);
        break;
      }
      case 'ps': {
        const header = 'PID    NAME         CPU    MEM';
        const rows = systemState.processes.map(p => 
          `${p.pid.toString().padEnd(6)} ${p.name.padEnd(12)} ${p.cpu.toFixed(1)}%   ${p.memory.toFixed(1)}MB`
        );
        setHistory(prev => [...prev, header, ...rows]);
        break;
      }
      case 'kill': {
        const pid = parseInt(args[0]);
        if (!isNaN(pid)) systemBus.emit({ type: 'PROC_KILL', payload: { pid } });
        else setHistory(prev => [...prev, 'Usage: kill <pid>']);
        break;
      }
      case 'priority': {
        const pid = parseInt(args[0]);
        const level = args[1]?.toUpperCase();
        const map: Record<string, 'LOW' | 'NORMAL' | 'HIGH'> = { L: 'LOW', N: 'NORMAL', H: 'HIGH' };
        if (!isNaN(pid) && map[level]) {
          systemBus.emit({ type: 'PROC_PRIORITY', payload: { pid, priority: map[level] } });
        } else {
          setHistory(prev => [...prev, 'Usage: priority <pid> <L|N|H>']);
        }
        break;
      }
      case 'crash': {
        const pid = parseInt(args[0]);
        if (!isNaN(pid)) {
          systemBus.emit({ type: 'PROC_CRASH', payload: { pid, reason: 'Manual override: SIGSEGV' } });
        } else {
          setHistory(prev => [...prev, 'Usage: crash <pid>']);
        }
        break;
      }
      case 'export': {
        const state = JSON.stringify(systemState, null, 2);
        const blob = new Blob([state], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `xp_state_v${systemState.version}_${Date.now()}.json`;
        a.click();
        setHistory(prev => [...prev, 'System state exported to JSON.']);
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
      className="bg-black text-[#CCCCBB] font-mono p-2 h-full flex flex-col overflow-hidden text-sm cursor-text"
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
