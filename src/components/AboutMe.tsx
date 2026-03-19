import React from 'react';

export const AboutMe = () => {
  return (
    <div className="flex flex-col h-full bg-white text-black font-mono text-sm">
      {/* Notepad Menu */}
      <div className="flex gap-3 px-2 py-0.5 bg-[#ECE9D8] border-b border-[#D5D2C1] text-xs font-sans select-none">
        <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">File</span>
        <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Edit</span>
        <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Format</span>
        <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">View</span>
        <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Help</span>
      </div>
      <div className="p-4 flex-1 overflow-auto outline-none" contentEditable suppressContentEditableWarning>
        <p>=========================================</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RESUME / ABOUT ME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>=========================================</p>
        <br/>
        <p>Hello! I'm a Senior Frontend Developer</p>
        <p>specializing in retro UI/UX design.</p>
        <br/>
        <p>## SKILLS</p>
        <p>- React & Tailwind CSS</p>
        <p>- Nostalgia-Driven Development (NDD)</p>
        <p>- Pixel-perfect UI recreations</p>
        <p>- Windows XP & 95 Aesthetics</p>
        <br/>
        <p>## EXPERIENCE</p>
        <p>&gt; Senior Retro Developer @ RetroCorp</p>
        <p>&nbsp;&nbsp;* Recreated the Bliss wallpaper in CSS</p>
        <p>&nbsp;&nbsp;* Made the Start button thunk again</p>
        <br/>
        <p>_</p>
      </div>
    </div>
  );
};