// src/components/ControlPanel.tsx
import React, { useState } from 'react';
import { 
  Monitor, Volume2, User, Cpu, ShieldCheck, 
  Check, Play 
} from 'lucide-react';
import { soundEffects } from '../core/soundEffects';
import { authStore } from '../core/authStore';

interface ControlPanelProps {
  onWallpaperChange?: (url: string) => void;
}

const WALLPAPERS = [
  { id: 'bliss', name: 'Bliss (Original)', url: 'default' },
  { id: 'silver', name: 'Silver Stream', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80' },
  { id: 'royale', name: 'Royale Noir', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80' },
  { id: 'energy', name: 'Energy Blue', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920&q=80' },
  { id: 'matrix', name: 'Matrix Cyber', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({ onWallpaperChange }) => {
  const [activeTab, setActiveTab] = useState<'display' | 'sound' | 'user' | 'system'>('display');
  const [selectedWallpaper, setSelectedWallpaper] = useState<string>(
    localStorage.getItem('xp_wallpaper') || 'default'
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEffects.isEnabled());
  const [volume, setVolume] = useState<number>(soundEffects.getVolume());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const session = authStore.getState().session;

  const handleApplyWallpaper = (url: string) => {
    setSelectedWallpaper(url);
    localStorage.setItem('xp_wallpaper', url);
    soundEffects.playClick();
    if (onWallpaperChange) {
      onWallpaperChange(url);
    }
    // Also trigger custom window event for instant update across App
    window.dispatchEvent(new CustomEvent('xp_wallpaper_update', { detail: { url } }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSoundToggle = (val: boolean) => {
    setSoundEnabled(val);
    soundEffects.setEnabled(val);
    if (val) soundEffects.playBalloon();
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    soundEffects.setVolume(vol);
  };

  return (
    <div className="h-full bg-[#ECE9D8] flex flex-col font-tahoma text-xs select-none">
      {/* Category Tabs */}
      <div className="flex bg-[#ECE9D8] border-b border-gray-400 px-3 pt-2 gap-1">
        <button
          onClick={() => setActiveTab('display')}
          className={`px-3 py-1.5 rounded-t-sm font-semibold flex items-center gap-1.5 border-t border-l border-r ${
            activeTab === 'display'
              ? 'bg-white border-gray-400 -mb-[1px] pb-2 text-[#0058EE] font-bold'
              : 'bg-[#DCD8C8] border-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Monitor size={14} className="text-blue-600" />
          Display & Wallpaper
        </button>
        <button
          onClick={() => setActiveTab('sound')}
          className={`px-3 py-1.5 rounded-t-sm font-semibold flex items-center gap-1.5 border-t border-l border-r ${
            activeTab === 'sound'
              ? 'bg-white border-gray-400 -mb-[1px] pb-2 text-[#0058EE] font-bold'
              : 'bg-[#DCD8C8] border-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Volume2 size={14} className="text-green-600" />
          Audio & Sounds
        </button>
        <button
          onClick={() => setActiveTab('user')}
          className={`px-3 py-1.5 rounded-t-sm font-semibold flex items-center gap-1.5 border-t border-l border-r ${
            activeTab === 'user'
              ? 'bg-white border-gray-400 -mb-[1px] pb-2 text-[#0058EE] font-bold'
              : 'bg-[#DCD8C8] border-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <User size={14} className="text-orange-500" />
          User Account
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-3 py-1.5 rounded-t-sm font-semibold flex items-center gap-1.5 border-t border-l border-r ${
            activeTab === 'system'
              ? 'bg-white border-gray-400 -mb-[1px] pb-2 text-[#0058EE] font-bold'
              : 'bg-[#DCD8C8] border-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Cpu size={14} className="text-purple-600" />
          System Specs
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white p-5 overflow-auto">
        {/* Success Alert */}
        {savedSuccess && (
          <div className="mb-4 p-2 bg-green-50 border border-green-300 text-green-800 rounded flex items-center gap-2">
            <Check size={16} />
            <span>Settings applied successfully!</span>
          </div>
        )}

        {/* DISPLAY TAB */}
        {activeTab === 'display' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="font-bold text-sm text-gray-800 border-b pb-1">
              Desktop Background & Theme
            </h3>
            <p className="text-gray-500">
              Select a wallpaper for your Windows XP workstation:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {WALLPAPERS.map(w => {
                const isSelected = selectedWallpaper === w.url;
                return (
                  <div
                    key={w.id}
                    onClick={() => handleApplyWallpaper(w.url)}
                    className={`border-2 rounded p-2 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0058EE] bg-blue-50/50 shadow-md'
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-full h-20 bg-gray-200 rounded overflow-hidden flex items-center justify-center border border-gray-300">
                      {w.url === 'default' ? (
                        <div className="w-full h-full bg-gradient-to-b from-[#2B83D8] to-[#6EB33B] flex items-center justify-center text-white font-bold text-[10px]">
                          Bliss (Classic)
                        </div>
                      ) : (
                        <img src={w.url} alt={w.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="font-bold text-xs text-gray-800 text-center">{w.name}</span>
                    {isSelected && (
                      <span className="text-[10px] text-green-700 font-bold flex items-center gap-1">
                        <Check size={12} /> Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AUDIO & SOUNDS TAB */}
        {activeTab === 'sound' && (
          <div className="space-y-5 max-w-lg">
            <h3 className="font-bold text-sm text-gray-800 border-b pb-1">
              Sound Effects & Volume
            </h3>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sound-toggle-cb"
                checked={soundEnabled}
                onChange={e => handleSoundToggle(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="sound-toggle-cb" className="font-bold text-gray-800 cursor-pointer">
                Play Windows XP Sound Effects (Synthesized via Web Audio API)
              </label>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-gray-700 flex justify-between">
                <span>Master Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="bg-gray-50 border border-gray-300 p-3 rounded space-y-2">
              <span className="font-bold text-gray-700 block mb-2">Test Sound Effects:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => soundEffects.playStartup()}
                  className="xp-button px-3 py-1 flex items-center gap-1"
                >
                  <Play size={12} className="text-blue-600" />
                  Startup Chime
                </button>
                <button
                  type="button"
                  onClick={() => soundEffects.playBalloon()}
                  className="xp-button px-3 py-1 flex items-center gap-1"
                >
                  <Play size={12} className="text-yellow-600" />
                  Balloon Ping
                </button>
                <button
                  type="button"
                  onClick={() => soundEffects.playError()}
                  className="xp-button px-3 py-1 flex items-center gap-1"
                >
                  <Play size={12} className="text-red-600" />
                  Error Stop
                </button>
                <button
                  type="button"
                  onClick={() => soundEffects.playShutdown()}
                  className="xp-button px-3 py-1 flex items-center gap-1"
                >
                  <Play size={12} className="text-purple-600" />
                  Shutdown
                </button>
                <button
                  type="button"
                  onClick={() => soundEffects.playRecycle()}
                  className="xp-button px-3 py-1 flex items-center gap-1"
                >
                  <Play size={12} className="text-green-600" />
                  Recycle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* USER TAB */}
        {activeTab === 'user' && (
          <div className="space-y-4 max-w-lg">
            <h3 className="font-bold text-sm text-gray-800 border-b pb-1">
              Active User Account
            </h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-300 rounded">
              <div className="w-16 h-16 rounded bg-[#F65314] flex items-center justify-center text-white border-2 border-white shadow">
                <User size={36} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-gray-900">
                  {session?.username || 'Guest'}
                </h4>
                <p className="text-xs text-blue-700 font-semibold capitalize">
                  {session?.role === 'admin' ? 'System Administrator' : 'Guest Account (Read-Only)'}
                </p>
                <p className="text-[11px] text-gray-500">
                  Logged in since {session?.loginTime ? new Date(session.loginTime).toLocaleTimeString() : 'Current Session'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM SPECS TAB */}
        {activeTab === 'system' && (
          <div className="space-y-4 max-w-lg">
            <h3 className="font-bold text-sm text-gray-800 border-b pb-1">
              System Properties
            </h3>
            <div className="space-y-2 text-gray-800 leading-relaxed">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded bg-blue-600 flex items-center justify-center text-white shrink-0 shadow">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="font-bold text-sm">Microsoft Windows XP</p>
                  <p className="text-xs text-gray-600">Professional Version 2002 • Service Pack 3</p>
                  <p className="text-[11px] text-gray-500 mt-1">Interactive Systems Architecture Portfolio Engine</p>
                </div>
              </div>

              <div className="h-[1px] bg-gray-300 my-2" />

              <div className="pl-16 space-y-1 text-xs">
                <p className="font-bold text-gray-700">Registered to:</p>
                <p>Arsh Mishra</p>
                <p className="text-gray-500">IILM University • Computer Science</p>
                <p className="mt-2 font-bold text-gray-700">Computer Specifications:</p>
                <p>Simulated x86_64 Architecture</p>
                <p>Kernel: 1.0.0 Event-Driven VFS</p>
                <p>Cloudflare D1 Edge SQLite Synchronizer</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="bg-[#ECE9D8] border-t border-gray-400 p-2 flex justify-end gap-2">
        <button
          onClick={() => {
            soundEffects.playClick();
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2000);
          }}
          className="xp-button px-5 py-1 font-bold text-gray-800"
        >
          OK
        </button>
        <button
          onClick={() => {
            soundEffects.playClick();
          }}
          className="xp-button px-5 py-1 text-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
