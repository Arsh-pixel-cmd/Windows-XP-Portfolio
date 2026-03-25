import React from 'react';
import { Info, MousePointer2, Terminal, Cpu } from 'lucide-react';

export const NavigationTips: React.FC = () => {
  return (
    <div className="h-full bg-[#FFFFE1] flex flex-col font-tahoma text-gray-800 shadow-[inset_0_0_40px_rgba(0,0,0,0.03)] selection:bg-[#316AC5] selection:text-white">
      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-gray-300 pb-3">
          <div className="shrink-0 text-blue-600 bg-white p-1.5 rounded-full shadow-sm border border-blue-100">
            <Info size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight text-[#003399]">System Explorer Guide</h3>
            <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Navigation Protocol v1.0</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex gap-4 items-start group">
            <div className="p-2 bg-white rounded border border-gray-200 shadow-sm text-blue-500 mt-0.5 group-hover:border-blue-300 transition-colors">
              <MousePointer2 size={16} />
            </div>
            <div className="text-[13px] leading-snug">
              <p className="font-bold text-[#003399] mb-0.5 whitespace-nowrap">Interactive Desktop</p>
              <p className="text-gray-600">Double-click icons to launch apps. Drag icons to re-organize your workspace.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start group">
            <div className="p-2 bg-white rounded border border-gray-200 shadow-sm text-gray-700 mt-0.5 group-hover:border-gray-400 transition-colors">
              <Terminal size={16} />
            </div>
            <div className="text-[13px] leading-snug">
              <p className="font-bold text-[#003399] mb-0.5 whitespace-nowrap">Technical Access</p>
              <p className="text-gray-600">Use <span className="font-mono bg-white px-1 border border-gray-200 rounded text-[11px]">cmd.exe</span> for data inspection and low-level system commands.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start group">
            <div className="p-2 bg-white rounded border border-gray-200 shadow-sm text-purple-600 mt-0.5 group-hover:border-purple-300 transition-colors">
              <Cpu size={16} />
            </div>
            <div className="text-[13px] leading-snug">
              <p className="font-bold text-[#003399] mb-0.5 whitespace-nowrap">Architecture Panel</p>
              <p className="text-gray-600">Explore <span className="font-bold text-blue-700 underline decoration-blue-200">Systems.exe</span> to understand the deterministic kernel powering this simulator.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed border-gray-300">
           <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
             <p className="text-[11px] font-bold text-blue-800 italic leading-relaxed">
               "Tip: Check the Experiments log to see the engineering tradeoffs made for each project."
             </p>
           </div>
        </div>
      </div>

      <div className="px-6 py-2 bg-[#F0F0E0] border-t border-gray-300 text-[10px] text-gray-500 font-bold shrink-0">
        Status: Explorer Active // Arsh-OS
      </div>
    </div>
  );
};

export default NavigationTips;
