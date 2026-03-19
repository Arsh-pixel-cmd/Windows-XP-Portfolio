import React, { useState } from 'react';
import { Folder, FileText, Mail } from 'lucide-react';
import { DesktopIcon } from './components/DesktopIcon';
import { Taskbar } from './components/Taskbar';
import { Window } from './components/Window';
import { Projects } from './components/Projects';
import { AboutMe } from './components/AboutMe';
import { Contact } from './components/Contact';

// Configuration
interface DesktopIconDefinition {
  id: string;
  label: string;
  icon: React.ReactElement;
  component: React.ReactNode;
  size: { width: number; height: number };
}

const DESKTOP_ICONS: DesktopIconDefinition[] = [
  { 
    id: 'projects', 
    label: 'My Projects', 
    icon: <Folder size={32} fill="currentColor" className="text-yellow-400 drop-shadow-md" />, 
    component: <Projects />, 
    size: { width: 600, height: 450 } 
  },
  { 
    id: 'resume', 
    label: 'Resume.pdf', 
    icon: <FileText size={32} fill="white" className="text-red-500 drop-shadow-md" />, 
    component: <AboutMe />, 
    size: { width: 500, height: 400 } 
  },
  { 
    id: 'contact', 
    label: 'Contact Me', 
    icon: <Mail size={32} className="text-blue-100 drop-shadow-md" fill="#3B82F6" />, 
    component: <Contact />, 
    size: { width: 450, height: 420 } 
  },
];

export default function App() {
  const [windows, setWindows] = useState<{ id: string; zIndex: number }[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);

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

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindow === id) {
      const remaining = windows.filter(w => w.id !== id);
      if (remaining.length > 0) {
        // Find highest zIndex
        const highest = remaining.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current);
        setActiveWindow(highest.id);
      } else {
        setActiveWindow(null);
      }
    }
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
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1691359065595-7c74aad7ab20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2xsaW5nJTIwZ3JlZW4lMjBoaWxscyUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzM5MjY0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080')` }}
      onClick={() => setActiveWindow(null)} // Click desktop to unfocus
    >
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
        <Taskbar openWindows={taskbarWindows} onTaskClick={focusWindow} />
      </div>
    </div>
  );
}