import React from 'react';
import { Process, SystemState } from '../core/types';

interface AboutMeProps {
  process: Process;
  systemState: SystemState;
}

export const AboutMe: React.FC<AboutMeProps> = () => {
  return (
    <div className="p-6 h-full overflow-auto bg-white text-gray-800 leading-relaxed font-tahoma">
      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-1 inline-block">Arsh Mishra</h2>
          <p className="text-lg font-bold text-blue-800 mt-1">Full-Stack Engineer | AI Systems Builder</p>
          <p className="mt-4">
            I build production-grade applications that prioritize performance, scalability, and real-world usability.
            Currently a Computer Science student at IILM University (CGPA: 9.32), I focus on designing systems—not just interfaces.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 border border-blue-100 rounded">
            <h3 className="font-bold text-blue-800 flex items-center gap-2">🚀 Core Focus</h3>
            <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
              <li>AI-powered applications</li>
              <li>Scalable backend systems</li>
              <li>High-performance frontend</li>
              <li>Automation pipelines</li>
            </ul>
          </div>
          <div className="bg-orange-50 p-4 border border-orange-100 rounded">
            <h3 className="font-bold text-orange-800 flex items-center gap-2">🧠 Philosophy</h3>
            <p className="mt-2 text-xs">
              Architecture &gt; shortcuts<br/>
              Performance is non-negotiable<br/>
              Automation &gt; repetition
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 border-b pb-1 mb-2">Technical Prowess</h3>
          <div className="flex flex-wrap gap-2">
            {['Next.js', 'React', 'TypeScript', 'Node.js', 'Python', 'AI/LLM', 'Supabase', 'Firebase', 'AWS', 'Docker'].map(skill => (
              <span key={skill} className="px-2 py-1 bg-gray-100 border rounded text-[10px] font-bold text-gray-600">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-gray-900 text-white p-4 rounded shadow-lg">
          <p className="text-xs italic leading-relaxed opacity-90">
            "I don’t build projects for demonstration—I build systems that can handle real users, real data, and real constraints."
          </p>
        </section>
      </div>
    </div>
  );
};