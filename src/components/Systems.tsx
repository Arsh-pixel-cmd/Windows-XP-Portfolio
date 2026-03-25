import React from 'react';
import { Process, SystemState } from '../core/types';

interface SystemsProps {
  process: Process;
  systemState: SystemState;
}

const ActivityIcon = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const Systems: React.FC<SystemsProps> = () => {
  return (
    <div className="p-6 flex flex-col gap-8 h-full overflow-auto bg-[#F0F0F0] text-gray-900 font-tahoma selection:bg-[#316AC5] selection:text-white">
      <div className="border-b-2 border-[#0058EE] pb-4">
        <h2 className="text-2xl font-bold text-[#0058EE] tracking-tight">System Design & Engineering Architecture</h2>
        <p className="text-xs text-gray-600 mt-1 uppercase font-bold tracking-widest">Protocol: High-Availability & Resilient Systems</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-white p-4 border border-gray-300 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#0058EE] text-white text-[10px] px-2 py-0.5 font-bold">CORE_01</div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              State-First Architecture
            </h3>
            <p className="text-xs leading-relaxed text-gray-700 mb-4">
              Moving beyond UI-driven state to a centralized, action-based dispatcher system. This ensures predictable data flow and atomic updates across the entire OS environment.
            </p>
            <pre className="bg-gray-900 text-green-400 p-3 text-[10px] font-mono rounded overflow-x-auto">
{`[UI Layer] -> [Dispatcher] -> [Global Store]
     ^             |              |
     |_____________v______________v
       (Actions)      (Reducers)    (State)`}
            </pre>
          </section>

          <section className="bg-white p-4 border border-gray-300 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] px-2 py-0.5 font-bold">CORE_02</div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              Fault Tolerance & Failovers
            </h3>
            <p className="text-xs leading-relaxed text-gray-700 mb-4">
              Implementation of exponential backoff, circuit breakers, and optimistic UI updates to handle unstable network conditions and API failures without service interruption.
            </p>
            <div className="bg-gray-100 p-2 rounded border border-gray-200">
               <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tighter">Case Study: Resilient Email Dispatch</div>
               <div className="flex gap-1 text-[9px] font-mono">
                  <span className="text-blue-600">[Retry 1: 500ms]</span>
                  <span className="text-orange-600">[Retry 2: 2s]</span>
                  <span className="text-red-600">[Retry 3: 10s]</span>
                  <span className="text-gray-500">[Queue: Dead Letter]</span>
               </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
           <section className="bg-white p-4 border border-gray-300 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] px-2 py-0.5 font-bold">OP_01</div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Performance Bottlenecks
            </h3>
            <p className="text-xs leading-relaxed text-gray-700 mb-4">
              Analysis of render cycles and memory leaks. Utilizing React.memo and useMemo for virtualization, ensuring sub-5ms render times even with complex, interactive multi-window environments.
            </p>
            <pre className="bg-gray-900 text-blue-400 p-3 text-[10px] font-mono rounded overflow-x-auto leading-tight">
{`Total Heap Size:   [####------] 42%
FPS (Current):     [##########] 60
GC Cycles:         [#---------] 1`}
            </pre>
          </section>

          <section className="bg-white p-4 border border-gray-300 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] px-2 py-0.5 font-bold">SEC_01</div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              Data Persistence & Rehydration
            </h3>
            <p className="text-xs leading-relaxed text-gray-700">
              Sophisticated session recovery using local-first strategies. Serializing active process states into local storage and re-instantiating UI components with minimal overhead.
            </p>
          </section>
        </div>
      </div>

      <div className="mt-auto bg-blue-50 p-4 border-l-4 border-blue-600 text-xs italic text-blue-900 flex gap-3 items-center">
        <ActivityIcon size={24} className="shrink-0" />
        "Engineering is not about avoiding problems; it's about building systems that handle them gracefully by design."
      </div>
    </div>
  );
};

export default Systems;
