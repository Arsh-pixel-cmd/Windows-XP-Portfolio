import React from 'react';
import { Cpu, List, XCircle } from 'lucide-react';
import { Process, SystemState } from '../core/types';
import { systemBus } from '../core/eventBus';

interface SystemMonitorProps {
  process: Process;
  systemState: SystemState;
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({ systemState }) => {
  const { resources, processes } = systemState;

  const handleKill = (pid: number) => {
    systemBus.emit({ type: 'PROC_KILL', payload: { pid } });
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] p-2 gap-4 font-tahoma overflow-auto select-none">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white border border-gray-400 p-2 shadow-inner flex flex-col items-center">
          <Cpu size={24} className="text-blue-600 mb-1" />
          <div className="text-xl font-bold">{Math.round(resources.memoryUsage)}MB</div>
          <div className="text-[10px] uppercase text-gray-500">Kernel Heap</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1 min-h-[150px]">
        <div className="flex items-center gap-1 text-xs font-bold border-b border-gray-400 pb-1">
          <List size={14} /> Process Explorer
        </div>
        <div className="bg-white border border-gray-400 flex-1 overflow-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#D5D2C1] sticky top-0">
              <tr>
                <th className="px-2 py-1 border-r border-gray-400">PID</th>
                <th className="px-2 py-1 border-r border-gray-400">Name</th>
                <th className="px-2 py-1 border-r border-gray-400">CPU</th>
                <th className="px-2 py-1 border-r border-gray-400">MEM</th>
                <th className="px-2 py-1 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(p => (
                <tr key={p.pid} className="border-b border-gray-100 hover:bg-blue-50 group">
                  <td className="px-2 py-1 border-r border-gray-200 font-mono text-gray-500">{p.pid}</td>
                  <td className="px-2 py-1 border-r border-gray-200 font-bold">{p.name}</td>
                  <td className="px-2 py-1 border-r border-gray-200">{p.cpu.toFixed(1)}%</td>
                  <td className="px-2 py-1 border-r border-gray-200">{p.memory.toFixed(1)}MB</td>
                  <td className="px-2 py-1 text-center">
                    <button 
                      onClick={() => handleKill(p.pid)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                      title="Terminate Process"
                    >
                      <XCircle size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {processes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-2 py-4 text-center text-gray-400 italic">No active processes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-900 p-2 border border-gray-600">
         <div className="text-[10px] text-green-500 font-mono flex flex-col">
            <span>{'>'} CPU LOAD: {resources.cpuLoad.toFixed(2)}%</span>
            <span>{'>'} SYS_STABILITY: NOMINAL</span>
         </div>
      </div>

      <div className="text-[10px] text-gray-500 flex justify-between italic">
        <span>Arsh Kernel v4.0.0-lts</span>
        <span>Uptime: {Math.floor(performance.now() / 1000)}s</span>
      </div>
    </div>
  );
};

export default SystemMonitor;
