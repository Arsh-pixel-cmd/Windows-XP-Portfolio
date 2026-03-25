import React from 'react';

export const Systems: React.FC = () => {
  return (
    <div className="p-6 flex flex-col gap-6 h-full overflow-auto bg-white text-gray-800">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-blue-800">Engineering Philosophy</h2>
        <p className="text-sm text-gray-500 mt-1">Proof of my approach to building high-end systems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center shrink-0">
              <span className="font-bold text-blue-600">01</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Architecture First</h3>
              <p className="text-xs leading-relaxed text-gray-600">
                I design data flow, potential failure points, and scalability constraints before writing a single line of production code.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded bg-orange-100 flex items-center justify-center shrink-0">
              <span className="font-bold text-orange-600">02</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Performance Driven</h3>
              <p className="text-xs leading-relaxed text-gray-600">
                Optimization for real-world conditions: handling large datasets, slow connections, and complex edge cases without regression.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center shrink-0">
              <span className="font-bold text-green-600">03</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Automation &gt; Repetition</h3>
              <p className="text-xs leading-relaxed text-gray-600">
                Reducing manual overhead through AI-driven pipelines, trigger-based systems, and sophisticated background job management.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center shrink-0">
              <span className="font-bold text-purple-600">04</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Reliability & Scale</h3>
              <p className="text-xs leading-relaxed text-gray-600">
                Designing for failure, implementing retries, data validation, and idempotency to ensure production systems remain resilient.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto bg-gray-50 p-4 border rounded italic text-center text-xs text-gray-500">
        "I build systems that can handle real users, real data, and real constraints."
      </div>
    </div>
  );
};
