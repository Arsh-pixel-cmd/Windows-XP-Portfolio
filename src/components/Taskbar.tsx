import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface TaskbarProps {
  openWindows: { id: string; title: string; icon: React.ReactNode; active: boolean }[];
  onTaskClick: (id: string) => void;
  onStartClick: () => void;
  isStartMenuOpen: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({ openWindows, onTaskClick, onStartClick, isStartMenuOpen }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-[30px] bg-gradient-to-b from-[#245EDB] via-[#1447A8] to-[#1447A8] flex items-center select-none shadow-[0_-1px_2px_rgba(0,0,0,0.3)]">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onStartClick();
        }}
        className={`h-full px-3 flex items-center gap-1.5 rounded-r-2xl italic font-bold text-white text-[15px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),2px_0_3px_rgba(0,0,0,0.3)] border-r border-[#1B4B1C] transition-all font-trebuchet ${
          isStartMenuOpen 
            ? 'bg-[#215123] from-[#2B6D2D] to-[#3C913E] shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)]' 
            : 'bg-gradient-to-b from-[#3C913E] to-[#2B6D2D] hover:from-[#4AA84C] hover:to-[#338135]'
        }`} 
      >
        {/* Simple Windows Logo Fake */}
        <div className="grid grid-cols-2 gap-[1px] skew-y-6 skew-x-[-10deg] drop-shadow-sm w-4 h-4 ml-1">
           <div className="bg-[#F65314]"></div>
           <div className="bg-[#7CBB00]"></div>
           <div className="bg-[#00A1F1]"></div>
           <div className="bg-[#FFBB00]"></div>
        </div>
        <span className="pr-1 drop-shadow-md">start</span>
      </button>

      {/* Taskbar Items (Open Windows) */}
      <div className="flex-1 flex px-2 gap-1 overflow-hidden h-full py-[3px]">
        {openWindows.map(w => (
          <button
            key={w.id}
            onClick={() => onTaskClick(w.id)}
            className={`flex items-center gap-1.5 px-2 max-w-[150px] min-w-[80px] rounded-[3px] truncate text-xs text-white font-medium shadow-sm transition-all font-tahoma ${
          w.active
            ? 'bg-[#124296] border border-[#0F367A] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]'
            : 'bg-[#3A76DF] hover:bg-[#4882E4] border border-[#528CEF]'
        }`}
          >
            <span className="w-4 h-4 shrink-0 [&>svg]:w-full [&>svg]:h-full">{w.icon}</span>
            <span className="truncate">{w.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="h-full bg-gradient-to-b from-[#0F8CEB] to-[#0A62A6] px-3 flex items-center border-l border-[#0B5C9E] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),-1px_0_2px_rgba(0,0,0,0.2)_inset] text-white text-xs gap-3">
        {/* Notification Icons */}
        <div className="flex gap-1.5 items-center">
          <div className="w-3 h-3 bg-blue-200 rounded-full opacity-80 border border-blue-900 shadow-sm"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full opacity-80 border border-yellow-700 shadow-sm"></div>
        </div>
        <span className="drop-shadow-sm font-tahoma">
          {format(time, 'h:mm a')}
        </span>
      </div>
    </div>
  );
};