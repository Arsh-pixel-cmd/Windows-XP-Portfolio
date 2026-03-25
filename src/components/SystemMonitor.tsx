import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Activity, List } from 'lucide-react';

interface SystemMonitorProps {
  windows: any[];
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({ windows }) => {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState<{ used: number; total: number } | null>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const framesRef = useRef(0);

  const animate = (time: number) => {
    framesRef.current++;
    if (time - lastTimeRef.current >= 1000) {
      setFps(Math.round((framesRef.current * 1000) / (time - lastTimeRef.current)));
      framesRef.current = 0;
      lastTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    
    const memInterval = setInterval(() => {
      if ((performance as any).memory) {
        const mem = (performance as any).memory;
        setMemory({
          used: Math.round(mem.usedJSHeapSize / 1024 / 1024),
          total: Math.round(mem.jsHeapSizeLimit / 1024 / 1024)
        });
      }
    }, 2000);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      clearInterval(memInterval);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] p-2 gap-4 font-tahoma overflow-auto select-none">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white border border-gray-400 p-2 shadow-inner flex flex-col items-center">
          <Activity size={24} className="text-green-600 mb-1" />
          <div className="text-xl font-bold">{fps}</div>
          <div className="text-[10px] uppercase text-gray-500">FPS</div>
        </div>
        <div className="bg-white border border-gray-400 p-2 shadow-inner flex flex-col items-center">
          <Cpu size={24} className="text-blue-600 mb-1" />
          <div className="text-xl font-bold">{memory ? `${memory.used}MB` : 'N/A'}</div>
          <div className="text-[10px] uppercase text-gray-500">Heap Used</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1 min-h-[150px]">
        <div className="flex items-center gap-1 text-xs font-bold border-b border-gray-400 pb-1">
          <List size={14} /> Processes
        </div>
        <div className="bg-white border border-gray-400 flex-1 overflow-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#D5D2C1] sticky top-0">
              <tr>
                <th className="px-2 py-1 border-r border-gray-400">Name</th>
                <th className="px-2 py-1 border-r border-gray-400">Status</th>
                <th className="px-2 py-1">Z-Index</th>
              </tr>
            </thead>
            <tbody>
              {windows.map(w => (
                <tr key={w.id} className="border-b border-gray-100 hover:bg-blue-50">
                  <td className="px-2 py-1 border-r border-gray-200">{w.title}</td>
                  <td className="px-2 py-1 border-r border-gray-200">
                    <span className={`px-1 rounded-[2px] ${w.isMinimized ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {w.isMinimized ? 'Suspended' : 'Running'}
                    </span>
                  </td>
                  <td className="px-2 py-1">{w.zIndex}</td>
                </tr>
              ))}
              {windows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-2 py-4 text-center text-gray-400 italic">No active processes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[10px] text-gray-500 flex justify-between italic">
        <span>Kernel: 5.15.0-react</span>
        <span>Uptime: {Math.floor(performance.now() / 1000)}s</span>
      </div>
    </div>
  );
};

export default SystemMonitor;
