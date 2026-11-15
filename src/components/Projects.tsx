import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Rocket } from 'lucide-react';
import { Process, SystemState } from '../core/types';
import { portfolioStore } from '../core/portfolioStore';
import { ProjectItem } from '../types/portfolio';

interface ProjectsProps {
  process: Process;
  systemState: SystemState;
}

export const Projects: React.FC<ProjectsProps> = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(portfolioStore.getData().projects);

  useEffect(() => {
    const unsub = portfolioStore.subscribe(data => setProjects(data.projects));
    return () => { unsub(); };
  }, []);

  return (
    <div className="h-full bg-white flex flex-col font-tahoma select-text">
      <div className="bg-[#F0F0E0] p-4 border-b border-[#D4D0C8] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-bold text-gray-800">C:\Users\Arsh\Documents\Projects</h2>
          <p className="text-xs text-gray-500">{projects.length} objects available • Powered by Cloudflare D1</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-white border border-gray-400 text-xs shadow-sm hover:bg-gray-50 cursor-pointer">
            View Details
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 custom-scrollbar text-gray-900 selection:bg-[#316AC5] selection:text-white">
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project, idx) => (
            <div key={project.id || idx} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Rocket size={16} />
                  <h3 className="font-bold">{project.title}</h3>
                </div>
                <div className="flex gap-2">
                  {project.github && project.github !== '#' && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">
                      <Github size={16} />
                    </a>
                  )}
                  {project.link && project.link !== '#' && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <p className="text-sm font-bold text-gray-700">{project.description}</p>
                    {project.impact && (
                      <p className="text-xs text-blue-800 mt-1 font-bold">{project.impact}</p>
                    )}
                  </div>
                  
                  {project.details && project.details.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Key Engineering</p>
                      <ul className="text-xs space-y-1">
                        {project.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-3 border-l border-gray-100 flex flex-col gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tech Stack</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.tech.map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-white border border-gray-200 text-[10px] rounded leading-none">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                    <p className="text-xs font-bold text-green-700">{project.status}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-[#F0F0E0] px-4 py-1 border-t border-[#D4D0C8] text-[10px] text-gray-600 shrink-0 flex justify-between">
        <span>Ready. {projects.length} project records loaded</span>
        <span>Storage: Cloudflare D1 / Local Cache</span>
      </div>
    </div>
  );
};

export default Projects;
