import React from 'react';
import { Users, LogOut } from 'lucide-react';

interface LogOffDialogProps {
  onSwitchUser: () => void;
  onLogOff: () => void;
  onCancel: () => void;
}

export const LogOffDialog: React.FC<LogOffDialogProps> = ({ onSwitchUser, onLogOff, onCancel }) => {
  return (
    <div 
      className="fixed inset-0 z-[25000] bg-black/50 backdrop-grayscale flex items-center justify-center font-tahoma select-none"
      onClick={onCancel}
    >
      <div 
        className="w-[360px] bg-[#00138C] border-2 border-white/60 shadow-2xl rounded-[3px] p-[2px] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#001B6B] via-[#0A249D] to-[#001B6B] px-4 py-2 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter text-white">
              <span className="italic text-blue-300">Windows</span>
              <span className="text-orange-400 ml-1">XP</span>
            </span>
          </div>
          <span className="text-xs text-white font-bold drop-shadow">Log Off Windows</span>
        </div>

        {/* Action Buttons Body */}
        <div className="bg-gradient-to-b from-[#0039B5] via-[#002890] to-[#001A70] py-6 px-8 flex items-center justify-around gap-4 text-center">
          {/* Switch User */}
          <button
            onClick={onSwitchUser}
            className="flex flex-col items-center gap-2 group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 border-2 border-white/80 shadow-lg flex items-center justify-center group-hover:scale-105 active:translate-y-0.5 transition-transform">
              <Users size={22} className="text-white drop-shadow" />
            </div>
            <span className="text-xs text-white font-bold group-hover:underline drop-shadow">
              Switch User
            </span>
          </button>

          {/* Log Off */}
          <button
            onClick={onLogOff}
            className="flex flex-col items-center gap-2 group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-500 to-blue-700 border-2 border-white/80 shadow-lg flex items-center justify-center group-hover:scale-105 active:translate-y-0.5 transition-transform">
              <LogOut size={22} className="text-white drop-shadow ml-0.5" />
            </div>
            <span className="text-xs text-white font-bold group-hover:underline drop-shadow">
              Log Off
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-[#001B6B] via-[#0A249D] to-[#001B6B] px-4 py-2 flex justify-end border-t border-blue-900">
          <button
            onClick={onCancel}
            className="xp-button px-5 py-1 text-xs font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
