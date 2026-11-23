import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Folder, FileText, Mail, Monitor, Globe, FlaskConical, 
  Layout, Cpu, Settings, AlertTriangle, User, HelpCircle,
  Computer, Trash2, Globe2, Disc, Bomb
} from 'lucide-react';
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
import { Identity } from './components/Identity';
import { NavigationTips } from './components/NavigationTips';
import { AdminPanel } from './components/AdminPanel';
import { LoginScreen } from './components/LoginScreen';
import { LogOffDialog } from './components/LogOffDialog';
import { TurnOffDialog } from './components/TurnOffDialog';
import { FileExplorer } from './components/FileExplorer';
import { ControlPanel } from './components/ControlPanel';
import { RunDialog } from './components/RunDialog';
import { BsodScreen } from './components/BsodScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Minesweeper } from './components/Minesweeper';
import { InternetExplorer } from './components/InternetExplorer';
import { MediaPlayer } from './components/MediaPlayer';

// Core
import { systemStore } from './core/systemStore';
import { systemBus } from './core/eventBus';
import { authStore, AuthState } from './core/authStore';
import { portfolioStore } from './core/portfolioStore';
import { soundEffects } from './core/soundEffects';
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
  adminOnly?: boolean;
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
  {
    id: 'admin',
    label: 'Admin.exe',
    icon: <Settings size={32} className="text-orange-400 drop-shadow-md" fill="#F59E0B" />,
    appType: 'admin',
    size: { width: 750, height: 550 },
    adminOnly: false,
  },
  {
    id: 'explorer',
    label: 'My Computer',
    icon: <Computer size={32} className="text-blue-500 drop-shadow-md" fill="#2563EB" />,
    appType: 'explorer',
    size: { width: 680, height: 460 },
    params: { initialPath: 'C:' },
  },
  {
    id: 'recycle',
    label: 'Recycle Bin',
    icon: <Trash2 size={32} className="text-green-500 drop-shadow-md" fill="#16A34A" />,
    appType: 'recycle',
    size: { width: 560, height: 420 },
    params: { initialPath: 'C:/RecycleBin' },
  },
  {
    id: 'control',
    label: 'Control Panel',
    icon: <Settings size={32} className="text-blue-600 drop-shadow-md" fill="#2563EB" />,
    appType: 'control',
    size: { width: 620, height: 480 },
  },
  {
    id: 'browser',
    label: 'Internet Explorer',
    icon: <Globe2 size={32} className="text-blue-500 drop-shadow-md" fill="#0284C7" />,
    appType: 'browser',
    size: { width: 780, height: 540 },
  },
  {
    id: 'mediaplayer',
    label: 'Media Player',
    icon: <Disc size={32} className="text-orange-500 drop-shadow-md" fill="#EA580C" />,
    appType: 'mediaplayer',
    size: { width: 620, height: 440 },
  },
  {
    id: 'minesweeper',
    label: 'Minesweeper',
    icon: <Bomb size={32} className="text-gray-800 drop-shadow-md" fill="#1E293B" />,
    appType: 'minesweeper',
    size: { width: 320, height: 410 },
  },
];

export default function App() {
  const [state, setState] = useState<SystemState>(systemStore.getState());
  const [authState, setAuthState] = useState<AuthState>(authStore.getState());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Track A OS Features State
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isBsodOpen, setIsBsodOpen] = useState(false);
  const [bsodCode, setBsodCode] = useState('0x000000D1');
  const [wallpaper, setWallpaper] = useState<string>(() => localStorage.getItem('xp_wallpaper') || 'default');
  const [selectedIconIds, setSelectedIconIds] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  // Dialogs
  const [isLogOffOpen, setIsLogOffOpen] = useState(false);
  const [isTurnOffOpen, setIsTurnOffOpen] = useState(false);
  const [powerState, setPowerState] = useState<'running' | 'standby' | 'shutdown'>('running');

  useEffect(() => {
    const unsubSystem = systemStore.subscribe(setState);
    const unsubAuth = authStore.subscribe(setAuthState);
    portfolioStore.fetchFromCloudflare().catch(() => {});
    return () => { 
      unsubSystem(); 
      unsubAuth();
    };
  }, []);

  // Track A Event Listeners: BSOD, Wallpaper, Shortcuts
  useEffect(() => {
    const handleBsod = (e: Event) => {
      const detail = (e as CustomEvent<{ code?: string }>).detail;
      setBsodCode(detail?.code || '0x000000D1');
      setIsBsodOpen(true);
    };

    const handleWallpaper = (e: Event) => {
      const detail = (e as CustomEvent<{ url: string }>).detail;
      if (detail?.url) {
        setWallpaper(detail.url);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Win+R or Alt+R opens Run dialog
      if ((e.altKey && (e.key === 'r' || e.key === 'R')) || (e.metaKey && (e.key === 'r' || e.key === 'R'))) {
        e.preventDefault();
        setIsRunDialogOpen(true);
      }
    };

    window.addEventListener('xp_trigger_bsod', handleBsod);
    window.addEventListener('xp_wallpaper_update', handleWallpaper);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('xp_trigger_bsod', handleBsod);
      window.removeEventListener('xp_wallpaper_update', handleWallpaper);
      window.removeEventListener('keydown', handleKeyDown);
    };
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
      case 'admin': return AdminPanel;
      case 'explorer': return FileExplorer;
      case 'recycle': return FileExplorer;
      case 'control': return ControlPanel;
      case 'browser': return InternetExplorer;
      case 'mediaplayer': return MediaPlayer;
      case 'minesweeper': return Minesweeper;
      default: return AboutMe;
    }
  };

  const openApp = useCallback((appType: string, params?: Record<string, unknown>) => {
    // If opening admin but not signed in as admin, lock and prompt
    if (appType === 'admin' && authState.session?.role !== 'admin') {
      authStore.lockWorkstation();
      return;
    }

    const iconDef = DESKTOP_ICONS.find(i => i.appType === appType);
    if (iconDef) {
       systemBus.emit({
         type: 'PROC_START',
         payload: { 
           appType, 
           title: iconDef.label, 
           params: { ...iconDef.params, ...params, size: iconDef.size } 
         }
       });
    }
  }, [authState.session?.role]);

  // Boot sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      const bootScreen = document.getElementById('boot-screen');
      if (bootScreen) {
        bootScreen.style.opacity = '0';
        setTimeout(() => { bootScreen.style.display = 'none'; }, 500);
      }
      // If already logged in, spawn initial windows
      if (!authStore.getState().isLocked) {
        openApp('logviewer');
        setTimeout(() => openApp('identity'), 100);
        setTimeout(() => openApp('tips'), 300);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [openApp]);

  const handleLoginComplete = () => {
    soundEffects.playStartup();
    // Open default introductory windows after logging in
    if (state.windows.length === 0) {
      openApp('identity');
      setTimeout(() => openApp('tips'), 150);
    }
  };

  const handleRunCommand = useCallback((cmd: string): boolean => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === 'bsod') {
      setIsBsodOpen(true);
      return true;
    }

    const appMap: Record<string, string> = {
      'cmd': 'terminal',
      'cmd.exe': 'terminal',
      'terminal': 'terminal',
      'explorer': 'explorer',
      'explorer.exe': 'explorer',
      'my computer': 'explorer',
      'recycle': 'recycle',
      'recycle bin': 'recycle',
      'control': 'control',
      'control panel': 'control',
      'admin': 'admin',
      'admin.exe': 'admin',
      'notepad': 'notepad',
      'notepad.exe': 'notepad',
      'about': 'about',
      'projects': 'projects',
      'systems': 'systems',
      'experiments': 'experiments',
      'contact': 'contact',
      'sysmon': 'monitor',
      'sysmon.exe': 'monitor',
      'monitor': 'monitor',
      'eventlog': 'logviewer',
      'eventlog.exe': 'logviewer',
      'logviewer': 'logviewer',
      'logs': 'logviewer',
      'resume': 'resume',
      'identity': 'identity',
      'tips': 'tips',
      'hints': 'tips',
      'iexplore': 'browser',
      'iexplore.exe': 'browser',
      'browser': 'browser',
      'internet': 'browser',
      'wmplayer': 'mediaplayer',
      'wmplayer.exe': 'mediaplayer',
      'mediaplayer': 'mediaplayer',
      'media': 'mediaplayer',
      'music': 'mediaplayer',
      'winmine': 'minesweeper',
      'winmine.exe': 'minesweeper',
      'minesweeper': 'minesweeper',
      'mine': 'minesweeper',
    };

    const appType = appMap[trimmed];
    if (appType) {
      openApp(appType);
      return true;
    }
    return false;
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

  // Desktop wallpaper style
  const wallpaperStyle = useMemo((): React.CSSProperties => {
    if (!wallpaper || wallpaper === 'default' || wallpaper === 'bliss') {
      return { backgroundImage: `url(${blissImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (wallpaper === 'matrix') {
      return { backgroundColor: '#020b02', backgroundImage: 'radial-gradient(#00FF41 12%, transparent 13%)', backgroundSize: '20px 20px' };
    }
    return { backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }, [wallpaper]);

  // Rubber-band marquee selection handlers
  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (!e.shiftKey && !e.ctrlKey) {
      setSelectedIconIds([]);
    }
    setSelectionBox({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
    setIsStartMenuOpen(false);
    setContextMenu(null);
  };

  const handleDesktopMouseMove = (e: React.MouseEvent) => {
    if (selectionBox) {
      const currentX = e.clientX;
      const currentY = e.clientY;
      setSelectionBox(prev => prev ? { ...prev, currentX, currentY } : null);

      const boxLeft = Math.min(selectionBox.startX, currentX);
      const boxTop = Math.min(selectionBox.startY, currentY);
      const boxRight = Math.max(selectionBox.startX, currentX);
      const boxBottom = Math.max(selectionBox.startY, currentY);

      const hitIds: string[] = [];
      state.desktopIcons.forEach(icon => {
        const iconLeft = icon.x;
        const iconTop = icon.y;
        const iconRight = icon.x + 72;
        const iconBottom = icon.y + 80;

        const overlaps = !(boxRight < iconLeft || boxLeft > iconRight || boxBottom < iconTop || boxTop > iconBottom);
        if (overlaps) {
          hitIds.push(icon.id);
        }
      });
      setSelectedIconIds(hitIds);
    }
  };

  const handleDesktopMouseUp = () => {
    if (selectionBox) {
      setSelectionBox(null);
    }
  };

  // STANDBY SCREEN
  if (powerState === 'standby') {
    return (
      <div 
        className="fixed inset-0 bg-black z-[30000] flex flex-col items-center justify-center text-gray-500 font-tahoma cursor-pointer select-none"
        onClick={() => setPowerState('running')}
      >
        <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping mb-4" />
        <p className="text-sm font-semibold">Windows XP is in Standby Mode</p>
        <p className="text-xs text-gray-600 mt-1">Click anywhere or press any key to resume</p>
      </div>
    );
  }

  // SHUTDOWN SCREEN
  if (powerState === 'shutdown') {
    return (
      <div className="fixed inset-0 bg-black z-[30000] flex flex-col items-center justify-center text-orange-500 font-tahoma select-none">
        <p className="text-2xl font-bold tracking-tight mb-2">It is now safe to turn off your computer.</p>
        <p className="text-xs text-gray-400 mb-6">All processes terminated and storage buffers flushed.</p>
        <button
          onClick={() => {
            setPowerState('running');
            systemBus.emit({ type: 'SYS_REBOOT' });
          }}
          className="xp-button px-6 py-2 text-sm font-bold text-white bg-blue-600"
        >
          Restart Computer
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full h-screen overflow-hidden relative select-none bg-blue-500 font-tahoma"
      style={wallpaperStyle}
      onContextMenu={handleContextMenu}
      onMouseDown={handleDesktopMouseDown}
      onMouseMove={handleDesktopMouseMove}
      onMouseUp={handleDesktopMouseUp}
      onClick={() => {
        setIsStartMenuOpen(false);
        setContextMenu(null);
      }}
    >
      <div id="boot-screen" className="transition-opacity duration-500 z-[10000] absolute inset-0">
        <BootScreen />
      </div>

      {/* Desktop Rubberband Selection Marquee */}
      {selectionBox && (
        <div
          className="absolute z-[10] border border-[#316AC5] bg-[#316AC5]/25 pointer-events-none"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.currentX),
            top: Math.min(selectionBox.startY, selectionBox.currentY),
            width: Math.abs(selectionBox.currentX - selectionBox.startX),
            height: Math.abs(selectionBox.currentY - selectionBox.startY),
          }}
        />
      )}

      {/* Windows XP Login Screen */}
      {authState.isLocked && (
        <LoginScreen
          onLoginSuccess={handleLoginComplete}
          onTurnOff={() => setIsTurnOffOpen(true)}
        />
      )}

      {/* Log Off Dialog */}
      {isLogOffOpen && (
        <LogOffDialog
          onSwitchUser={() => {
            setIsLogOffOpen(false);
            authStore.lockWorkstation();
          }}
          onLogOff={() => {
            soundEffects.playShutdown();
            setIsLogOffOpen(false);
            // Close all open windows
            state.windows.forEach(w => systemBus.emit({ type: 'PROC_KILL', payload: { pid: w.pid } }));
            authStore.logOff();
          }}
          onCancel={() => setIsLogOffOpen(false)}
        />
      )}

      {/* Turn Off Dialog */}
      {isTurnOffOpen && (
        <TurnOffDialog
          onStandBy={() => {
            setIsTurnOffOpen(false);
            setPowerState('standby');
          }}
          onTurnOff={() => {
            setIsTurnOffOpen(false);
            setPowerState('shutdown');
          }}
          onRestart={() => {
            setIsTurnOffOpen(false);
            systemBus.emit({ type: 'SYS_REBOOT' });
          }}
          onCancel={() => setIsTurnOffOpen(false)}
        />
      )}

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
          <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={() => openApp('admin')}>Admin Console</div>
          <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={() => authStore.lockWorkstation()}>Lock Workstation</div>
        </div>
      )}

      {/* Desktop Icons Area */}
      <div 
        className="absolute top-0 left-0 w-full h-[calc(100vh-40px)] z-0 pointer-events-none" 
        onClick={e => e.stopPropagation()}
      >
        {state.desktopIcons
          .filter(iconData => {
            if (iconData.appType === 'admin') {
              return authState.session?.role === 'admin';
            }
            return true;
          })
          .map(iconData => {
          const iconDef = DESKTOP_ICONS.find(i => i.appType === iconData.appType);
          if (!iconDef) return null;
          return (
            <div key={iconData.id} className="pointer-events-auto">
              <DesktopIcon
                label={iconData.label}
                icon={iconDef.icon}
                x={iconData.x}
                y={iconData.y}
                isSelected={selectedIconIds.includes(iconData.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.ctrlKey || e.metaKey) {
                    setSelectedIconIds(prev => prev.includes(iconData.id) ? prev.filter(id => id !== iconData.id) : [...prev, iconData.id]);
                  } else {
                    setSelectedIconIds([iconData.id]);
                  }
                }}
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
              <ErrorBoundary fallbackTitle={w.title}>
                <AppComponent 
                  process={process}
                  systemState={state}
                />
              </ErrorBoundary>
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
            onLogOffClick={() => setIsLogOffOpen(true)}
            onTurnOffClick={() => setIsTurnOffOpen(true)}
            onRunClick={() => setIsRunDialogOpen(true)}
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
          onOpenApp={openApp}
        />
      </div>

      {/* Run Dialog (Alt+R / Win+R / Start Menu) */}
      <RunDialog
        isOpen={isRunDialogOpen}
        onClose={() => setIsRunDialogOpen(false)}
        onRun={handleRunCommand}
      />

      {/* Blue Screen of Death (BSOD) */}
      {isBsodOpen && (
        <BsodScreen
          code={bsodCode}
          onRestart={() => {
            setIsBsodOpen(false);
            systemBus.emit({ type: 'SYS_REBOOT' });
          }}
        />
      )}
    </div>
  );
}
