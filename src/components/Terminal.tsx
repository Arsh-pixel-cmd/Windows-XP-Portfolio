import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  onOpenProject?: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onOpenProject }) => {
  const [history, setHistory] = useState<string[]>(['Microsoft Windows XP [Version 5.1.2600]', '(C) Copyright 1985-2001 Microsoft Corp.', '']);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `C:\\Documents and Settings\\Arsh> ${input}`];

    switch (cmd) {
      case 'help':
        newHistory.push('Available commands: help, clear, whoami, ls, open projects, exit');
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'whoami':
        newHistory.push('arsh_mishra // full_stack_engineer // system_builder');
        break;
      case 'ls':
        newHistory.push('About.exe  Projects.exe  Systems.exe  Resume.txt  Contact.exe');
        break;
      case 'open projects':
        newHistory.push('Opening Projects.exe...');
        onOpenProject?.();
        break;
      case 'exit':
        newHistory.push('Use the [X] button to close the terminal.');
        break;
      default:
        newHistory.push(`'${cmd}' is not recognized as an internal or external command, operable program or batch file.`);
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div 
      className="bg-black text-[#CCCCBB] font-mono p-2 h-full flex flex-col overflow-hidden text-sm"
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      <div className="flex-1 overflow-auto custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className="min-h-[1.2rem] whitespace-pre-wrap">{line}</div>
        ))}
        <form onSubmit={handleCommand} className="flex">
          <span className="mr-2">C:\Documents and Settings\Arsh&gt;</span>
          <input
            id="term-input"
            autoFocus
            className="bg-transparent border-none outline-none flex-1 text-[#CCCCBB] font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
