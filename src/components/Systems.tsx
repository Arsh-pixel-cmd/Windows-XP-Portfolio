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
      <div className="border-b-2 border-[#0058EE] pb-4 shrink-0">
        <h2 className="text-2xl font-bold text-[#0058EE] tracking-tight">System Design & Engineering Architecture</h2>
        <p className="text-xs text-gray-600 mt-1 uppercase font-bold tracking-widest">Protocol: High-Availability & Resilient Systems</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        {/* CORE_01: Event-Driven Kernel */}
        <section className="bg-white p-4 border border-gray-300 shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 bg-[#0058EE] text-white text-[10px] px-2 py-0.5 font-bold tracking-tighter">CORE_01</div>
          <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-gray-800">
            <div className="w-2 h-2 bg-[#0058EE] rounded-full animate-pulse" />
            Event-Driven Kernel Architecture
          </h3>
          <div className="text-[11px] leading-relaxed text-gray-700 space-y-2 mb-4">
            <p>Driven by a deterministic <b>Validate → Execute → Log</b> pipeline, the kernel ensures atomic state transitions across all subsystems. UI interactions never mutate state directly; they emit structured events to the system bus for centralized dispatching.</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Deterministic event resolution via purely functional reducers.</li>
              <li>Replayable event history for state rehydration and debugging.</li>
              <li>Strict decoupling of UI clients from core business logic.</li>
            </ul>
          </div>
          <pre className="mt-auto bg-gray-900 text-[#00FF41] p-3 text-[10px] font-mono rounded leading-tight">
{`[ Terminal / UI ]
      ↓
 [ Event Bus ]
      ↓
 [ Kernel Dispatcher ]
      ↓
 [ Reducer Execution ]
      ↓
 [ System State ]
      ↓
 [ Trace Logs ]`}
          </pre>
        </section>

        {/* CORE_02: Virtual File System */}
        <section className="bg-white p-4 border border-gray-300 shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 bg-[#0058EE] text-white text-[10px] px-2 py-0.5 font-bold tracking-tighter">CORE_02</div>
          <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-gray-800">
            <div className="w-2 h-2 bg-[#0058EE] rounded-full" />
            Virtual File System (VFS)
          </h3>
          <div className="text-[11px] leading-relaxed text-gray-700 space-y-3">
            <p>A hierarchical tree structure implementing stateless file operations. <b>Absolute path normalization</b> is enforced at the kernel level (C:/ root protection).</p>
            <div className="space-y-1">
              <p className="font-bold text-[10px] text-gray-500 uppercase">Operational Safety:</p>
              <ul className="list-none space-y-1 pl-1 italic">
                <li>• Root (C:/) deletion protection.</li>
                <li>• Circular move guards (cannot move into self).</li>
                <li>• Recursive deletion restricted to valid PIDs.</li>
              </ul>
            </div>
            <div className="p-2 bg-blue-50 border-l-2 border-blue-400">
              <p className="text-[10px] font-bold text-blue-800">Locking Lifecycle:</p>
              <p className="text-[10px]">Write locks are bound to active PIDs and automatically released on process termination or kernel-level crash recovery.</p>
            </div>
          </div>
        </section>

        {/* CORE_03: Process & Resource Model */}
        <section className="bg-white p-4 border border-gray-300 shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 bg-[#0058EE] text-white text-[10px] px-2 py-0.5 font-bold tracking-tighter">CORE_03</div>
          <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-gray-800">
            <div className="w-2 h-2 bg-[#0058EE] rounded-full" />
            Process-Oriented System Model
          </h3>
          <div className="text-[11px] leading-relaxed text-gray-700 space-y-3">
            <p>Every initialized window is isolated as a <b>Process Object with a unique PID</b>. System resources are managed via a priority-weighted scheduler.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 border-r border-gray-100 pr-2">
                <p className="font-bold text-[10px] text-gray-500 uppercase">Resource Load:</p>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[9px] font-mono"><span>CPU</span><span>NORMAL</span></div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[45%]" /></div>
                  <div className="flex justify-between text-[9px] font-mono"><span>MEM</span><span>SAFE</span></div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden"><div className="bg-green-500 h-full w-[30%]" /></div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-[10px] text-gray-500 uppercase">Backpressure:</p>
                <p className="text-[10px]">CPU triggers <b>Hysteresis Blocking</b> at 90% load; unblocks only when sustained load drops below 75%.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CORE_04: Failure Handling & Constraints */}
        <section className="bg-white p-4 border border-gray-300 shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 bg-[#0058EE] text-white text-[10px] px-2 py-0.5 font-bold tracking-tighter">CORE_04</div>
          <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-gray-800">
            <div className="w-2 h-2 bg-[#0058EE] rounded-full" />
            Failure Handling & Constraints
          </h3>
          <div className="text-[11px] leading-relaxed text-gray-700 space-y-3">
            <p>A deterministic crash model handles critical system breaches. The failure hierarchy prioritizes kernel stability over minor UI events.</p>
            <div className="font-mono text-[10px] bg-gray-50 p-2 rounded border border-gray-200">
              <div className="text-gray-500">1. VALIDATE EVENT -&gt; REJECT (SOFT)</div>
              <div className="text-orange-700">2. OVERLOAD THRESHOLD -&gt; BLOCK (WAIT)</div>
              <div className="text-red-700 font-bold">3. MEMORY CRITICAL -&gt; CRASH (HARD)</div>
            </div>
            <div className="text-[10px] space-y-1">
              <p><b>Snapshot Engine:</b> Full system state serialization (Import/Export) with 100% fidelity. Includes pending locks and scheduler ticks.</p>
              <p><b>No-Op Guards:</b> Redundant or irrelevant event signals (e.g., redundant focus) are ignored by the dispatcher to prevent bus noise.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-auto bg-blue-50 p-4 border-l-4 border-blue-600 text-xs italic text-blue-900 flex gap-3 items-center shrink-0">
        <ActivityIcon size={24} className="shrink-0" />
        "Engineering is not about avoiding problems; it's about building systems that handle them gracefully by design."
      </div>
    </div>
  );
};

export default Systems;
