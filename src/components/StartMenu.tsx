import React from 'react';
import { 
  Globe, Mail, MessageSquare, Play, 
  Settings, Search, HelpCircle, LogOut, 
  Power, Folder, FileText, Image as ImageIcon, 
  Music, Computer, HardDrive
} from 'lucide-react';

interface StartMenuProps {
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  return (
    <div 
      className="absolute bottom-full left-0 w-[380px] bg-[#1D5ADA] rounded-t-lg shadow-2xl flex flex-col z-[10000] border-t-2 border-l-2 border-r-2 border-[#1B4B1C] overflow-hidden select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="h-14 bg-gradient-to-r from-[#1D5ADA] via-[#4287F5] to-[#1D5ADA] p-2 flex items-center gap-3 border-b border-[#0A3D91]">
        <div className="w-10 h-10 rounded-sm border-2 border-white/50 bg-[#F65314] flex items-center justify-center overflow-hidden">
           {/* Placeholder for User Icon */}
           <div className="grid grid-cols-2 gap-0.5 w-6 h-6 rotate-45">
             <div className="bg-white/80 w-full h-full"></div>
             <div className="bg-white/40 w-full h-full"></div>
             <div className="bg-white/40 w-full h-full"></div>
             <div className="bg-white/80 w-full h-full"></div>
           </div>
        </div>
        <span className="text-white font-bold text-lg drop-shadow-md">AS</span>
      </div>

      {/* Main Content */}
      <div className="flex bg-white flex-1 overflow-hidden" style={{ minHeight: '400px' }}>
        {/* Left Column (Programs) */}
        <div className="w-[55%] flex flex-col p-1.5 gap-0.5 border-r border-[#91B2E6]">
          {/* Top Programs */}
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <Globe className="text-[#2F71CD] group-hover:text-white w-8 h-8" />
            <div className="flex flex-col">
              <span className="font-bold text-[13px]">Internet</span>
              <span className="text-[11px] text-gray-500 group-hover:text-blue-100">Internet Explorer</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <Mail className="text-[#2F71CD] group-hover:text-white w-8 h-8" />
            <div className="flex flex-col">
              <span className="font-bold text-[13px]">E-mail</span>
              <span className="text-[11px] text-gray-500 group-hover:text-blue-100">Outlook Express</span>
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 my-1 mx-2" />

          {/* Frequent Programs */}
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <MessageSquare className="text-orange-500 group-hover:text-white w-8 h-8" />
            <span className="text-[13px]">MSN</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <Play className="text-blue-600 group-hover:text-white w-8 h-8" />
            <span className="text-[13px]">Windows Media Player</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <div className="w-8 h-8 flex items-center justify-center">
               <div className="w-6 h-6 bg-green-500 rounded-full" />
            </div>
            <span className="text-[13px]">Windows Messenger</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
             <Globe className="text-gray-400 group-hover:text-white w-8 h-8" />
            <span className="text-[13px]">Tour Windows XP</span>
          </div>

          <div className="flex-1" />

          {/* All Programs */}
          <div className="h-[1px] bg-gray-300 my-1" />
          <div className="flex items-center justify-center gap-2 py-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group">
            <span className="font-bold text-[13px]">All Programs</span>
            <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
               <div className="border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1" />
            </div>
          </div>
        </div>

        {/* Right Column (Places) */}
        <div className="w-[45%] bg-[#D3E5FA] flex flex-col p-1.5 gap-0.5 border-l border-white shadow-[inset_1px_0_1px_rgba(255,255,255,0.8)]">
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <Folder className="text-[#D39943] group-hover:text-white w-6 h-6" />
            <span className="text-[12px] font-bold">My Documents</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm justify-between pr-4">
            <div className="flex items-center gap-2">
              <FileText className="text-[#8BA1C1] group-hover:text-white w-6 h-6" />
              <span className="text-[12px] font-bold">My Recent Documents</span>
            </div>
            <div className="border-l-[4px] border-l-black group-hover:border-l-white border-y-[4px] border-y-transparent" />
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <ImageIcon className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px] font-bold">My Pictures</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <Music className="text-[#D39943] group-hover:text-white w-6 h-6" />
            <span className="text-[12px] font-bold">My Music</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <Computer className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px] font-bold">My Computer</span>
          </div>

          <div className="h-[1px] bg-[#91B2E6]/50 my-1 mx-2 shadow-[0_1px_0_rgba(255,255,255,0.5)]" />

          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <Settings className="text-[#8BA1C1] group-hover:text-white w-6 h-6" />
            <span className="text-[12px]">Control Panel</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
             <div className="w-6 h-6 bg-[#4176CF] rounded-[2px]" />
            <span className="text-[12px]">Printers and Faxes</span>
          </div>

          <div className="h-[1px] bg-[#91B2E6]/50 my-1 mx-2 shadow-[0_1px_0_rgba(255,255,255,0.5)]" />

          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <HelpCircle className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px]">Help and Support</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <Search className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px]">Search</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm">
            <HardDrive className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px]">Run...</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-10 bg-gradient-to-r from-[#1D5ADA] via-[#4287F5] to-[#1D5ADA] p-1.5 flex items-center justify-end gap-4 border-t border-[#0A3D91]">
        <button className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors group">
          <div className="w-4 h-4 bg-orange-400 rounded-sm flex items-center justify-center">
             <div className="w-2 h-2 border-2 border-white rotate-45" />
          </div>
          <span className="text-white text-[12px] group-hover:underline">Log Off</span>
        </button>
        <button className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors group">
          <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center">
             <Power className="text-white w-3 h-3" />
          </div>
          <span className="text-white text-[12px] group-hover:underline">Turn Off Computer</span>
        </button>
      </div>
    </div>
  );
};
