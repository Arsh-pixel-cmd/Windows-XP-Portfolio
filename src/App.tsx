import React, { useState, useReducer, useEffect, useCallback } from 'react';
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

// Types
type BootStatus = 'booting' | 'loading' | 'ready';

interface WindowInstance {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

type WindowAction =
  | { type: 'OPEN'; payload: { id: string; title: string; icon: React.ReactNode; component: React.ComponentType<any>; size: { width: number; height: number } } }
  | { type: 'CLOSE'; payload: string }
  | { type: 'FOCUS'; payload: string }
  | { type: 'MINIMIZE'; payload: string }
  | { type: 'MAXIMIZE'; payload: string }
  | { type: 'MOVE'; payload: { id: string; x: number; y: number } }
  | { type: 'RESIZE'; payload: { id: string; width: number; height: number } }
  | { type: 'RESTORE_SESSION'; payload: WindowInstance[] };

interface AppState {
  windows: WindowInstance[];
  activeWindowId: string | null;
  bootStatus: BootStatus;
  zIndexCounter: number;
}

const INITIAL_STATE: AppState = {
  windows: [],
  activeWindowId: null,
  bootStatus: 'booting',
  zIndexCounter: 10,
};

function windowReducer(state: AppState, action: WindowAction): AppState {
  switch (action.type) {
    case 'OPEN': {
      const existing = state.windows.find(w => w.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          activeWindowId: action.payload.id,
          zIndexCounter: state.zIndexCounter + 1,
          windows: state.windows.map(w =>
            w.id === action.payload.id
              ? { ...w, isOpen: true, isMinimized: false, zIndex: state.zIndexCounter + 1 }
              : w
          ),
        };
      }
      const newWindow: WindowInstance = {
        ...action.payload,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: state.zIndexCounter + 1,
        position: { x: 100 + (state.windows.length * 30), y: 100 + (state.windows.length * 30) },
      };
      return {
        ...state,
        windows: [...state.windows, newWindow],
        activeWindowId: action.payload.id,
        zIndexCounter: state.zIndexCounter + 1,
      };
    }
    case 'CLOSE':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.payload),
        activeWindowId: state.windows.length > 1 ? state.windows.filter(w => w.id !== action.payload).sort((a, b) => b.zIndex - a.zIndex)[0]?.id || null : null,
      };
    case 'FOCUS':
      return {
        ...state,
        activeWindowId: action.payload,
        zIndexCounter: state.zIndexCounter + 1,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, zIndex: state.zIndexCounter + 1, isMinimized: false } : w
        ),
      };
    case 'MINIMIZE':
      return {
        ...state,
        activeWindowId: null,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMinimized: true } : w
        ),
      };
    case 'MAXIMIZE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMaximized: !w.isMaximized } : w
        ),
      };
    case 'MOVE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, position: { x: action.payload.x, y: action.payload.y } } : w
        ),
      };
    case 'RESIZE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, size: { width: action.payload.width, height: action.payload.height } } : w
        ),
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        windows: action.payload,
        zIndexCounter: Math.max(...action.payload.map(w => w.zIndex), 10),
      };
    default:
      return state;
  }
}

interface DesktopIconDefinition {
  id: string;
  label: string;
  icon: React.ReactElement;
  component: React.ComponentType<any>;
  size: { width: number; height: number };
}

export default function App() {
  const [state, dispatch] = useReducer(windowReducer, INITIAL_STATE);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const DESKTOP_ICONS: DesktopIconDefinition[] = [
    {
      id: 'about',
      label: 'About.exe',
      icon: <Monitor size={32} fill="#4176CF" className="text-blue-200 drop-shadow-md" />,
      component: AboutMe,
      size: { width: 550, height: 450 }
    },
    {
      id: 'projects',
      label: 'Projects.exe',
      icon: <Folder size={32} fill="currentColor" className="text-yellow-400 drop-shadow-md" />,
      component: Projects,
      size: { width: 600, height: 500 }
    },
    {
      id: 'systems',
      label: 'Systems.exe',
      icon: <Globe size={32} fill="#3B82F6" className="text-white drop-shadow-md" />,
      component: Systems,
      size: { width: 500, height: 450 }
    },
    {
      id: 'experiments',
      label: 'Experiments.exe',
      icon: <FlaskConical size={32} fill="#A855F7" className="text-white drop-shadow-md" />,
      component: Experiments,
      size: { width: 450, height: 400 }
    },
    {
      id: 'resume',
      label: 'Resume.txt',
      icon: <FileText size={32} fill="white" className="text-red-500 drop-shadow-md" />,
      component: AboutMe,
      size: { width: 500, height: 400 }
    },
    {
      id: 'terminal',
      label: 'cmd.exe',
      icon: <Layout size={32} className="text-black drop-shadow-md" fill="#333" />,
      component: Terminal,
      size: { width: 600, height: 400 }
    },
    {
      id: 'contact',
      label: 'Contact.exe',
      icon: <Mail size={32} className="text-blue-100 drop-shadow-md" fill="#3B82F6" />,
      component: Contact,
      size: { width: 450, height: 420 }
    },
    {
      id: 'notepad',
      label: 'Notepad.exe',
      icon: <FileText size={32} className="text-gray-600 drop-shadow-md" fill="#fff" />,
      component: Notepad,
      size: { width: 500, height: 400 }
    },
    {
      id: 'monitor',
      label: 'SysMon.exe',
      icon: <Cpu size={32} className="text-green-600 drop-shadow-md" fill="#333" />,
      component: SystemMonitor,
      size: { width: 400, height: 500 }
    },
  ];

  const openWindow = useCallback((id: string) => {
    const iconDef = DESKTOP_ICONS.find(i => i.id === id);
    if (iconDef) {
      dispatch({
        type: 'OPEN',
        payload: {
          id: iconDef.id,
          title: iconDef.label,
          icon: iconDef.icon,
          component: iconDef.component,
          size: iconDef.size
        }
      });
    }
  }, [DESKTOP_ICONS]);

  useEffect(() => {
    const saved = localStorage.getItem('os_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // We only restore basic info, UI components can't be stringified
        const restored = parsed.map((w: any) => ({
          ...w,
          icon: DESKTOP_ICONS.find(i => i.id === w.id)?.icon || <FileText />,
          component: DESKTOP_ICONS.find(i => i.id === w.id)?.component || AboutMe,
        }));
        dispatch({ type: 'RESTORE_SESSION', payload: restored });
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }

    const timer = setTimeout(() => {
      // Set loader status after 2s
      const loader = document.getElementById('boot-status');
      if (loader) loader.innerText = 'loading';
      
      const readyTimer = setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) {
          bootScreen.style.opacity = '0';
          setTimeout(() => {
            bootScreen.style.display = 'none';
          }, 500);
        }
        openWindow('about');
      }, 1500);
      
      return () => clearTimeout(readyTimer);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Save window positions and sizes but NOT components/icons
    const toSave = state.windows.map(({ component, icon, ...rest }) => rest);
    localStorage.setItem('os_session', JSON.stringify(toSave));
  }, [state.windows]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const taskbarWindows = state.windows.map(w => ({
    id: w.id,
    title: w.title,
    icon: w.icon,
    active: state.activeWindowId === w.id
  }));

  return (
    <div
      className="w-full h-screen overflow-hidden relative bg-cover bg-center select-none bg-blue-500"
      style={{ backgroundImage: `url(${blissImage})` }}
      onContextMenu={handleContextMenu}
      onClick={() => {
        dispatch({ type: 'FOCUS', payload: '' });
        setIsStartMenuOpen(false);
        setContextMenu(null);
      }}
    >
      <div id="boot-screen" className="transition-opacity duration-500 z-[10000] absolute inset-0">
        <BootScreen />
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[10001] bg-[#ECE9D8] border border-gray-400 shadow-md py-1 min-w-[150px] text-xs font-tahoma"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default" onClick={() => { window.location.reload(); }}>Refresh</div>
          <div className="h-[1px] bg-gray-300 my-1 mx-1" />
          <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default opacity-50">New</div>
          <div className="px-4 py-1 hover:bg-[#316AC5] hover:text-white cursor-default">Properties</div>
        </div>
      )}

      {/* Desktop Icons Area */}
      <div className="absolute top-0 left-0 p-4 flex flex-col gap-2 z-0 pointer-events-auto" onClick={e => e.stopPropagation()}>
        {DESKTOP_ICONS.map(iconDef => (
          <DesktopIcon
            key={iconDef.id}
            label={iconDef.label}
            icon={iconDef.icon}
            onDoubleClick={() => openWindow(iconDef.id)}
          />
        ))}
      </div>

      {/* Windows Area */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden" onClick={e => e.stopPropagation()}>
        {state.windows.map(w => (
          <Window
            key={w.id}
            id={w.id}
            title={w.title}
            icon={React.cloneElement(w.icon as React.ReactElement<{ size?: number }>, { size: 14 })}
            zIndex={w.zIndex}
            active={state.activeWindowId === w.id}
            isMinimized={w.isMinimized}
            isMaximized={w.isMaximized}
            position={w.position}
            size={w.size}
            onClose={() => dispatch({ type: 'CLOSE', payload: w.id })}
            onFocus={() => dispatch({ type: 'FOCUS', payload: w.id })}
            onMinimize={() => dispatch({ type: 'MINIMIZE', payload: w.id })}
            onMaximize={() => dispatch({ type: 'MAXIMIZE', payload: w.id })}
            onMove={(x, y) => dispatch({ type: 'MOVE', payload: { id: w.id, x, y } })}
            onResize={(width, height) => dispatch({ type: 'RESIZE', payload: { id: w.id, width, height } })}
          >
            <w.component 
              onOpenWindow={openWindow} 
              dispatch={dispatch}
              windows={state.windows}
            />
          </Window>
        ))}
      </div>

      {/* Taskbar */}
      <div onClick={e => e.stopPropagation()} className="pointer-events-auto absolute bottom-0 w-full z-[9999]">
        {isStartMenuOpen && <StartMenu onOpenWindow={openWindow} onClose={() => setIsStartMenuOpen(false)} />}
        <Taskbar
          openWindows={taskbarWindows}
          onTaskClick={(id) => dispatch({ type: 'FOCUS', payload: id })}
          onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          isStartMenuOpen={isStartMenuOpen}
        />
      </div>
    </div>
  );
}