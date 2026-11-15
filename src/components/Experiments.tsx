import React, { useState, useEffect } from 'react';
import { Process, SystemState } from '../core/types';
import { portfolioStore } from '../core/portfolioStore';
import { ExperimentItem } from '../types/portfolio';

interface ExperimentsProps {
  process: Process;
  systemState: SystemState;
}

export const Experiments: React.FC<ExperimentsProps> = () => {
  const [experiments, setExperiments] = useState<ExperimentItem[]>(portfolioStore.getData().experiments);

  useEffect(() => {
    const unsub = portfolioStore.subscribe(data => setExperiments(data.experiments));
    return () => { unsub(); };
  }, []);

  return (
    <div className="p-6 h-full overflow-auto bg-[#F0F0F0] text-gray-900 font-tahoma selection:bg-[#316AC5] selection:text-white select-text">
      <div className="flex items-center justify-between border-b-2 border-purple-600 pb-4 mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase tracking-[-0.02em]">R&D Lab: Engineering Experimentation Log</h2>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Classification: Internal Technical Documentation // Ref: RD-XP-2026</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold text-purple-700">KERNEL_VER: 4.0.0</p>
          <p className="text-[10px] text-gray-400">STORAGE: CLOUDFLARE D1</p>
        </div>
      </div>

      <div className="space-y-12 max-w-4xl pb-10">
        {experiments.map((exp) => (
          <section key={exp.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm">
                {exp.tag}
              </span>
              <h3 className="text-lg font-bold border-b border-gray-300 flex-1">{exp.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6 pl-4 border-l-2 border-gray-200">
              <div>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Problem</h4>
                <p className="text-[13px] leading-relaxed text-gray-800">{exp.problem}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Approach</h4>
                <p className="text-[13px] leading-relaxed text-gray-800">{exp.approach}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Result</h4>
                <p className="text-[13px] leading-relaxed text-gray-800">{exp.result}</p>
              </div>
            </div>
          </section>
        ))}

        {/* Engineering Notes */}
        <div className="mt-12 bg-[#ECE9D8] p-6 border border-gray-400 shadow-[inset_1px_1px_1px_#fff,2px_2px_5px_rgba(0,0,0,0.1)] space-y-4 border-l-[10px] border-l-purple-600">
          <h4 className="text-xs font-black text-gray-700 uppercase tracking-[0.2em] border-b border-gray-400 pb-2 flex items-center gap-2">
            Engineering Notes
          </h4>
          <div className="text-[12px] leading-relaxed text-gray-700 space-y-3 font-medium">
            <p>• Experiments focus on constraint-driven problem solving, not visual output.</p>
            <p>• Systems are designed for deterministic behavior and traceability.</p>
            <p>• Emphasis is on stability under real-world edge cases rather than peak performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experiments;
