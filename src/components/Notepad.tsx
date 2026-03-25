import React, { useState, useRef } from 'react';

export const Notepad: React.FC = () => {
  const [content, setContent] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'note.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      textAreaRef.current?.select();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      // Browser handles native copy if text is selected
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-text">
      {/* Menu Bar */}
      <div className="flex bg-[#ECE9D8] border-b border-gray-300 px-1 py-0.5 text-xs font-tahoma">
        <div className="group relative px-2 py-0.5 hover:bg-[#316AC5] hover:text-white cursor-default">
          File
          <div className="hidden group-hover:block absolute top-full left-0 bg-[#ECE9D8] border border-gray-400 shadow-md py-1 min-w-[120px] text-black">
            <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={() => setContent('')}>New</div>
            <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={handleDownload}>Save As...</div>
            <div className="h-[1px] bg-gray-300 my-1 mx-1" />
            <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default opacity-50">Exit</div>
          </div>
        </div>
        <div className="group relative px-2 py-0.5 hover:bg-[#316AC5] hover:text-white cursor-default">
          Edit
          <div className="hidden group-hover:block absolute top-full left-0 bg-[#ECE9D8] border border-gray-400 shadow-md py-1 min-w-[120px] text-black">
            <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={handleCopyAll}>Copy All</div>
            <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={() => setContent('')}>Clear</div>
          </div>
        </div>
        <div className="px-2 py-0.5 hover:bg-[#316AC5] hover:text-white cursor-default">Format</div>
        <div className="px-2 py-0.5 hover:bg-[#316AC5] hover:text-white cursor-default">Help</div>
      </div>
      
      {/* Text Area */}
      <textarea
        ref={textAreaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-1 resize-none focus:outline-none font-mono text-sm leading-tight text-black"
        spellCheck={false}
      />
    </div>
  );
};

export default Notepad;
