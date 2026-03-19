import React, { useState } from 'react';
import { Folder, FileText, Mail, Monitor, Globe, Trash2 } from 'lucide-react';
import { DesktopIcon } from './components/DesktopIcon';
import { Taskbar } from './components/Taskbar';
import { Window } from './components/Window';
import { Projects } from './components/Projects';
import { AboutMe } from './components/AboutMe';
import { Contact } from './components/Contact';
import blissImage from './assets/bliss.png';
import { StartMenu } from './components/StartMenu';

// Mock components for new icons
const MyComputer = () => (
  <div className="p-4 flex flex-col gap-4">
    <div className="flex items-center gap-2 border-b pb-2">
      <Monitor className="text-blue-500" size={24} />
      <h2 className="text-lg font-bold">System Information</h2>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="font-bold">Computer Name:</div>
      <div>XP-PORTFOLIO-PC</div>
      <div className="font-bold">Processor:</div>
      <div>DeepMind Agent Core™ 1.0</div>
      <div className="font-bold">Memory:</div>
      <div>64 GB RAM</div>
      <div className="font-bold">OS Version:</div>
      <div>Windows XP Professional (Agentic Edition)</div>
    </div>
  </div>
);

const NetworkNeighborhood = () => (
  <div className="p-8 flex flex-col items-center justify-center h-full text-center gap-4 text-gray-500 italic">
    <Globe size={64} className="opacity-20" />
    <p>Searching for computers in the network...</p>
    <p className="text-xs">No other devices found in the current workgroup.</p>
  </div>
);

const RecycleBin = () => (
  <div className="p-4 flex flex-col gap-2 h-full">
    <div className="flex-1 border-2 border-gray-100 bg-white shadow-inner p-2 overflow-auto">
       <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center gap-1 opacity-50 grayscale">
             <FileText size={32} />
             <span className="text-[10px] text-center">old_resume_v1.pdf</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-50 grayscale">
             <FileText size={32} />
             <span className="text-[10px] text-center">unfinished_project.zip</span>
          </div>
       </div>
    </div>
    <div className="text-[11px] text-gray-500 italic">2 items (1.2 MB total)</div>
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

const DESKTOP_ICONS: DesktopIconDefinition[] = [
  { 
    id: 'computer', 
    label: 'My Computer', 
    icon: <Monitor size={32} fill="#4176CF" className="text-blue-200 drop-shadow-md" />, 
    component: <MyComputer />, 
    size: { width: 450, height: 350 } 
  },
  { 
    id: 'network', 
    label: 'Network Neighborhood', 
    icon: <Globe size={32} fill="#3B82F6" className="text-white drop-shadow-md" />, 
    component: <NetworkNeighborhood />, 
    size: { width: 400, height: 350 } 
  },
  { 
    id: 'trash', 
    label: 'Recycle Bin', 
    icon: <Trash2 size={32} fill="#E2E8F0" className="text-gray-400 drop-shadow-md" />, 
    component: <RecycleBin />, 
    size: { width: 400, height: 400 } 
  },
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
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

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
      style={{ backgroundImage: `url(${blissImage})` }}
      onClick={() => {
        setActiveWindow(null);
        setIsStartMenuOpen(false);
      }} // Click desktop to unfocus and close start menu
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
        {isStartMenuOpen && <StartMenu onClose={() => setIsStartMenuOpen(false)} />}
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