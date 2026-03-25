import React from 'react';
import { Globe, Cpu, FlaskConical } from 'lucide-react';

export const Experiments: React.FC = () => {
  return (
    <div className="p-6 h-full overflow-auto bg-white text-gray-800 font-tahoma">
      <div className="flex items-center gap-3 border-b pb-4 mb-6">
        <FlaskConical className="text-purple-600" size={32} />
        <div>
          <h2 className="text-xl font-bold">Lab Experiments</h2>
          <p className="text-xs text-gray-500">Bleeding-edge builds and technical explorations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer group">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 group-hover:text-purple-700">DevLens Ultra</h3>
            <span className="px-2 py-0.5 bg-gray-200 text-[10px] font-bold rounded">CHROME EXTENSION</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 mb-3">
            A specialized tool for reverse engineering web interfaces. Scans 300+ computed styles and converts them into production-ready React + Tailwind components.
          </p>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600">
              <Cpu size={12} />
              <span>Performance Optimized</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
              <Globe size={12} />
              <span>60 FPS Rendering</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer group">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 group-hover:text-purple-700">Neural Visualizer</h3>
            <span className="px-2 py-0.5 bg-gray-200 text-[10px] font-bold rounded">AI / WEBGL</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 mb-3">
             Experimental 3D visualization platform for mapping neural network activation patterns in real-time. Built using Three.js and custom GLSL shaders.
          </p>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600">
              <Cpu size={12} />
              <span>Real-time Inference</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-purple-900 text-white rounded text-xs text-center font-bold">
        "Theory is cheap. Show me the experiments."
      </div>
    </div>
  );
};
