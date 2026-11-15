// src/core/portfolioStore.ts
import { PortfolioData, ProjectItem, ProfileData, SkillCategory, ExperimentItem } from '../types/portfolio';
import { cloudflareApi } from '../services/cloudflareApi';
import { systemBus } from './eventBus';

const STORAGE_KEY = 'xp_portfolio_data';

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: 'Arsh Mishra',
    title: 'Full-Stack Engineer | AI Systems Builder',
    headline: 'I design deterministic systems, not just interfaces.',
    bio: 'I build production-grade applications that prioritize performance, scalability, and real-world usability. Currently a Computer Science student at IILM University (CGPA: 9.32), I focus on designing systems—not just interfaces.',
    location: 'Greater Noida, India',
    email: 'arshmishra37@gmail.com',
    github: 'https://github.com/Arsh-pixel-cmd',
    linkedin: 'https://linkedin.com/in/arsh-mishra-030093325',
    quote: 'I don’t build projects for demonstration—I build systems that can handle real users, real data, and real constraints.',
    core_focus: [
      'AI-powered applications',
      'Event-driven architectures',
      'Scalable backend systems',
      'Real-world production pipelines',
    ],
    philosophy: 'Architecture > shortcuts\nPerformance is non-negotiable\nAutomation > repetition',
  },
  projects: [
    {
      id: 'pennywise',
      title: 'Pennywise (Flagship)',
      description: 'Enterprise-Grade Financial Intelligence Ecosystem',
      impact: 'AI-native orchestration using Groq & Gemini for high-precision extraction.',
      tech: ['Next.js 16', 'Capacitor 8', 'Supabase', 'Groq AI', 'Gemini', 'Tailwind'],
      details: [
        'AI-Native Orchestration: Groq & Gemini precision pipelines',
        'Unified Experience: Next.js 16 + Capacitor 8 native bridge',
        'Data Sovereignty: Supabase with strict Row Level Security (RLS)',
        'Native Security: Biometric authentication & system-level intents',
      ],
      status: 'Production-ready (Engineered for Clarity)',
      github: 'https://github.com/Arsh-pixel-cmd/expense-tracker',
      link: 'https://github.com/Arsh-pixel-cmd/expense-tracker',
    },
    {
      id: 'hr-nexus',
      title: 'HR Nexus (Internship)',
      description: 'Enterprise HR SaaS Platform',
      impact: 'Reduced API latency by 30–40% and improved dashboard performance by 25%.',
      tech: ['Node.js', 'Express', 'JWT', 'RBAC', 'PostgreSQL'],
      details: [
        'Designed secure JWT-based RBAC authentication',
        'Optimized payroll and attendance API architectures',
        'Built scalable backend systems for enterprise load',
      ],
      status: 'Deployed Internally',
      github: '#',
      link: '#',
    },
    {
      id: 'jyotix-astro',
      title: 'Jyotix-Astro ✨',
      description: 'AI-Powered Personalized Astrology Guide',
      impact: 'AI-native companion providing dynamic horoscopes and conversational guidance.',
      tech: ['Next.js', 'Firebase', 'Gemini AI', 'Razorpay', 'ShadCN UI', 'Framer Motion'],
      details: [
        'AI Astrologer: Personalized guidance via Google Gemini (Genkit)',
        'Dynamic Horoscopes: Daily/Weekly/Monthly AI-generated insights',
        'Monetization: Integrated subscription tiers via Razorpay',
        'Multilingual: Full UI adaptivity for English, Hindi, and Urdu',
      ],
      status: 'Live & Deployed',
      github: 'https://github.com/Arsh-pixel-cmd/Jyotix-Astro',
      link: 'https://jyotix-astro.vercel.app/',
    },
    {
      id: 'devlens-ultra',
      title: 'DevLens Ultra 🔮',
      description: 'Reverse-Engineering design systems & DOM Analysis',
      impact: 'Ultimate browser extension for React codegen and AI-driven technical analysis.',
      tech: ['JavaScript', 'Manifest V3', 'Shadow DOM', 'React', 'Chrome API', 'AST'],
      details: [
        'Component Ripper: Zero-noise React codegen and Tailwind mapping',
        'AI Insight Fusion: LLM-powered layout and logic explainers',
        'Framework Sniffer: Reads Next.js/React Fiber props in real-time',
        'Triple-Layer Architecture: Encapsulated Shadow Host for zero CSS bleed',
      ],
      status: 'Open Source & Scalable',
      github: 'https://github.com/Arsh-pixel-cmd/DevLens',
      link: 'https://github.com/Arsh-pixel-cmd/DevLens',
    },
  ],
  skills: [
    {
      id: 'languages',
      category: 'Languages',
      items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'C#', 'SQL'],
    },
    {
      id: 'frameworks',
      category: 'Frameworks & Libraries',
      items: ['React', 'Next.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Capacitor'],
    },
    {
      id: 'databases',
      category: 'Databases & Cloud',
      items: ['Cloudflare D1', 'Cloudflare Workers', 'PostgreSQL', 'MongoDB', 'Supabase', 'Firebase', 'AWS', 'Docker'],
    },
    {
      id: 'ai-ml',
      category: 'AI & Systems Engineering',
      items: ['Gemini API', 'Groq LPU', 'GenKit', 'Event-Driven Kernels', 'VFS Architecture'],
    },
  ],
  experiments: [
    {
      id: 'exp-1',
      tag: 'EXP_01',
      title: 'DevLens Ultra',
      problem: 'Reconstructing UI components from browser-rendered DOM is slow and inconsistent. Computed styles include browser defaults, cascading overrides, and pseudo-element rules, making direct mapping unreliable.',
      approach: 'Built a DOM traversal pipeline that walks ~300+ nodes per view and extracts computed styles. Applied filtering to remove browser-default values and normalize style noise. Mapped extracted styles into Tailwind-compatible tokens.',
      result: 'Reduced manual UI reconstruction effort by eliminating redundant style interpretation. Generated structurally consistent component representations from heterogeneous DOM trees.',
    },
    {
      id: 'exp-2',
      tag: 'EXP_02',
      title: 'PDF Parsing Experiments (SmartSpend)',
      problem: 'Bank statements vary significantly across institutions, with inconsistent layouts, merged cells, and non-standard formatting. Rule-based parsing fails on edge cases, while AI-based extraction introduces variability.',
      approach: 'Tested multiple parsing strategies: rule-based parsing using pattern heuristics, AI-based extraction using multimodal models (Gemini / Groq), and a hybrid pipeline combining rule validation with AI fallback.',
      result: 'Improved robustness of transaction extraction across heterogeneous PDF formats. Achieved consistent parsing behavior under mixed layouts using hybrid validation.',
    },
    {
      id: 'exp-3',
      tag: 'EXP_03',
      title: 'Event-Driven System Kernel',
      problem: 'UI-driven state management leads to implicit side effects, race conditions, and non-deterministic behavior in multi-window environments.',
      approach: 'Designed an event-driven execution model with a centralized dispatcher implementing a strict VALIDATE → EXECUTE → LOG pipeline with deterministic functional reducers and snapshot rehydration.',
      result: 'Eliminated implicit state mutations and improved predictability of system behavior. Enabled full traceability of state transitions through event logs.',
    },
  ],
};

function loadStoredData(): PortfolioData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_PORTFOLIO_DATA,
        ...parsed,
        profile: { ...INITIAL_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) },
      };
    }
  } catch {
    // fallback
  }
  return INITIAL_PORTFOLIO_DATA;
}

let currentData: PortfolioData = loadStoredData();
const listeners = new Set<(data: PortfolioData) => void>();

function persistAndNotify() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  listeners.forEach(fn => fn(currentData));
}

export const portfolioStore = {
  getData: () => currentData,
  subscribe: (fn: (data: PortfolioData) => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  updateProfile: (profileUpdates: Partial<ProfileData>) => {
    currentData = {
      ...currentData,
      profile: { ...currentData.profile, ...profileUpdates },
    };
    persistAndNotify();
    systemBus.emit({
      type: 'SYS_LOG',
      payload: {
        id: `portfolio-${Date.now()}`,
        timestamp: Date.now(),
        level: 'INFO',
        message: 'Administrator updated Profile & Identity',
      },
    });
  },

  addProject: (project: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
    };
    currentData = {
      ...currentData,
      projects: [newProj, ...currentData.projects],
    };
    persistAndNotify();
  },

  updateProject: (id: string, updates: Partial<ProjectItem>) => {
    currentData = {
      ...currentData,
      projects: currentData.projects.map(p => (p.id === id ? { ...p, ...updates } : p)),
    };
    persistAndNotify();
  },

  deleteProject: (id: string) => {
    currentData = {
      ...currentData,
      projects: currentData.projects.filter(p => p.id !== id),
    };
    persistAndNotify();
  },

  addSkillCategory: (category: string, items: string[]) => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      category,
      items,
    };
    currentData = {
      ...currentData,
      skills: [...currentData.skills, newCat],
    };
    persistAndNotify();
  },

  updateSkillCategory: (id: string, updates: Partial<SkillCategory>) => {
    currentData = {
      ...currentData,
      skills: currentData.skills.map(s => (s.id === id ? { ...s, ...updates } : s)),
    };
    persistAndNotify();
  },

  deleteSkillCategory: (id: string) => {
    currentData = {
      ...currentData,
      skills: currentData.skills.filter(s => s.id !== id),
    };
    persistAndNotify();
  },

  addExperiment: (exp: Omit<ExperimentItem, 'id'>) => {
    const newExp: ExperimentItem = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    currentData = {
      ...currentData,
      experiments: [...currentData.experiments, newExp],
    };
    persistAndNotify();
  },

  updateExperiment: (id: string, updates: Partial<ExperimentItem>) => {
    currentData = {
      ...currentData,
      experiments: currentData.experiments.map(e => (e.id === id ? { ...e, ...updates } : e)),
    };
    persistAndNotify();
  },

  deleteExperiment: (id: string) => {
    currentData = {
      ...currentData,
      experiments: currentData.experiments.filter(e => e.id !== id),
    };
    persistAndNotify();
  },

  syncToCloudflare: async (): Promise<{ success: boolean; error?: string }> => {
    const res = await cloudflareApi.syncPortfolio(currentData);
    if (res.success) {
      currentData = { ...currentData, lastSyncedAt: Date.now() };
      persistAndNotify();
      systemBus.emit({
        type: 'SYS_LOG',
        payload: {
          id: `cf-${Date.now()}`,
          timestamp: Date.now(),
          level: 'INFO',
          message: 'Portfolio successfully synchronized to Cloudflare D1',
        },
      });
    }
    return res;
  },

  fetchFromCloudflare: async (): Promise<{ success: boolean; error?: string }> => {
    const remote = await cloudflareApi.fetchPortfolio();
    if (!remote) {
      return { success: false, error: 'Could not fetch data from Cloudflare Worker' };
    }
    currentData = { ...remote, lastSyncedAt: Date.now() };
    persistAndNotify();
    return { success: true };
  },

  resetToDefaults: () => {
    currentData = INITIAL_PORTFOLIO_DATA;
    persistAndNotify();
    systemBus.emit({
      type: 'SYS_LOG',
      payload: {
        id: `reset-${Date.now()}`,
        timestamp: Date.now(),
        level: 'WARN',
        message: 'Portfolio state restored to system factory defaults',
      },
    });
  },
};
