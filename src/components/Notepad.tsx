import React, { useState, useRef, useEffect } from 'react';
import { Process, SystemState } from '../core/types';
import { systemBus } from '../core/eventBus';
import { resolvePath } from '../core/vfs';

interface NotepadProps {
  process: Process;
  systemState: SystemState;
}

export const Notepad: React.FC<NotepadProps> = ({ process, systemState }) => {
  const filePath = (typeof process.params?.filePath === 'string' && process.params.filePath)
    ? process.params.filePath
    : 'C:/Users/Arsh/Documents/note.txt';

  const [content, setContent] = useState<string>(() => {
    try {
      const file = resolvePath(systemState.fileSystem, filePath);
      return file.type === 'file' ? (file.content || '') : '';
    } catch {
      return '';
    }
  });

  const [isReadOnly] = useState<boolean>(() => {
    try {
      const file = resolvePath(systemState.fileSystem, filePath);
      return file.type === 'file' && Boolean(file.lockedBy && file.lockedBy !== process.pid);
    } catch {
      return false;
    }
  });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (filePath) {
      try {
        const file = resolvePath(systemState.fileSystem, filePath);
        if (file.type === 'file') {
          // Try to lock the file
          if (file.lockedBy && file.lockedBy !== process.pid) {
            systemBus.emit({
              type: 'SYS_LOG',
              payload: { 
                id: `lock-${Date.now()}`,
                timestamp: Date.now(),
                level: 'WARN', 
                message: `File ${filePath} is locked by PID ${file.lockedBy}. Opening in read-only mode.` 
              }
            });
          } else {
            systemBus.emit({
              type: 'FS_LOCK',
              payload: { path: filePath, pid: process.pid }
            });
          }
        }
      } catch (e) {
        console.error('Failed to load file into notepad', e);
      }
    }

    return () => {
      // Release lock on unmount
      systemBus.emit({
        type: 'FS_UNLOCK',
        payload: { path: filePath, pid: process.pid }
      });
    };
  }, [filePath, process.pid, systemState.fileSystem]);

  const handleSave = () => {
    if (isReadOnly) return;
    systemBus.emit({
      type: 'FS_WRITE',
      payload: { path: filePath, content, pid: process.pid }
    });
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      textAreaRef.current?.select();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-text">
      {/* Menu Bar */}
      <div className="flex bg-[#ECE9D8] border-b border-gray-300 px-1 py-0.5 text-xs font-tahoma">
        <div className="group relative px-2 py-0.5 hover:bg-[#316AC5] hover:text-white cursor-default">
          File
          <div className="hidden group-hover:block absolute top-full left-0 bg-[#ECE9D8] border border-gray-400 shadow-md py-1 min-w-[120px] text-black z-50">
            <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={() => setContent('')}>New</div>
            <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={handleSave}>Save (Ctrl+S)</div>
            <div className="h-[1px] bg-gray-300 my-1 mx-1" />
            <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={() => systemBus.emit({ type: 'PROC_KILL', payload: { pid: process.pid } })}>Exit</div>
          </div>
        </div>
        <div className="group relative px-2 py-0.5 hover:bg-[#316AC5] hover:text-white cursor-default">
          Edit
          <div className="hidden group-hover:block absolute top-full left-0 bg-[#ECE9D8] border border-gray-400 shadow-md py-1 min-w-[120px] text-black z-50">
            <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={handleCopyAll}>Copy All</div>
            <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={() => setContent('')}>Clear</div>
          </div>
        </div>
        <div className="px-2 py-0.5 opacity-50 cursor-default">Format</div>
        <div className="px-2 py-0.5 opacity-50 cursor-default">Help</div>
        <div className="flex-1" />
        <div className="px-2 py-0.5 text-gray-400 italic bg-gray-100 rounded-sm border border-gray-200">
           {filePath}
        </div>
      </div>
      
      {/* Text Area */}
      <textarea
        ref={textAreaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={isReadOnly}
        className={`flex-1 p-1 resize-none focus:outline-none font-mono text-sm leading-tight text-black selection:bg-[#316AC5] selection:text-white ${isReadOnly ? 'bg-gray-50 text-gray-600' : 'bg-white'}`}
        spellCheck={false}
      />
    </div>
  );
};

export default Notepad;
