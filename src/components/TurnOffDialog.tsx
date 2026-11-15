import React from 'react';
import { Power, RotateCcw, Moon } from 'lucide-react';

interface TurnOffDialogProps {
  onStandBy: () => void;
  onTurnOff: () => void;
  onRestart: () => void;
  onCancel: () => void;
}

export const TurnOffDialog: React.FC<TurnOffDialogProps> = ({ onStandBy, onTurnOff, onRestart, onCancel }) => {
  return (
    <div 
      className="fixed inset-0 z-[25000] bg-black/60 backdrop-grayscale flex items-center justify-center font-tahoma select-none"
      onClick={onCancel}
    >
      <div 
        className="w-[380px] bg-[#00138C] border-2 border-white/60 shadow-2xl rounded-[3px] p-[2px] overflow-hidden"
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
          <span className="text-xs text-white font-bold drop-shadow">Turn off computer</span>
        </div>

        {/* Action Buttons Body */}
        <div className="bg-gradient-to-b from-[#0039B5] via-[#002890] to-[#001A70] py-6 px-6 flex items-center justify-between gap-2 text-center">
          {/* Stand By */}
          <button
            onClick={onStandBy}
            className="flex flex-col items-center gap-2 group focus:outline-none flex-1"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-white/80 shadow-lg flex items-center justify-center group-hover:scale-105 active:translate-y-0.5 transition-transform">
              <Moon size={20} className="text-white drop-shadow" />
            </div>
            <span className="text-xs text-white font-bold group-hover:underline drop-shadow">
              Stand By
            </span>
          </button>

          {/* Turn Off */}
          <button
            onClick={onTurnOff}
            className="flex flex-col items-center gap-2 group focus:outline-none flex-1"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-red-500 to-red-700 border-2 border-white/80 shadow-lg flex items-center justify-center group-hover:scale-105 active:translate-y-0.5 transition-transform">
              <Power size={22} className="text-white drop-shadow" />
            </div>
            <span className="text-xs text-white font-bold group-hover:underline drop-shadow">
              Turn Off
            </span>
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="flex flex-col items-center gap-2 group focus:outline-none flex-1"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-green-500 to-green-700 border-2 border-white/80 shadow-lg flex items-center justify-center group-hover:scale-105 active:translate-y-0.5 transition-transform">
              <RotateCcw size={20} className="text-white drop-shadow" />
            </div>
            <span className="text-xs text-white font-bold group-hover:underline drop-shadow">
              Restart
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
