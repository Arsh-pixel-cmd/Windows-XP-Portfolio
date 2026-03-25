import React from 'react';
import { ExternalLink, Github, Rocket } from 'lucide-react';
import { Process, SystemState } from '../core/types';

interface ProjectsProps {
  process: Process;
  systemState: SystemState;
}

const PROJECT_LIST = [
  {
    title: "Pennywise (Flagship)",
    description: "Enterprise-Grade Financial Intelligence Ecosystem",
    impact: "AI-native orchestration using Groq & Gemini for high-precision extraction.",
    tech: ["Next.js 16", "Capacitor 8", "Supabase", "Groq AI", "Gemini", "Tailwind"],
    details: [
      "AI-Native Orchestration: Groq & Gemini precision pipelines",
      "Unified Experience: Next.js 16 + Capacitor 8 native bridge",
      "Data Sovereignty: Supabase with strict Row Level Security (RLS)",
      "Native Security: Biometric authentication & system-level intents"
    ],
    status: "Production-ready (Engineered for Clarity)",
    github: "https://github.com/Arsh-pixel-cmd/expense-tracker",
    link: "https://github.com/Arsh-pixel-cmd/expense-tracker"
  },
  {
    title: "HR Nexus (Internship)",
    description: "Enterprise HR SaaS Platform",
    impact: "Reduced API latency by 30–40% and improved dashboard performance by 25%.",
    tech: ["Node.js", "Express", "JWT", "RBAC", "PostgreSQL"],
    details: [
      "Designed secure JWT-based RBAC authentication",
      "Optimized payroll and attendance API architectures",
      "Built scalable backend systems for enterprise load"
    ],
    status: "Deployed Internally",
    github: "#",
    link: "#"
  },
  {
    title: "Jyotix-Astro ✨",
    description: "AI-Powered Personalized Astrology Guide",
    impact: "AI-native companion providing dynamic horoscopes and conversational guidance.",
    tech: ["Next.js", "Firebase", "Gemini AI", "Razorpay", "ShadCN UI", "Framer Motion"],
    details: [
      "AI Astrologer: Personalized guidance via Google Gemini (Genkit)",
      "Dynamic Horoscopes: Daily/Weekly/Monthly AI-generated insights",
      "Monetization: Integrated subscription tiers via Razorpay",
      "Multilingual: Full UI adaptivity for English, Hindi, and Urdu"
    ],
    status: "Live & Deployed",
    github: "https://github.com/Arsh-pixel-cmd/Jyotix-Astro",
    link: "https://jyotix-astro.vercel.app/"
  },
  {
    title: "DevLens Ultra 🔮",
    description: "Reverse-Engineering design systems & DOM Analysis",
    impact: "Ultimate browser extension for React codegen and AI-driven technical analysis.",
    tech: ["JavaScript", "Manifest V3", "Shadow DOM", "React", "Chrome API", "AST"],
    details: [
      "Component Ripper: Zero-noise React codegen and Tailwind mapping",
      "AI Insight Fusion: LLM-powered layout and logic explainers",
      "Framework Sniffer: Reads Next.js/React Fiber props in real-time",
      "Triple-Layer Architecture: Encapsulated Shadow Host for zero CSS bleed"
    ],
    status: "Open Source & Scalable",
    github: "https://github.com/Arsh-pixel-cmd/DevLens",
    link: "https://github.com/Arsh-pixel-cmd/DevLens"
  }
];

export const Projects: React.FC<ProjectsProps> = () => {
  return (
    <div className="h-full bg-white flex flex-col font-tahoma">
      <div className="bg-[#F0F0E0] p-4 border-b border-[#D4D0C8] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-bold text-gray-800">C:\Users\Arsh\Documents\Projects</h2>
          <p className="text-xs text-gray-500">4 objects selected</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-white border border-gray-400 text-xs shadow-sm hover:bg-gray-50 cursor-pointer">View Details</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 custom-scrollbar text-gray-900 selection:bg-[#316AC5] selection:text-white">
        <div className="grid grid-cols-1 gap-6">
          {PROJECT_LIST.map((project, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Rocket size={16} />
                  <h3 className="font-bold">{project.title}</h3>
                </div>
                <div className="flex gap-2">
                  <a href={project.github} className="hover:text-blue-200"><Github size={16} /></a>
                  <a href={project.link} className="hover:text-blue-200"><ExternalLink size={16} /></a>
                </div>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <p className="text-sm font-bold text-gray-700">{project.description}</p>
                    <p className="text-xs text-blue-800 mt-1 font-bold">{project.impact}</p>
                  </div>
                  
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
                </div>

                <div className="bg-gray-50 p-3 border-l border-gray-100 flex flex-col gap-3">
                   <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tech Stack</p>
                     <div className="flex flex-wrap gap-1 mt-1">
                       {project.tech.map(t => (
                         <span key={t} className="px-1.5 py-0.5 bg-white border border-gray-200 text-[10px] rounded leading-none">{t}</span>
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
      
      <div className="bg-[#F0F0E0] px-4 py-1 border-t border-[#D4D0C8] text-[10px] text-gray-600 shrink-0">
        Ready. Total size: 1.4 TB
      </div>
    </div>
  );
};

export default Projects;