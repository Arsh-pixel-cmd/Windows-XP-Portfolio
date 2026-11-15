import React, { useState, useEffect } from 'react';
import { 
  Globe, Mail,
  Settings, Search, HelpCircle,
  Power, Folder, FileText, 
  Computer, HardDrive, Monitor, FlaskConical, Cpu, ShieldAlert, User as UserIcon
} from 'lucide-react';
import { authStore } from '../core/authStore';
import { UserSession } from '../types/portfolio';

interface StartMenuProps {
  onOpenApp: (appType: string) => void;
  onRefreshDesktop: () => void;
  onClose: () => void;
  onLogOffClick: () => void;
  onTurnOffClick: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ 
  onClose, 
  onOpenApp, 
  onRefreshDesktop, 
  onLogOffClick, 
  onTurnOffClick 
}) => {
  const [session, setSession] = useState<UserSession | null>(authStore.getState().session);

  useEffect(() => {
    const unsub = authStore.subscribe(state => setSession(state.session));
    return () => { unsub(); };
  }, []);

  const isAdmin = session?.role === 'admin';
  const username = session?.username || 'Guest';

  return (
    <div 
      className="absolute bottom-full left-0 w-[380px] bg-[#1D5ADA] rounded-t-lg shadow-2xl flex flex-col z-[10000] border-t-2 border-l-2 border-r-2 border-[#1B4B1C] overflow-hidden select-none font-tahoma"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="h-14 bg-gradient-to-r from-[#1D5ADA] via-[#4287F5] to-[#1D5ADA] p-2 flex items-center gap-3 border-b border-[#0A3D91]">
        <div className="w-10 h-10 rounded-sm border-2 border-white/70 bg-[#F65314] flex items-center justify-center overflow-hidden shadow-inner">
          <UserIcon size={24} className="text-white drop-shadow" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-base drop-shadow-md">{username}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
              isAdmin ? 'bg-orange-500 text-white' : 'bg-blue-300 text-blue-900'
            }`}>
              {isAdmin ? 'Admin' : 'Guest'}
            </span>
          </div>
          <span className="text-[10px] text-blue-100 italic">
            {isAdmin ? 'Cloudflare D1 Management Active' : 'Read-only Visitor Session'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex bg-white flex-1 overflow-hidden" style={{ minHeight: '400px' }}>
        {/* Left Column (Programs) */}
        <div className="w-[55%] flex flex-col p-1.5 gap-0.5 border-r border-[#91B2E6]">
          {/* Top Programs */}
          <div 
            onClick={() => { onOpenApp('terminal'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm active:translate-y-[1px] transition-all"
          >
            <div className="bg-black p-1 rounded">
               <Globe className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[13px]">Command Prompt</span>
              <span className="text-[11px] text-gray-500 group-hover:text-blue-100">cmd.exe</span>
            </div>
          </div>
          <div 
            onClick={() => { onOpenApp('contact'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm active:translate-y-[1px] transition-all"
          >
            <Mail className="text-[#2F71CD] group-hover:text-white w-8 h-8" />
            <div className="flex flex-col">
              <span className="font-bold text-[13px]">Contact Me</span>
              <span className="text-[11px] text-gray-500 group-hover:text-blue-100">Outlook Express</span>
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 my-1 mx-2" />

          {/* Frequent Programs */}
          <div 
            onClick={() => { onOpenApp('projects'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <Folder className="text-yellow-500 group-hover:text-white w-8 h-8" />
            <span className="text-[13px]">My Portfolio Projects</span>
          </div>
          <div 
            onClick={() => { onOpenApp('systems'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <Monitor className="text-blue-600 group-hover:text-white w-8 h-8" />
            <span className="text-[13px]">System Architecture</span>
          </div>
          <div 
            onClick={() => { onOpenApp('experiments'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
             <FlaskConical className="text-purple-500 group-hover:text-white w-8 h-8" />
            <span className="text-[13px]">Lab Experiments</span>
          </div>
          <div 
            onClick={() => { onOpenApp('notepad'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
             <FileText className="text-gray-500 group-hover:text-white w-8 h-8" />
            <span className="text-[13px]">Notepad</span>
          </div>
          <div 
            onClick={() => { onOpenApp('monitor'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
             <Cpu className="text-green-600 group-hover:text-white w-8 h-8" />
            <span className="text-[13px]">System Monitor</span>
          </div>

          {/* Admin app shortcut for quick access */}
          {isAdmin && (
            <div 
              onClick={() => { onOpenApp('admin'); onClose(); }}
              className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm bg-orange-50 border border-orange-200"
            >
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs">
                ⚙️
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-orange-900 group-hover:text-white">Admin Console</span>
                <span className="text-[10px] text-orange-700 group-hover:text-orange-100">Cloudflare D1 CMS</span>
              </div>
            </div>
          )}

          <div className="flex-1" />

          {/* All Programs */}
          <div className="h-[1px] bg-gray-300 my-1" />
          <div 
            onClick={() => {
              if (isAdmin) {
                onOpenApp('admin');
              } else {
                onLogOffClick();
              }
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group active:translate-y-[1px] transition-all"
          >
            <span className="font-bold text-[13px]">
              {isAdmin ? 'Admin Tools (All)' : 'Sign In as Administrator'}
            </span>
            <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]">
               <div className="border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1" />
            </div>
          </div>
        </div>

        {/* Right Column (Places) */}
        <div className="w-[45%] bg-[#D3E5FA] flex flex-col p-1.5 gap-0.5 border-l border-white shadow-[inset_1px_0_1px_rgba(255,255,255,0.8)]">
          <div 
            onClick={() => { onOpenApp('projects'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <Folder className="text-[#D39943] group-hover:text-white w-6 h-6" />
            <span className="text-[12px] font-bold">My Projects</span>
          </div>
          <div 
            onClick={() => { onOpenApp('identity'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <FileText className="text-[#8BA1C1] group-hover:text-white w-6 h-6" />
            <span className="text-[12px] font-bold">Identity & Focus</span>
          </div>
          <div 
            onClick={() => { onOpenApp('experiments'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <FlaskConical className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px] font-bold">My Lab</span>
          </div>
          <div 
            onClick={() => { onOpenApp('systems'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <Computer className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px] font-bold">My System</span>
          </div>

          <div className="h-[1px] bg-[#91B2E6]/50 my-1 mx-2 shadow-[0_1px_0_rgba(255,255,255,0.5)]" />

          {/* Control Panel / Admin Panel */}
          <div 
            onClick={() => {
              if (isAdmin) {
                onOpenApp('admin');
              } else {
                onLogOffClick();
              }
              onClose();
            }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <Settings className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px] font-bold">
              {isAdmin ? 'Control Panel (Admin)' : 'Admin Login'}
            </span>
          </div>

          <div 
            onClick={() => { onRefreshDesktop(); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm active:translate-y-[1px]"
          >
             <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-[#4176CF] group-hover:border-white rounded-full border-t-transparent animate-[spin_3s_linear_infinite]" />
             </div>
            <span className="text-[12px] font-bold">Refresh Desktop</span>
          </div>

          <div 
            onClick={() => { onOpenApp('logviewer'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <ShieldAlert className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px]">Event Logs</span>
          </div>

          <div className="h-[1px] bg-[#91B2E6]/50 my-1 mx-2 shadow-[0_1px_0_rgba(255,255,255,0.5)]" />

          <div 
            onClick={() => { onOpenApp('tips'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <HelpCircle className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px]">Help & Tips</span>
          </div>
          <div 
            onClick={() => { onOpenApp('terminal'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <Search className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px]">Search</span>
          </div>
          <div 
            onClick={() => { onOpenApp('terminal'); onClose(); }}
            className="flex items-center gap-2 p-1.5 hover:bg-[#2F71CD] hover:text-white cursor-default group rounded-sm"
          >
            <HardDrive className="text-[#4176CF] group-hover:text-white w-6 h-6" />
            <span className="text-[12px]">Run...</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-10 bg-gradient-to-r from-[#1D5ADA] via-[#4287F5] to-[#1D5ADA] p-1.5 flex items-center justify-end gap-4 border-t border-[#0A3D91]">
        <button 
          className="flex items-center gap-1.5 hover:bg-white/10 active:bg-black/20 px-2 py-0.5 rounded-sm transition-all group active:translate-y-[1px]"
          onClick={() => { onClose(); onLogOffClick(); }}
        >
          <div className="w-4 h-4 bg-orange-400 rounded-sm flex items-center justify-center shadow-[inset_1px_1px_1px_rgba(255,255,255,0.5)]">
             <div className="w-2 h-2 border-2 border-white rotate-45" />
          </div>
          <span className="text-white text-[12px] group-hover:underline font-bold">Log Off</span>
        </button>
        <button 
          className="flex items-center gap-1.5 hover:bg-white/10 active:bg-black/20 px-2 py-0.5 rounded-sm transition-all group active:translate-y-[1px]"
          onClick={() => { onClose(); onTurnOffClick(); }}
        >
          <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center shadow-[inset_1px_1px_1px_rgba(255,255,255,0.5)]">
             <Power className="text-white w-3 h-3" />
          </div>
          <span className="text-white text-[12px] group-hover:underline font-bold">Turn Off Computer</span>
        </button>
      </div>
    </div>
  );
};
