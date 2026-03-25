import React from 'react';
import { Process, SystemState } from '../core/types';

interface ExperimentsProps {
  process: Process;
  systemState: SystemState;
}

export const Experiments: React.FC<ExperimentsProps> = () => {
  return (
    <div className="p-6 h-full overflow-auto bg-[#F0F0F0] text-gray-900 font-tahoma selection:bg-[#316AC5] selection:text-white">
      <div className="flex items-center justify-between border-b-2 border-purple-600 pb-4 mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase tracking-[-0.02em]">R&D Lab: Engineering Experimentation Log</h2>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Classification: Internal Technical Documentation // Ref: RD-XP-2026</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold text-purple-700">KERNEL_VER: 1.0.0</p>
          <p className="text-[10px] text-gray-400">STATUS: VERIFIED</p>
        </div>
      </div>

      <div className="space-y-12 max-w-4xl pb-10">
        {/* DevLens Ultra */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm">EXP_01</span>
            <h3 className="text-lg font-bold border-b border-gray-300 flex-1">DevLens Ultra</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6 pl-4 border-l-2 border-gray-200">
            <div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Problem</h4>
              <p className="text-[13px] leading-relaxed text-gray-800">Reconstructing UI components from browser-rendered DOM is slow and inconsistent. Computed styles include browser defaults, cascading overrides, and pseudo-element rules, making direct mapping unreliable.</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Approach</h4>
              <p className="text-[13px] leading-relaxed text-gray-800">Built a DOM traversal pipeline that walks ~300+ nodes per view and extracts computed styles. Applied filtering to remove browser-default values and normalize style noise. Mapped extracted styles into Tailwind-compatible tokens, preserving layout and spacing semantics. Handled pseudo-elements and complex rules (e.g., calc()) through rule flattening and normalization.</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Result</h4>
              <p className="text-[13px] leading-relaxed text-gray-800">Reduced manual UI reconstruction effort by eliminating redundant style interpretation. Generated structurally consistent component representations from heterogeneous DOM trees. Limitations remain in handling highly dynamic layouts and deeply nested conditional styles.</p>
            </div>
          </div>
        </section>

        {/* PDF Parsing */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm">EXP_02</span>
            <h3 className="text-lg font-bold border-b border-gray-300 flex-1">PDF Parsing Experiments (SmartSpend)</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6 pl-4 border-l-2 border-gray-200">
            <div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Problem</h4>
              <p className="text-[13px] leading-relaxed text-gray-800">Bank statements vary significantly across institutions, with inconsistent layouts, merged cells, and non-standard formatting. Rule-based parsing fails on edge cases, while AI-based extraction introduces variability.</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Approach</h4>
              <div className="space-y-3">
                <p className="text-[13px] leading-relaxed text-gray-800 italic">Tested multiple parsing strategies across real statement samples:</p>
                <ul className="list-disc list-inside text-[13px] text-gray-800 pl-2 space-y-1">
                  <li>Rule-based parsing using pattern matching and positional heuristics</li>
                  <li>AI-based extraction using multimodal models (Gemini / Groq)</li>
                  <li>Hybrid pipeline combining rule validation with AI fallback</li>
                </ul>
                <p className="text-[13px] leading-relaxed text-gray-800">Implemented validation layers to detect malformed outputs and fallback mechanisms when extraction confidence drops. Handled edge cases such as multi-line transactions, missing headers, and inconsistent date formats.</p>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Result</h4>
              <p className="text-[13px] leading-relaxed text-gray-800">Improved robustness of transaction extraction across heterogeneous PDF formats. Achieved consistent parsing behavior under mixed layouts using hybrid validation. Limitations include sensitivity to highly unstructured documents and dependency on model output stability.</p>
            </div>
          </div>
        </section>

        {/* Event-Driven Kernel */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm">EXP_03</span>
            <h3 className="text-lg font-bold border-b border-gray-300 flex-1">Event-Driven System Kernel</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6 pl-4 border-l-2 border-gray-200">
            <div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Problem</h4>
              <p className="text-[13px] leading-relaxed text-gray-800">UI-driven state management leads to implicit side effects, race conditions, and non-deterministic behavior in multi-window environments.</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Approach</h4>
              <div className="space-y-3">
                <p className="text-[13px] leading-relaxed text-gray-800">Designed an event-driven execution model with a centralized dispatcher. Implemented a strict pipeline:</p>
                <div className="font-mono text-[11px] bg-gray-200 p-2 border border-blue-400/30 rounded inline-block text-blue-900 border-l-4">
                  VALIDATE → EXECUTE → LOG
                </div>
                <p className="text-[13px] leading-relaxed text-gray-800">All state transitions are atomic and driven by structured events. Separated concerns: UI emits events, Kernel validates and executes, State is updated deterministically. Added event logging and replay capability to trace and reproduce system behavior.</p>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-1.5 underline decoration-purple-200 decoration-2">Result</h4>
              <p className="text-[13px] leading-relaxed text-gray-800">Eliminated implicit state mutations and improved predictability of system behavior. Enabled full traceability of state transitions through event logs. Supports deterministic replay for debugging and verification. Tradeoff: increased architectural complexity compared to direct UI state updates.</p>
            </div>
          </div>
        </section>

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
