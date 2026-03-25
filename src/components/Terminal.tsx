import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  onOpenWindow: (id: string) => void;
  dispatch: React.Dispatch<any>;
  windows: any[];
}

export const Terminal: React.FC<TerminalProps> = ({ onOpenWindow }) => {
  const [history, setHistory] = useState<string[]>(['Microsoft Windows XP [Version 5.1.2600]', '(C) Copyright 1985-2001 Microsoft Corp.', '']);
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

    const parts = fullCmd.toLowerCase().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);
    
    const newHistory = [...history, `C:\\Documents and Settings\\Arsh> ${fullCmd}`];

    switch (cmd) {
      case 'help':
        newHistory.push('Help Utility v1.0', 'Available commands:', '  help           Display this message', '  clear          Clear the screen', '  whoami         Display user info', '  ls             List desktop applications', '  open <app>     Open an application', '  kill <app>     Close an application', '  ps             List processes');
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'whoami':
        newHistory.push('arsh_mishra // senior_software_engineer // systems_architect');
        break;
      case 'ls':
        newHistory.push('Applications:', '  About.exe, Projects.exe, Systems.exe, Experiments.exe,', '  Resume.txt, Notepad.exe, SysMon.exe, Contact.exe');
        break;
      case 'open':
        if (args[0]) {
          const app = args[0].replace('.exe', '').replace('.txt', '');
          newHistory.push(`Attempting to spawn process: ${app}...`);
          onOpenWindow(app);
        } else {
          newHistory.push('Usage: open <application_name>');
        }
        break;
      case 'ps':
        newHistory.push('Active Processes:', ...args.map(a => `PID 1241: ${a}`));
        break;
      case 'exit':
        newHistory.push('System shutdown sequence initiated... Just kidding, use the [X] button.');
        break;
      default:
        newHistory.push(`'${cmd}' is not recognized as an internal or external command,`, 'operable program or batch file.');
    }

    setHistory(newHistory);
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
          <span className="mr-2 text-green-500">C:\&gt;</span>
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
