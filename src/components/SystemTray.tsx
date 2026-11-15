// src/components/SystemTray.tsx
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { 
  Volume2, VolumeX, Shield, Wifi, 
  X, Calendar as CalendarIcon, Info 
} from 'lucide-react';
import { soundEffects } from '../core/soundEffects';

interface SystemTrayProps {
  onOpenApp?: (appType: string) => void;
}

export interface TrayNotification {
  id: string;
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export const SystemTray: React.FC<SystemTrayProps> = ({ onOpenApp }) => {
  const [time, setTime] = useState(new Date());
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [volume, setVolume] = useState(soundEffects.getVolume());
  const [isMuted, setIsMuted] = useState(!soundEffects.isEnabled());
  const [activeBalloon, setActiveBalloon] = useState<TrayNotification | null>(null);

  const trayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Show introductory notification balloon on load
  useEffect(() => {
    const balloonTimer = setTimeout(() => {
      soundEffects.playBalloon();
      setActiveBalloon({
        id: 'welcome-balloon',
        title: 'Welcome to Windows XP',
        message: 'Your system is fully operational. Open "Hints.exe" or click Start to explore projects and architecture.',
      });
    }, 3500);

    return () => clearTimeout(balloonTimer);
  }, []);

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEffects.setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      soundEffects.setEnabled(true);
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setEnabled(!nextMuted);
    if (!nextMuted) {
      soundEffects.playClick();
    }
  };

  const closePopups = () => {
    setIsVolumeOpen(false);
    setIsCalendarOpen(false);
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        closePopups();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div ref={trayRef} className="relative h-full flex items-center">
      {/* Notification Balloon */}
      {activeBalloon && (
        <div 
          className="absolute bottom-full right-3 mb-2 w-72 bg-[#FFFFE1] text-gray-800 border-2 border-black/80 rounded-md shadow-2xl p-3 z-[35000] font-tahoma text-xs animate-in fade-in slide-in-from-bottom-2 select-text"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-gray-300 font-bold text-gray-900">
            <div className="flex items-center gap-1.5 text-blue-800">
              <Info size={15} />
              <span>{activeBalloon.title}</span>
            </div>
            <button
              onClick={() => setActiveBalloon(null)}
              className="text-gray-500 hover:text-black font-bold p-0.5 rounded"
            >
              <X size={13} />
            </button>
          </div>

          <p className="text-[11px] leading-relaxed text-gray-700">
            {activeBalloon.message}
          </p>

          {/* Balloon pointer tail pointing to system tray */}
          <div className="absolute -bottom-2 right-12 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#FFFFE1] drop-shadow" />
        </div>
      )}

      {/* Volume Popup */}
      {isVolumeOpen && (
        <div 
          className="absolute bottom-full right-14 mb-1 w-24 bg-[#ECE9D8] border border-gray-500 shadow-xl p-2 rounded-t-sm z-[35000] flex flex-col items-center gap-2 font-tahoma text-xs"
          onClick={e => e.stopPropagation()}
        >
          <span className="font-bold text-[10px] text-gray-700">Volume</span>
          <div className="h-28 flex items-center justify-center py-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="h-24 -rotate-90 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-800 border-t border-gray-300 pt-1 w-full justify-center">
            <input
              type="checkbox"
              id="tray-mute-checkbox"
              checked={isMuted}
              onChange={handleMuteToggle}
            />
            <label htmlFor="tray-mute-checkbox" className="cursor-pointer">Mute</label>
          </div>
        </div>
      )}

      {/* Calendar & Time Popup */}
      {isCalendarOpen && (
        <div 
          className="absolute bottom-full right-1 mb-1 w-64 bg-[#ECE9D8] border border-gray-500 shadow-2xl p-3 rounded-t-sm z-[35000] font-tahoma text-xs space-y-2"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 font-bold text-gray-800 border-b border-gray-300 pb-1">
            <CalendarIcon size={14} className="text-blue-600" />
            <span>Date & Time Properties</span>
          </div>

          <div className="bg-white border border-gray-400 p-2 text-center rounded-sm">
            <p className="font-bold text-base text-[#0058EE]">{format(time, 'hh:mm:ss a')}</p>
            <p className="text-gray-600 font-semibold">{format(time, 'EEEE, MMMM d, yyyy')}</p>
          </div>

          <div className="text-[10px] text-gray-500 text-center italic">
            Synchronized with local workstation clock
          </div>
        </div>
      )}

      {/* Tray Icons Bar */}
      <div className="h-full bg-gradient-to-b from-[#0F8CEB] to-[#0A62A6] px-3 flex items-center border-l border-[#0B5C9E] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),-1px_0_2px_rgba(0,0,0,0.2)_inset] text-white text-xs gap-2.5">
        {/* Security Shield Icon */}
        <div 
          title="Windows Security: Protected"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onOpenApp && onOpenApp('tips')}
        >
          <Shield size={14} className="text-yellow-300 drop-shadow-sm" />
        </div>

        {/* Network Icon */}
        <div 
          title="Local Area Connection: Connected (100.0 Mbps)"
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Wifi size={14} className="text-white drop-shadow-sm" />
        </div>

        {/* Volume Icon */}
        <div 
          onClick={e => {
            e.stopPropagation();
            setIsVolumeOpen(!isVolumeOpen);
            setIsCalendarOpen(false);
          }}
          title={isMuted ? 'Volume: Muted' : `Volume: ${Math.round(volume * 100)}%`}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={14} className="text-red-300 drop-shadow-sm" />
          ) : (
            <Volume2 size={14} className="text-white drop-shadow-sm" />
          )}
        </div>

        {/* Clock Text */}
        <span 
          onClick={e => {
            e.stopPropagation();
            setIsCalendarOpen(!isCalendarOpen);
            setIsVolumeOpen(false);
          }}
          title={format(time, 'EEEE, MMMM d, yyyy')}
          className="drop-shadow-sm font-tahoma cursor-pointer hover:text-blue-100 transition-colors ml-1"
        >
          {format(time, 'h:mm a')}
        </span>
      </div>
    </div>
  );
};
