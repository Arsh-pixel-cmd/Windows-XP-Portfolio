import React, { useState, useEffect, useCallback } from 'react';
import { Folder, FileText, Mail, Monitor, Globe, FlaskConical, Layout, Cpu } from 'lucide-react';
import { DesktopIcon } from './components/DesktopIcon';
import { Taskbar } from './components/Taskbar';
import { Window } from './components/Window';
import { Projects } from './components/Projects';
import { AboutMe } from './components/AboutMe';
import { Contact } from './components/Contact';
import blissImage from './assets/bliss.png';
import { StartMenu } from './components/StartMenu';
import { Systems } from './components/Systems';
import { Terminal } from './components/Terminal';
import { Experiments } from './components/Experiments';
import { Notepad } from './components/Notepad';
import { SystemMonitor } from './components/SystemMonitor';
import { LogViewer } from './components/LogViewer';
import { AlertTriangle, User, HelpCircle } from 'lucide-react';
import { Identity } from './components/Identity';
import { NavigationTips } from './components/NavigationTips';

// Core
import { systemStore } from './core/systemStore';
import { systemBus } from './core/eventBus';
import { SystemState, Process } from './core/types';

// XP Boot Screen Component
const BootScreen = () => (
  <div className="fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center select-none animate-in fade-in duration-700">
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-4">
        <div className="text-white text-4xl font-bold tracking-tighter">
          <span className="text-blue-500 italic">Windows</span>
          <span className="text-orange-500 ml-1">XP</span>
        </div>
      </div>
      <div className="w-48 h-2.5 border-2 border-gray-600 rounded-sm p-[1px] overflow-hidden relative bg-black">
        <div className="h-full w-1/3 bg-blue-500 absolute animate-[xp-boot-progress_2s_infinite_linear] rounded-sm shadow-[0_0_8px_#3b82f6]" />
      </div>
    </div>
    <div className="absolute bottom-12 text-gray-500 text-xs font-tahoma">
      Copyright &copy; Microsoft Corporation
    </div>
  </div>
);

// Configuration
interface DesktopIconDefinition {
  id: string;
  label: string;
  icon: React.ReactElement;
  appType: string;
  size: { width: number; height: number };
  params?: Record<string, unknown>;
}

interface LogIconProps {
  size: number;
  className?: string;
  fill?: string;
}

const LogIcon: React.FC<LogIconProps> = ({ size, className }) => (
  <div className={`p-1 bg-white border border-gray-400 rounded-sm ${className || ''}`}>
    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
      <Monitor size={size - 8} />
    </div>
  </div>
);

const DESKTOP_ICONS: DesktopIconDefinition[] = [
  {
    id: 'about',
    label: 'About.exe',
    icon: <Monitor size={32} fill="#4176CF" className="text-blue-200 drop-shadow-md" />,
    appType: 'about',
    size: { width: 550, height: 450 }
  },
  {
    id: 'projects',
    label: 'Projects.exe',
    icon: <Folder size={32} fill="currentColor" className="text-yellow-400 drop-shadow-md" />,
    appType: 'projects',
    size: { width: 600, height: 500 }
  },
  {
    id: 'systems',
    label: 'Systems.exe',
    icon: <Globe size={32} fill="#3B82F6" className="text-white drop-shadow-md" />,
    appType: 'systems',
    size: { width: 500, height: 450 }
  },
  {
    id: 'experiments',
    label: 'Experiments.exe',
    icon: <FlaskConical size={32} fill="#A855F7" className="text-white drop-shadow-md" />,
    appType: 'experiments',
    size: { width: 450, height: 400 }
  },
  {
    id: 'terminal',
    label: 'cmd.exe',
    icon: <Layout size={32} className="text-black drop-shadow-md" fill="#333" />,
    appType: 'terminal',
    size: { width: 600, height: 400 }
  },
  {
    id: 'contact',
    label: 'Contact.exe',
    icon: <Mail size={32} className="text-blue-100 drop-shadow-md" fill="#3B82F6" />,
    appType: 'contact',
    size: { width: 450, height: 420 }
  },
  {
    id: 'notepad',
    label: 'Notepad.exe',
    icon: <FileText size={32} className="text-gray-600 drop-shadow-md" fill="#fff" />,
    appType: 'notepad',
    size: { width: 500, height: 400 }
  },
  {
    id: 'monitor',
    label: 'SysMon.exe',
    icon: <Cpu size={32} className="text-green-600 drop-shadow-md" fill="#333" />,
    appType: 'monitor',
    size: { width: 400, height: 500 }
  },
  {
    id: 'logviewer',
    label: 'EventLog.exe',
    icon: <LogIcon size={32} className="text-blue-600 drop-shadow-md" fill="#fff" />,
    appType: 'logviewer',
    size: { width: 600, height: 400 }
  },
  {
    id: 'resume',
    label: 'Resume.txt',
    icon: <FileText size={32} className="text-gray-600 drop-shadow-md" fill="#fff" />,
    appType: 'resume',
    size: { width: 500, height: 400 }
  },
  {
    id: 'identity',
    label: 'Identity.exe',
    icon: <User size={32} className="text-orange-500 drop-shadow-md" fill="#fff" />,
    appType: 'identity',
    size: { width: 600, height: 450 }
  },
  {
    id: 'tips',
    label: 'Hints.exe',
    icon: <HelpCircle size={32} className="text-blue-500 drop-shadow-md" fill="#fff" />,
    appType: 'tips',
    size: { width: 380, height: 480 }
  },
];

export default function App() {
  const [state, setState] = useState<SystemState>(systemStore.getState());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const unsub = systemStore.subscribe(setState);
    return () => { unsub(); };
  }, []);

  const getComponentForApp = (appType: string) => {
    switch (appType) {
      case 'about': return AboutMe;
      case 'projects': return Projects;
      case 'systems': return Systems;
      case 'experiments': return Experiments;
      case 'terminal': return Terminal;
      case 'contact': return Contact;
      case 'notepad': return Notepad;
      case 'resume': return Notepad;
      case 'identity': return Identity;
      case 'tips': return NavigationTips;
      case 'monitor': return SystemMonitor;
      case 'logviewer': return LogViewer;
      default: return AboutMe;
    }
  };

  const openApp = useCallback((appType: string, params?: Record<string, unknown>) => {
    const iconDef = DESKTOP_ICONS.find(i => i.appType === appType);
    if (iconDef) {
       systemBus.emit({
         type: 'PROC_START',
         payload: { 
           appType, 
           title: iconDef.label, 
           params: { ...iconDef.params, ...params } 
         }
       });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const bootScreen = document.getElementById('boot-screen');
      if (bootScreen) {
        bootScreen.style.opacity = '0';
        setTimeout(() => { bootScreen.style.display = 'none'; }, 500);
      }
      openApp('logviewer');
      setTimeout(() => openApp('identity'), 100);
      setTimeout(() => openApp('tips'), 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, [openApp]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const taskbarWindows = state.windows.map(w => ({
    id: w.id,
    title: w.title,
    icon: DESKTOP_ICONS.find(i => i.appType === (state.processes.find(p => p.pid === w.pid) as Process)?.appType)?.icon || <FileText />,
    active: state.activeWindowId === w.id
  }));

  return (
    <div
      className="w-full h-screen overflow-hidden relative bg-cover bg-center select-none bg-blue-500 font-tahoma"
      style={{ backgroundImage: `url(${blissImage})` }}
      onContextMenu={handleContextMenu}
      onClick={() => {
        setIsStartMenuOpen(false);
        setContextMenu(null);
      }}
    >
      <div id="boot-screen" className="transition-opacity duration-500 z-[10000] absolute inset-0">
        <BootScreen />
      </div>

      {/* Overload Indicator */}
      {state.resources.isBlocked && (
        <div className="fixed top-4 right-4 z-[9999] animate-pulse">
          <div className="bg-red-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 border-2 border-white font-bold text-sm">
            <AlertTriangle size={18} />
            SYSTEM OVERLOADED: BACKPRESSURE ACTIVE
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[10001] bg-[#ECE9D8] border border-gray-400 shadow-md py-1 min-w-[150px] text-xs font-tahoma"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={() => systemBus.emit({ type: 'SYS_REBOOT' })}>Refresh</div>
          <div className="h-[1px] bg-gray-300 my-1 mx-1" />
          <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default">New</div>
          <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default">Properties</div>
        </div>
      )}

      {/* Desktop Icons Area */}
      <div 
        className="absolute top-0 left-0 w-full h-[calc(100vh-40px)] z-0 pointer-events-none" 
        onClick={e => e.stopPropagation()}
      >
        {state.desktopIcons.map(iconData => {
          const iconDef = DESKTOP_ICONS.find(i => i.appType === iconData.appType);
          if (!iconDef) return null;
          return (
            <div key={iconData.id} className="pointer-events-auto">
              <DesktopIcon
                label={iconData.label}
                icon={iconDef.icon}
                x={iconData.x}
                y={iconData.y}
                onDoubleClick={() => openApp(iconData.appType, iconData.params)}
                onMove={(x, y) => systemBus.emit({ type: 'ICON_MOVE', payload: { id: iconData.id, x, y } })}
              />
            </div>
          );
        })}
      </div>

      {/* Windows Area */}
      <div className="absolute top-0 left-0 w-full h-[calc(100vh-30px)] pointer-events-none overflow-hidden" onClick={e => e.stopPropagation()}>
        {state.windows.map(w => {
          const process = state.processes.find(p => p.pid === w.pid);
          if (!process) return null;
          const AppComponent = getComponentForApp(process.appType);
          
          return (
            <Window
              key={w.id}
              id={w.id}
              title={w.title}
              icon={(() => {
                const iconDef = DESKTOP_ICONS.find(i => i.appType === process.appType);
                return iconDef ? React.cloneElement(iconDef.icon as React.ReactElement<{ size?: number }>, { size: 14 }) : <FileText size={14} />;
              })()}
              zIndex={w.zIndex}
              active={state.activeWindowId === w.id}
              isMinimized={w.isMinimized}
              isMaximized={w.isMaximized}
              position={w.position}
              size={w.size}
              onClose={() => systemBus.emit({ type: 'PROC_KILL', payload: { pid: w.pid } })}
              onFocus={() => systemBus.emit({ type: 'WIN_FOCUS', payload: { id: w.id } })}
              onMinimize={() => systemBus.emit({ type: 'WIN_MINIMIZE', payload: { id: w.id } })}
              onMaximize={() => systemBus.emit({ type: 'WIN_MAXIMIZE', payload: { id: w.id } })}
              onMove={(x, y) => systemBus.emit({ type: 'WIN_MOVE', payload: { id: w.id, x, y } })}
              onResize={(width, height) => systemBus.emit({ type: 'WIN_RESIZE', payload: { id: w.id, width, height } })}
            >
              <AppComponent 
                process={process}
                systemState={state}
              />
            </Window>
          );
        })}
      </div>

      {/* Taskbar */}
      <div onClick={e => e.stopPropagation()} className="pointer-events-auto absolute bottom-0 w-full z-[9999]">
        {isStartMenuOpen && (
          <StartMenu 
            onOpenApp={openApp} 
            onRefreshDesktop={() => systemBus.emit({ type: 'SYS_REFRESH' })}
            onClose={() => setIsStartMenuOpen(false)} 
          />
        )}
        <Taskbar
          openWindows={taskbarWindows}
          onTaskClick={(id) => {
            const win = state.windows.find(w => w.id === id);
            if (state.activeWindowId === id && win && !win.isMinimized) {
              systemBus.emit({ type: 'WIN_MINIMIZE', payload: { id } });
            } else {
              systemBus.emit({ type: 'WIN_FOCUS', payload: { id } });
            }
          }}
          onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          isStartMenuOpen={isStartMenuOpen}
        />
      </div>
    </div>
  );
}