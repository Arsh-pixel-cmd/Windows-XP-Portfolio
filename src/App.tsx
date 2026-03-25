import React, { useState } from 'react';
import { Folder, FileText, Mail, Monitor, Globe, FlaskConical } from 'lucide-react';
import { DesktopIcon } from './components/DesktopIcon';
import { Taskbar } from './components/Taskbar';
import { Window } from './components/Window';
import { Projects } from './components/Projects';
import { AboutMe } from './components/AboutMe';
import { Contact } from './components/Contact';
import blissImage from './assets/bliss.png';
import { StartMenu } from './components/StartMenu';
import { Systems } from './components/Systems';
import { Terminal } from '@/components/Terminal';
import { Experiments } from './components/Experiments';

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
  component: React.ReactNode;
  size: { width: number; height: number };
}

export default function App() {
  const [windows, setWindows] = useState<{ id: string; zIndex: number }[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  const openWindow = (id: string) => {
    if (windows.find(w => w.id === id)) {
      focusWindow(id);
      return;
    }
    const newZIndex = zIndexCounter + 1;
    setZIndexCounter(newZIndex);
    setWindows([...windows, { id, zIndex: newZIndex }]);
    setActiveWindow(id);
  };

  const DESKTOP_ICONS: DesktopIconDefinition[] = [
    {
      id: 'about',
      label: 'About.exe',
      icon: <Monitor size={32} fill="#4176CF" className="text-blue-200 drop-shadow-md" />,
      component: <AboutMe />,
      size: { width: 550, height: 450 }
    },
    {
      id: 'projects',
      label: 'Projects.exe',
      icon: <Folder size={32} fill="currentColor" className="text-yellow-400 drop-shadow-md" />,
      component: <Projects />,
      size: { width: 600, height: 500 }
    },
    {
      id: 'systems',
      label: 'Systems.exe',
      icon: <Globe size={32} fill="#3B82F6" className="text-white drop-shadow-md" />,
      component: <Systems />,
      size: { width: 500, height: 450 }
    },
    {
      id: 'experiments',
      label: 'Experiments.exe',
      icon: <FlaskConical size={32} fill="#A855F7" className="text-white drop-shadow-md" />,
      component: <Experiments />,
      size: { width: 450, height: 400 }
    },
    {
      id: 'resume',
      label: 'Resume.txt',
      icon: <FileText size={32} fill="white" className="text-red-500 drop-shadow-md" />,
      component: <AboutMe />,
      size: { width: 500, height: 400 }
    },
    {
      id: 'terminal',
      label: 'cmd.exe',
      icon: <Globe size={32} className="text-black drop-shadow-md" fill="#333" />,
      component: <Terminal onOpenProject={() => openWindow('projects')} />,
      size: { width: 600, height: 400 }
    },
    {
      id: 'contact',
      label: 'Contact.exe',
      icon: <Mail size={32} className="text-blue-100 drop-shadow-md" fill="#3B82F6" />,
      component: <Contact />,
      size: { width: 450, height: 420 }
    },
  ];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
      openWindow('about');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeWindow) {
        closeWindow(activeWindow);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindow]);


  const closeWindow = (id: string) => {
    setWindows(prev => {
      const remaining = prev.filter(w => w.id !== id);
      if (activeWindow === id && remaining.length > 0) {
        const highest = remaining.reduce((p, c) => (p.zIndex > c.zIndex) ? p : c);
        setActiveWindow(highest.id);
      } else if (remaining.length === 0) {
        setActiveWindow(null);
      }
      return remaining;
    });
  };

  const focusWindow = (id: string) => {
    if (activeWindow === id) return;
    const newZIndex = zIndexCounter + 1;
    setZIndexCounter(newZIndex);
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: newZIndex } : w));
    setActiveWindow(id);
  };

  const taskbarWindows = windows.map(w => {
    const iconDef = DESKTOP_ICONS.find(i => i.id === w.id)!;
    return {
      id: w.id,
      title: iconDef.label,
      icon: iconDef.icon,
      active: activeWindow === w.id
    };
  });

  return (
    <div
      className="w-full h-screen overflow-hidden relative bg-cover bg-center select-none bg-blue-500"
      style={{ backgroundImage: `url(${blissImage})` }}
      onClick={() => {
        setActiveWindow(null);
        setIsStartMenuOpen(false);
      }}
    >
      {isBooting && <BootScreen />}
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
        {windows.map(w => {
          const iconDef = DESKTOP_ICONS.find(i => i.id === w.id)!;
          return (
            <Window
              key={w.id}
              id={w.id}
              title={iconDef.label}
              icon={React.cloneElement(iconDef.icon as React.ReactElement<{ size?: number }>, { size: 14 })}
              zIndex={w.zIndex}
              onClose={() => closeWindow(w.id)}
              onFocus={() => focusWindow(w.id)}
              defaultSize={iconDef.size}
            >
              {iconDef.component}
            </Window>
          );
        })}
      </div>

      {/* Taskbar */}
      <div onClick={e => e.stopPropagation()} className="pointer-events-auto absolute bottom-0 w-full z-[9999]">
        {isStartMenuOpen && <StartMenu onOpenWindow={openWindow} onClose={() => setIsStartMenuOpen(false)} />}
        <Taskbar
          openWindows={taskbarWindows}
          onTaskClick={focusWindow}
          onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          isStartMenuOpen={isStartMenuOpen}
        />
      </div>
    </div>
  );
}