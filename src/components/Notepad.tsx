import React, { useState, useRef, useEffect } from 'react';
import { Process, SystemState } from '../core/types';
import { systemBus } from '../core/eventBus';
import { resolvePath } from '../core/vfs';

interface NotepadProps {
  process: Process;
  systemState: SystemState;
}

export const Notepad: React.FC<NotepadProps> = ({ process, systemState }) => {
  const [content, setContent] = useState('');
  const [filePath] = useState(process.params?.filePath || 'C:/Users/Arsh/Documents/note.txt');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (process.params?.filePath) {
      try {
        const file = resolvePath(systemState.fileSystem, process.params.filePath);
        if (file.type === 'file') {
          setContent(file.content || '');
        }
      } catch (e) {
        console.error('Failed to load file into notepad', e);
      }
    }
  }, [process.params?.filePath, systemState.fileSystem]);

  const handleSave = () => {
    systemBus.emit({
      type: 'FS_WRITE',
      payload: { path: filePath, content }
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
        className="flex-1 p-1 resize-none focus:outline-none font-mono text-sm leading-tight text-black selection:bg-[#316AC5] selection:text-white"
        spellCheck={false}
      />
    </div>
  );
};

export default Notepad;
