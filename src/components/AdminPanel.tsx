import React, { useState, useEffect } from 'react';
import { 
  Folder, User, Cpu, FlaskConical, Cloud, 
  Plus, Trash2, Edit3, Save, RotateCcw, 
  ExternalLink, Lock, CheckCircle2, AlertCircle,
  Sparkles 
} from 'lucide-react';
import { portfolioStore } from '../core/portfolioStore';
import { cloudflareApi } from '../services/cloudflareApi';
import { authStore } from '../core/authStore';
import { PortfolioData, ProjectItem, ExperimentItem } from '../types/portfolio';
import { Process, SystemState } from '../core/types';
import { AiAssistantTab } from './AiAssistantTab';

interface AdminPanelProps {
  process: Process;
  systemState: SystemState;
}

export const AdminPanel: React.FC<AdminPanelProps> = () => {
  const [data, setData] = useState<PortfolioData>(portfolioStore.getData());
  const [activeTab, setActiveTab] = useState<'ai' | 'projects' | 'profile' | 'skills' | 'experiments' | 'cloudflare'>('ai');
  
  // Status feedback
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cfUrl, setCfUrl] = useState(cloudflareApi.getConfig().apiUrl);
  const [cfTestResult, setCfTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Project editing
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Experiment editing
  const [editingExp, setEditingExp] = useState<ExperimentItem | null>(null);
  const [isNewExp, setIsNewExp] = useState(false);

  // Local admin password change
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const unsub = portfolioStore.subscribe(setData);
    return () => { unsub(); };
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- Profile handlers ---
  const handleProfileSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const coreFocusRaw = (formData.get('core_focus') as string) || '';
    
    portfolioStore.updateProfile({
      name: formData.get('name') as string,
      title: formData.get('title') as string,
      headline: formData.get('headline') as string,
      bio: formData.get('bio') as string,
      location: formData.get('location') as string,
      email: formData.get('email') as string,
      github: formData.get('github') as string,
      linkedin: formData.get('linkedin') as string,
      philosophy: formData.get('philosophy') as string,
      core_focus: coreFocusRaw.split('\n').map(s => s.trim()).filter(Boolean),
    });
    showNotification('success', 'Profile & Identity updated successfully!');
  };

  // --- Project handlers ---
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (isNewProject) {
      portfolioStore.addProject(editingProject);
      showNotification('success', `Created project "${editingProject.title}"`);
    } else {
      portfolioStore.updateProject(editingProject.id, editingProject);
      showNotification('success', `Updated project "${editingProject.title}"`);
    }
    setEditingProject(null);
    setIsNewProject(false);
  };

  // --- Experiment handlers ---
  const handleSaveExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    if (isNewExp) {
      portfolioStore.addExperiment(editingExp);
      showNotification('success', `Added experiment "${editingExp.title}"`);
    } else {
      portfolioStore.updateExperiment(editingExp.id, editingExp);
      showNotification('success', `Updated experiment "${editingExp.title}"`);
    }
    setEditingExp(null);
    setIsNewExp(false);
  };

  // --- Cloudflare Sync handlers ---
  const handleTestCf = async () => {
    setCfTestResult(null);
    const res = await cloudflareApi.testConnection(cfUrl);
    setCfTestResult(res);
  };

  const handleSaveCfConfig = () => {
    cloudflareApi.saveConfig({ apiUrl: cfUrl });
    showNotification('success', 'Cloudflare API configuration saved!');
  };

  const handleSyncToCf = async () => {
    setIsSyncing(true);
    const res = await portfolioStore.syncToCloudflare();
    setIsSyncing(false);
    if (res.success) {
      showNotification('success', 'Portfolio data successfully pushed to Cloudflare D1!');
    } else {
      showNotification('error', res.error || 'Failed to sync to Cloudflare');
    }
  };

  const handlePullFromCf = async () => {
    setIsSyncing(true);
    const res = await portfolioStore.fetchFromCloudflare();
    setIsSyncing(false);
    if (res.success) {
      showNotification('success', 'Latest portfolio data pulled from Cloudflare D1!');
    } else {
      showNotification('error', res.error || 'Failed to pull from Cloudflare');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    authStore.changeLocalAdminPassword(newPassword);
    setNewPassword('');
    showNotification('success', 'Administrator password updated successfully!');
  };

  return (
    <div className="h-full bg-[#ECE9D8] flex flex-col font-tahoma text-black select-text overflow-hidden">
      {/* Top Banner / XP Title */}
      <div className="bg-[#0058EE] text-white px-4 py-2 flex items-center justify-between border-b border-[#0038A8]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-400 rounded-sm flex items-center justify-center font-bold text-xs text-white">
            ⚙️
          </div>
          <span className="font-bold text-sm">Portfolio Management Console (Admin.exe)</span>
        </div>
        <div className="text-xs bg-blue-700/60 px-2 py-0.5 rounded border border-blue-400/40 text-blue-100">
          User: <b>Arsh (Administrator)</b>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#ECE9D8] border-b border-gray-400 px-2 pt-1 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3 py-1.5 rounded-t-sm font-semibold flex items-center gap-1.5 border-t border-l border-r ${
            activeTab === 'ai'
              ? 'bg-white border-gray-400 -mb-[1px] pb-2 font-bold text-indigo-700'
              : 'bg-[#DCD8C8] border-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Sparkles size={14} className="text-indigo-600 animate-pulse" />
          AI Copilot (Prompt-to-Portfolio)
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-3 py-1.5 rounded-t-sm font-semibold flex items-center gap-1.5 border-t border-l border-r ${
            activeTab === 'projects'
              ? 'bg-white border-gray-400 -mb-[1px] pb-2 font-bold text-[#0058EE]'
              : 'bg-[#DCD8C8] border-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Folder size={14} className="text-yellow-600" />
          Projects ({data.projects.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 rounded-t-sm font-semibold flex items-center gap-1.5 border-t border-l border-r ${
            activeTab === 'profile'
              ? 'bg-white border-gray-400 -mb-[1px] pb-2 font-bold text-[#0058EE]'
              : 'bg-[#DCD8C8] border-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <User size={14} className="text-blue-600" />
          Profile & Identity
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-3 py-1.5 rounded-t-sm font-semibold flex items-center gap-1.5 border-t border-l border-r ${
            activeTab === 'skills'
              ? 'bg-white border-gray-400 -mb-[1px] pb-2 font-bold text-[#0058EE]'
              : 'bg-[#DCD8C8] border-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Cpu size={14} className="text-green-600" />
          Skills
        </button>
        <button
          onClick={() => setActiveTab('experiments')}
          className={`px-3 py-1.5 rounded-t-sm font-semibold flex items-center gap-1.5 border-t border-l border-r ${
            activeTab === 'experiments'
              ? 'bg-white border-gray-400 -mb-[1px] pb-2 font-bold text-[#0058EE]'
              : 'bg-[#DCD8C8] border-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <FlaskConical size={14} className="text-purple-600" />
          R&D Experiments
        </button>
        <button
          onClick={() => setActiveTab('cloudflare')}
          className={`px-3 py-1.5 rounded-t-sm font-semibold flex items-center gap-1.5 border-t border-l border-r ${
            activeTab === 'cloudflare'
              ? 'bg-white border-gray-400 -mb-[1px] pb-2 font-bold text-orange-600'
              : 'bg-[#DCD8C8] border-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Cloud size={14} className="text-orange-500" />
          Cloudflare D1 & Sync
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 border-b ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tab Content Area */}
      {activeTab === 'ai' ? (
        <div className="flex-1 overflow-hidden">
          <AiAssistantTab portfolioData={data} onNotify={showNotification} />
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4 bg-white">
          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="font-bold text-base text-gray-800">Portfolio Projects</h3>
                <p className="text-xs text-gray-500">Add, edit, or remove projects displayed in Projects.exe</p>
              </div>
              <button
                onClick={() => {
                  setEditingProject({
                    id: '',
                    title: 'New Project',
                    description: '',
                    impact: '',
                    tech: ['React', 'TypeScript'],
                    details: ['Engineered scalable architecture'],
                    status: 'Active',
                    github: 'https://github.com/Arsh-pixel-cmd',
                    link: '',
                  });
                  setIsNewProject(true);
                }}
                className="xp-button flex items-center gap-1 text-xs px-3 py-1 font-bold"
              >
                <Plus size={14} /> Add New Project
              </button>
            </div>

            {/* Project List */}
            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div key={proj.id} className="border border-gray-300 rounded p-3 bg-gray-50 hover:bg-blue-50/40 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-blue-900">{proj.title}</span>
                        <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded border border-green-300 font-semibold">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">{proj.description}</p>
                      {proj.impact && <p className="text-[11px] text-blue-700 font-medium italic">{proj.impact}</p>}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.tech.map(t => (
                          <span key={t} className="text-[10px] bg-white border px-1.5 py-0.2 rounded text-gray-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingProject({ ...proj });
                          setIsNewProject(false);
                        }}
                        className="xp-button text-xs flex items-center gap-1"
                        title="Edit project"
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${proj.title}"?`)) {
                            portfolioStore.deleteProject(proj.id);
                            showNotification('success', `Deleted project "${proj.title}"`);
                          }
                        }}
                        className="xp-button text-xs flex items-center gap-1 text-red-600 hover:text-red-700"
                        title="Delete project"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Edit Modal / Panel */}
            {editingProject && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-[#ECE9D8] border-2 border-[#0058EE] shadow-2xl rounded-sm w-full max-w-xl max-h-[90vh] flex flex-col font-tahoma">
                  <div className="bg-[#0058EE] text-white px-3 py-1.5 flex justify-between items-center font-bold text-xs">
                    <span>{isNewProject ? 'Add Project' : `Edit: ${editingProject.title}`}</span>
                    <button onClick={() => setEditingProject(null)} className="text-white hover:text-red-200">✕</button>
                  </div>
                  <form onSubmit={handleSaveProject} className="p-4 overflow-auto flex-1 space-y-3 text-xs">
                    <div>
                      <label className="block font-bold mb-1">Project Title</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title}
                        onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Description / Tagline</label>
                      <input
                        type="text"
                        required
                        value={editingProject.description}
                        onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Impact Statement</label>
                      <input
                        type="text"
                        value={editingProject.impact || ''}
                        onChange={e => setEditingProject({ ...editingProject, impact: e.target.value })}
                        className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Tech Stack (comma-separated)</label>
                      <input
                        type="text"
                        value={editingProject.tech.join(', ')}
                        onChange={e => setEditingProject({
                          ...editingProject,
                          tech: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                        })}
                        className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Key Engineering Points (one per line)</label>
                      <textarea
                        rows={3}
                        value={editingProject.details.join('\n')}
                        onChange={e => setEditingProject({
                          ...editingProject,
                          details: e.target.value.split('\n').filter(Boolean),
                        })}
                        className="w-full bg-white border border-gray-400 p-1.5 rounded-sm font-mono text-[11px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">Status</label>
                        <input
                          type="text"
                          value={editingProject.status}
                          onChange={e => setEditingProject({ ...editingProject, status: e.target.value })}
                          className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={editingProject.github}
                          onChange={e => setEditingProject({ ...editingProject, github: e.target.value })}
                          className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={editingProject.link}
                        onChange={e => setEditingProject({ ...editingProject, link: e.target.value })}
                        className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-2 border-t border-gray-300">
                      <button type="button" onClick={() => setEditingProject(null)} className="xp-button px-4 py-1">
                        Cancel
                      </button>
                      <button type="submit" className="xp-button px-4 py-1 font-bold text-[#0058EE]">
                        Save Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="space-y-4 max-w-2xl text-xs">
            <div className="pb-2 border-b">
              <h3 className="font-bold text-base text-gray-800">Profile & Identity Information</h3>
              <p className="text-gray-500">Updates live across Identity.exe, AboutMe.exe, and Contact.exe</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={data.profile.name}
                  className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Professional Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={data.profile.title}
                  className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Headline Statement</label>
              <input
                type="text"
                name="headline"
                defaultValue={data.profile.headline}
                className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">About Me Bio</label>
              <textarea
                name="bio"
                rows={3}
                defaultValue={data.profile.bio}
                className="w-full bg-white border border-gray-400 p-1.5 rounded-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={data.profile.email}
                  className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={data.profile.location}
                  className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">GitHub URL</label>
                <input
                  type="text"
                  name="github"
                  defaultValue={data.profile.github}
                  className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  name="linkedin"
                  defaultValue={data.profile.linkedin}
                  className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Core Focus Areas (one per line)</label>
              <textarea
                name="core_focus"
                rows={4}
                defaultValue={data.profile.core_focus.join('\n')}
                className="w-full bg-white border border-gray-400 p-1.5 rounded-sm font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Engineering Philosophy</label>
              <textarea
                name="philosophy"
                rows={3}
                defaultValue={data.profile.philosophy}
                className="w-full bg-white border border-gray-400 p-1.5 rounded-sm font-mono text-[11px]"
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="xp-button px-6 py-1.5 font-bold text-[#0058EE] flex items-center gap-1.5">
                <Save size={14} /> Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="font-bold text-base text-gray-800">Technical Skills by Category</h3>
                <p className="text-gray-500">Manage technical stack categories and tags</p>
              </div>
              <button
                onClick={() => {
                  const name = prompt('Enter new skill category name:');
                  if (name) {
                    portfolioStore.addSkillCategory(name, ['Skill 1']);
                    showNotification('success', `Created category "${name}"`);
                  }
                }}
                className="xp-button text-xs px-3 py-1 font-bold flex items-center gap-1"
              >
                <Plus size={14} /> Add Category
              </button>
            </div>

            <div className="space-y-4">
              {data.skills.map((cat) => (
                <div key={cat.id} className="border border-gray-300 rounded p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-900">{cat.category}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${cat.category}"?`)) {
                          portfolioStore.deleteSkillCategory(cat.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {cat.items.map((item, idx) => (
                      <span key={idx} className="bg-white border border-gray-300 px-2 py-0.5 rounded flex items-center gap-1">
                        {item}
                        <button
                          onClick={() => {
                            const newItems = cat.items.filter((_, i) => i !== idx);
                            portfolioStore.updateSkillCategory(cat.id, { items: newItems });
                          }}
                          className="text-gray-400 hover:text-red-500 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const item = prompt(`Add skill to "${cat.category}":`);
                      if (item) {
                        portfolioStore.updateSkillCategory(cat.id, { items: [...cat.items, item] });
                      }
                    }}
                    className="xp-button text-[11px] px-2 py-0.5"
                  >
                    + Add Item
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIMENTS TAB */}
        {activeTab === 'experiments' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="font-bold text-base text-gray-800">R&D Lab Experiments</h3>
                <p className="text-gray-500">Live experimentation notes rendered in Experiments.exe</p>
              </div>
              <button
                onClick={() => {
                  setEditingExp({
                    id: '',
                    tag: `EXP_0${data.experiments.length + 1}`,
                    title: 'New Experiment',
                    problem: '',
                    approach: '',
                    result: '',
                  });
                  setIsNewExp(true);
                }}
                className="xp-button text-xs px-3 py-1 font-bold flex items-center gap-1"
              >
                <Plus size={14} /> Add Experiment
              </button>
            </div>

            <div className="space-y-3">
              {data.experiments.map((exp) => (
                <div key={exp.id} className="border border-gray-300 rounded p-3 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                          {exp.tag}
                        </span>
                        <span className="font-bold text-sm text-gray-800">{exp.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2"><b>Problem:</b> {exp.problem}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingExp({ ...exp });
                          setIsNewExp(false);
                        }}
                        className="xp-button text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${exp.title}"?`)) {
                            portfolioStore.deleteExperiment(exp.id);
                          }
                        }}
                        className="xp-button text-xs text-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Experiment Edit Modal */}
            {editingExp && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-[#ECE9D8] border-2 border-purple-600 shadow-2xl rounded-sm w-full max-w-lg font-tahoma">
                  <div className="bg-purple-700 text-white px-3 py-1.5 flex justify-between items-center font-bold text-xs">
                    <span>{isNewExp ? 'Add Experiment' : `Edit: ${editingExp.title}`}</span>
                    <button onClick={() => setEditingExp(null)}>✕</button>
                  </div>
                  <form onSubmit={handleSaveExperiment} className="p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block font-bold mb-1">Tag (e.g. EXP_04)</label>
                        <input
                          type="text"
                          required
                          value={editingExp.tag}
                          onChange={e => setEditingExp({ ...editingExp, tag: e.target.value })}
                          className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block font-bold mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={editingExp.title}
                          onChange={e => setEditingExp({ ...editingExp, title: e.target.value })}
                          className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Problem Statement</label>
                      <textarea
                        rows={2}
                        required
                        value={editingExp.problem}
                        onChange={e => setEditingExp({ ...editingExp, problem: e.target.value })}
                        className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Approach Taken</label>
                      <textarea
                        rows={3}
                        required
                        value={editingExp.approach}
                        onChange={e => setEditingExp({ ...editingExp, approach: e.target.value })}
                        className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Result & Architecture Learnings</label>
                      <textarea
                        rows={2}
                        required
                        value={editingExp.result}
                        onChange={e => setEditingExp({ ...editingExp, result: e.target.value })}
                        className="w-full bg-white border border-gray-400 p-1.5 rounded-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <button type="button" onClick={() => setEditingExp(null)} className="xp-button px-4 py-1">
                        Cancel
                      </button>
                      <button type="submit" className="xp-button px-4 py-1 font-bold text-purple-700">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CLOUDFLARE D1 TAB */}
        {activeTab === 'cloudflare' && (
          <div className="space-y-6 max-w-2xl text-xs">
            <div className="pb-2 border-b">
              <h3 className="font-bold text-base text-gray-800 flex items-center gap-2">
                <Cloud className="text-orange-500" size={20} />
                Cloudflare Worker & D1 Database Synchronization
              </h3>
              <p className="text-gray-500 mt-1 leading-relaxed">
                Connect your Windows XP Portfolio to your Cloudflare Worker serverless API. Changes synchronize into your serverless SQLite D1 database.
              </p>
            </div>

            {/* Worker URL Config */}
            <div className="bg-gray-50 p-4 border rounded border-gray-300 space-y-3">
              <label className="block font-bold text-gray-700">
                Cloudflare Worker URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://portfolio-api.<your-subdomain>.workers.dev"
                  value={cfUrl}
                  onChange={e => setCfUrl(e.target.value)}
                  className="flex-1 bg-white border border-gray-400 p-2 rounded-sm font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={handleTestCf}
                  className="xp-button px-4 font-semibold shrink-0"
                >
                  Ping / Test
                </button>
                <button
                  type="button"
                  onClick={handleSaveCfConfig}
                  className="xp-button px-4 font-bold text-[#0058EE] shrink-0"
                >
                  Save URL
                </button>
              </div>

              {cfTestResult && (
                <div className={`p-2.5 rounded border text-xs flex items-center gap-2 ${
                  cfTestResult.ok ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
                }`}>
                  {cfTestResult.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{cfTestResult.message}</span>
                </div>
              )}
            </div>

            {/* Sync Actions */}
            <div className="bg-blue-50 p-4 border rounded border-blue-200 space-y-3">
              <h4 className="font-bold text-blue-900">Database Synchronization</h4>
              <p className="text-gray-600">
                Push your current portfolio state to Cloudflare D1, or pull the latest state down to this workstation.
              </p>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSyncToCf}
                  disabled={isSyncing}
                  className="xp-button px-5 py-2 font-bold text-green-800 flex items-center gap-1.5"
                >
                  <Save size={14} />
                  {isSyncing ? 'Syncing...' : 'Push All to Cloudflare D1'}
                </button>
                <button
                  onClick={handlePullFromCf}
                  disabled={isSyncing}
                  className="xp-button px-5 py-2 font-bold text-blue-800 flex items-center gap-1.5"
                >
                  <ExternalLink size={14} />
                  Pull from Cloudflare D1
                </button>
              </div>
              {data.lastSyncedAt && (
                <p className="text-[11px] text-gray-500 italic">
                  Last synchronized: {new Date(data.lastSyncedAt).toLocaleString()}
                </p>
              )}
            </div>

            {/* Local Security */}
            <div className="bg-amber-50 p-4 border rounded border-amber-200 space-y-3">
              <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                <Lock size={14} /> Local Administrator Master Key
              </h4>
              <p className="text-gray-600">
                Change the local password used to log on as Administrator on the XP Welcome Screen.
              </p>
              <form onSubmit={handleChangePassword} className="flex gap-2 max-w-sm">
                <input
                  type="password"
                  placeholder="New password..."
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="flex-1 bg-white border border-gray-400 p-1.5 rounded-sm text-xs"
                />
                <button type="submit" className="xp-button px-4 font-semibold">
                  Update
                </button>
              </form>
            </div>

            {/* Factory Reset */}
            <div className="pt-4 border-t border-gray-300 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-700">Restore System Defaults</p>
                <p className="text-gray-500">Reset all portfolio content back to initial Arsh Mishra records</p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to restore factory default data? All custom modifications will be reset.')) {
                    portfolioStore.resetToDefaults();
                    showNotification('success', 'Factory defaults restored!');
                  }
                }}
                className="xp-button text-red-600 px-4 py-1.5 font-bold flex items-center gap-1"
              >
                <RotateCcw size={14} /> Reset Defaults
              </button>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Bottom Status Strip */}
      <div className="bg-[#ECE9D8] border-t border-gray-400 px-3 py-1 flex items-center justify-between text-[11px] text-gray-600">
        <span>Arsh Kernel Portfolio Management • Cloudflare D1 Driver Active</span>
        <span>Version 4.0.0</span>
      </div>
    </div>
  );
};

export default AdminPanel;
