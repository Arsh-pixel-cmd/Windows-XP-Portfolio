import React from 'react';
import { Folder, Image as ImageIcon, FileCode2, Search, CornerUpLeft } from 'lucide-react';

const projects = [
  { id: 1, title: 'Winamp Skin', type: 'image' },
  { id: 2, title: 'Space Cadet Clone', type: 'code' },
  { id: 3, title: 'Geocities Page', type: 'folder' },
  { id: 4, title: 'Clippy AI', type: 'code' },
  { id: 5, title: 'Minesweeper.exe', type: 'code' },
];

export const Projects = () => {
  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Explorer Toolbar */}
      <div className="bg-[#ECE9D8] flex flex-col border-b border-[#D5D2C1]">
        <div className="flex gap-3 px-2 py-0.5 text-xs">
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">File</span>
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Edit</span>
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">View</span>
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Favorites</span>
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Tools</span>
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Help</span>
        </div>
        <div className="flex items-center gap-4 px-2 py-1 border-t border-white/80 bg-[#ECE9D8] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
           <div className="flex items-center gap-1 text-gray-800 hover:text-black cursor-pointer group">
             <div className="w-8 h-8 rounded-full border border-transparent group-hover:border-gray-400 group-hover:bg-white flex items-center justify-center shadow-sm">
                <CornerUpLeft size={16} className="text-green-600" />
             </div>
             <span className="text-sm">Back</span>
           </div>
           <div className="flex items-center gap-1 text-gray-800 hover:text-black cursor-pointer group">
             <div className="w-8 h-8 rounded-full border border-transparent group-hover:border-gray-400 group-hover:bg-white flex items-center justify-center shadow-sm">
                <Search size={16} className="text-blue-600" />
             </div>
             <span className="text-sm">Search</span>
           </div>
           <div className="flex items-center gap-1 text-gray-800 hover:text-black cursor-pointer group">
             <div className="w-8 h-8 rounded-full border border-transparent group-hover:border-gray-400 group-hover:bg-white flex items-center justify-center shadow-sm">
                <Folder size={16} className="text-yellow-500" fill="currentColor" />
             </div>
             <span className="text-sm">Folders</span>
           </div>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 border-t border-white/80 border-b border-[#D5D2C1] bg-[#ECE9D8]">
           <span className="text-xs text-gray-600">Address</span>
           <div className="flex-1 bg-white border border-[#7A96DF] px-2 py-0.5 text-xs flex items-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
             <Folder size={14} className="text-yellow-500 mr-2" fill="currentColor" /> C:\Documents and Settings\User\My Documents\Projects
           </div>
        </div>
      </div>
      
      {/* Left pane & Right pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Pane - Common Tasks */}
        <div className="w-[200px] bg-gradient-to-b from-[#7BA2E7] to-[#6375D6] hidden md:flex flex-col p-3 gap-3 border-r border-[#7A96DF] overflow-y-auto shadow-[inset_-1px_0_2px_rgba(0,0,0,0.1)]">
           <div className="bg-white/10 rounded overflow-hidden shadow-[1px_1px_3px_rgba(0,0,0,0.2)] border border-[#7A96DF]">
             <div className="bg-gradient-to-r from-[#F0F4FA] to-[#D5E1F9] px-2 py-1.5 text-[#0C327D] font-bold text-xs flex justify-between items-center cursor-pointer">
               File and Folder Tasks
               <span className="bg-white/50 w-4 h-4 rounded-full flex items-center justify-center text-[10px] shadow-sm">^</span>
             </div>
             <div className="p-3 text-white text-xs flex flex-col gap-2.5 bg-[#F6F8FC]">
               <div className="hover:underline cursor-pointer flex items-center gap-2 text-[#0C327D]">
                 <Folder size={14} className="text-yellow-500" fill="currentColor" /> Make a new folder
               </div>
               <div className="hover:underline cursor-pointer flex items-center gap-2 text-[#0C327D]">
                 <ImageIcon size={14} className="text-blue-500" /> Publish this folder
               </div>
               <div className="hover:underline cursor-pointer flex items-center gap-2 text-[#0C327D]">
                 <FileCode2 size={14} className="text-gray-500" /> Share this folder
               </div>
             </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 bg-white overflow-auto flex content-start flex-wrap gap-6">
          {projects.map(proj => (
            <div key={proj.id} className="w-[80px] flex flex-col items-center gap-1 group cursor-pointer">
              <div className="w-14 h-14 flex items-center justify-center group-hover:bg-blue-500/10 rounded border border-transparent group-hover:border-blue-500/30">
                {proj.type === 'folder' && <Folder size={48} className="text-yellow-400 drop-shadow-sm" fill="currentColor" />}
                {proj.type === 'image' && <ImageIcon size={48} className="text-blue-400 drop-shadow-sm" />}
                {proj.type === 'code' && <FileCode2 size={48} className="text-gray-500 drop-shadow-sm" />}
              </div>
              <span className="text-[11px] text-center leading-tight group-hover:bg-[#316AC5] group-hover:text-white px-1 rounded line-clamp-2">
                {proj.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};