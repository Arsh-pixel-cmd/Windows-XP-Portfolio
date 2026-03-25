import React from 'react';
import { FlaskConical, Terminal, Zap, CheckCircle2 } from 'lucide-react';

export const Experiments: React.FC = () => {
  const experiments = [
    {
      id: 'devlens',
      title: 'DevLens Ultra',
      tag: 'CHROME EXTENSION',
      problem: 'Manual CSS-to-React conversion is a 10kb/hr bottleneck in rapid prototyping.',
      approach: 'Built a tree-walking algorithm that scrapes 300+ computed styles and maps them to custom Tailwind configuration tokens.',
      result: 'Reduced UI replication time by 85%. Successfully handles complex pseudo-elements and calc() mappings.'
    },
    {
      id: 'neural',
      title: 'Neural Visualizer',
      tag: 'AI / WEBGL',
      problem: 'Interpreting multi-dimensional neural weights is non-intuitive for non-experts.',
      approach: 'Leveraged Three.js GPGPU computations to visualize 10k+ neurons as particle systems driven by real-time inference data.',
      result: 'Implemented a 60FPS interactive 3D map of LLM attention layers. Zero GPU memory leaks over 1hr sessions.'
    }
  ];

  return (
    <div className="p-6 h-full overflow-auto bg-[#F3F3F3] text-gray-900 font-tahoma selection:bg-[#316AC5] selection:text-white">
      <div className="flex items-center gap-3 border-b-2 border-purple-500 pb-4 mb-8">
        <FlaskConical className="text-purple-600" size={32} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">R&D Lab: Technical Experiments</h2>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Experimental Build // v2.0.4-beta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {experiments.map((exp) => (
          <div key={exp.id} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-white border border-gray-300 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">{exp.title}</h3>
                <span className="px-2 py-0.5 bg-gray-900 text-[9px] font-black text-white tracking-tighter uppercase">{exp.tag}</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="shrink-0 mt-1 text-red-500"><Terminal size={14} /></div>
                  <div>
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter block mb-0.5">Problem</span>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">{exp.problem}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 mt-1 text-blue-500"><Zap size={14} /></div>
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter block mb-0.5">Approach</span>
                    <p className="text-xs text-gray-700 leading-relaxed">{exp.approach}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 mt-1 text-green-500"><CheckCircle2 size={14} /></div>
                  <div>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter block mb-0.5">Result</span>
                    <p className="text-xs text-gray-700 leading-relaxed italic">{exp.result}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-4 bg-gray-900 text-purple-400 border-l-4 border-purple-500 text-[11px] font-mono">
        {'>'} LOG: All experiments are sandboxed. Performance data is averages across 100 iterations.
      </div>
    </div>
  );
};
