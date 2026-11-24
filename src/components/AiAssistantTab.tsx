// src/components/AiAssistantTab.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Settings,
  CheckCircle2,
  AlertCircle,
  Key,
  ExternalLink,
  Trash2,
  Cpu,
  Folder,
  User,
  FlaskConical,
  Eye,
  EyeOff,
  Cloud,
} from 'lucide-react';
import { portfolioAiService } from '../services/portfolioAiService';
import { portfolioStore } from '../core/portfolioStore';
import { PortfolioData } from '../types/portfolio';
import { AiChatMessage, AiConfig, AiProvider, PortfolioAiAction } from '../types/ai';

interface AiAssistantTabProps {
  portfolioData: PortfolioData;
  onNotify: (type: 'success' | 'error', message: string) => void;
}

const DEFAULT_STARTER_PROMPTS = [
  'Add a new project: "AgentOS" - an autonomous multi-agent workflow engine built with Next.js, LangChain, and Redis that reduces orchestration overhead by 40%.',
  'I have reached 2+ years of full-stack experience. Update my bio and headline to highlight high-throughput distributed systems and event-driven architectures.',
  'Add Kafka, Redis, and Kubernetes to my Databases & Cloud skill category.',
  'Add an R&D experiment "EXP_04: High-Concurrency WebSocket Streaming" solving UI state contention under 10k concurrent messages.',
];

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({ portfolioData, onNotify }) => {
  const [config, setConfig] = useState<AiConfig>(portfolioAiService.getConfig());
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(config.apiKey);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingCf, setIsSyncingCf] = useState(false);

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: Date.now(),
      text: "👋 Welcome to your AI Portfolio Copilot! I am tailored specifically for your portfolio's architecture and tone. Tell me what work you've done, your experience, or what you'd like to add or change, and I'll generate production-grade portfolio entries for you.",
      suggestions: [
        'Add a new full-stack AI project',
        'Update my bio & headline with new experience',
        'Add new skills to Cloud & AI categories',
      ],
    },
  ]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = portfolioAiService.saveConfig({
      ...config,
      apiKey: apiKeyInput.trim(),
    });
    setConfig(updated);
    setShowSettings(false);
    onNotify('success', `${updated.provider.toUpperCase()} AI settings saved successfully!`);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || prompt).trim();
    if (!textToSend || isLoading) return;

    if (!config.apiKey || !config.apiKey.trim()) {
      setShowSettings(true);
      onNotify('error', 'Please configure your AI API key first to send commands.');
      return;
    }

    const userMsgId = `msg-${Date.now()}`;
    const userMessage: AiChatMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: Date.now(),
      text: textToSend,
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setPrompt('');
    setIsLoading(true);

    try {
      const responsePayload = await portfolioAiService.processPrompt(textToSend, portfolioData);

      let autoApplied = false;
      if (config.autoApply && responsePayload.actions.length > 0) {
        portfolioAiService.applyActions(responsePayload.actions);
        autoApplied = true;
        onNotify('success', `AI applied ${responsePayload.actions.length} portfolio change(s) automatically!`);
      }

      const assistantMessage: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: Date.now(),
        text: responsePayload.summary,
        responsePayload,
        applied: autoApplied,
        suggestions: responsePayload.suggestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const errorMessage: AiChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'system',
        timestamp: Date.now(),
        text: `Error processing command: ${msg}`,
        error: msg,
      };
      setMessages(prev => [...prev, errorMessage]);
      onNotify('error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyActions = (messageId: string, actions: PortfolioAiAction[]) => {
    const res = portfolioAiService.applyActions(actions);
    if (res.success) {
      setMessages(prev =>
        prev.map(m => (m.id === messageId ? { ...m, applied: true } : m))
      );
      onNotify('success', `Applied ${res.appliedCount} action(s) to live portfolio!`);
    } else {
      onNotify('error', 'Failed to apply actions. Check console for details.');
    }
  };

  const handleApplyAndSyncToCloudflare = async (messageId: string, actions: PortfolioAiAction[]) => {
    handleApplyActions(messageId, actions);
    setIsSyncingCf(true);
    const res = await portfolioStore.syncToCloudflare();
    setIsSyncingCf(false);
    if (res.success) {
      onNotify('success', 'Changes applied and synchronized to Cloudflare D1!');
    } else {
      onNotify('error', res.error || 'Changes applied locally, but Cloudflare sync failed.');
    }
  };

  const renderActionPreview = (action: PortfolioAiAction, index: number) => {
    switch (action.type) {
      case 'ADD_PROJECT': {
        const p = action.payload;
        return (
          <div key={index} className="bg-white border border-blue-200 rounded p-3 text-xs space-y-2 shadow-xs">
            <div className="flex items-center justify-between border-b pb-1">
              <span className="font-bold text-blue-700 flex items-center gap-1">
                <Folder size={13} className="text-yellow-600" />
                Add Project: {p.title}
              </span>
              <span className="bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                {p.status || 'Production-ready'}
              </span>
            </div>
            <p className="text-gray-700 italic">{p.description}</p>
            {p.impact && (
              <p className="text-gray-800 font-medium">
                <span className="text-blue-800 font-bold">Impact: </span>
                {p.impact}
              </p>
            )}
            <div className="flex flex-wrap gap-1">
              {p.tech?.map((t, i) => (
                <span key={i} className="bg-gray-100 border border-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-[10px]">
                  {t}
                </span>
              ))}
            </div>
            {p.details && p.details.length > 0 && (
              <ul className="list-disc list-inside text-gray-600 space-y-0.5 pl-1">
                {p.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        );
      }

      case 'UPDATE_PROJECT': {
        const { id, updates } = action.payload;
        return (
          <div key={index} className="bg-white border border-yellow-200 rounded p-3 text-xs space-y-1.5 shadow-xs">
            <div className="font-bold text-yellow-800 flex items-center gap-1 border-b pb-1">
              <Folder size={13} className="text-yellow-600" />
              Update Project: {id}
            </div>
            {updates.title && <p><b>New Title:</b> {updates.title}</p>}
            {updates.description && <p><b>Description:</b> {updates.description}</p>}
            {updates.impact && <p><b>Impact:</b> {updates.impact}</p>}
            {updates.tech && (
              <div className="flex flex-wrap gap-1">
                <b>Tech:</b>
                {updates.tech.map((t, i) => (
                  <span key={i} className="bg-yellow-50 border border-yellow-300 text-yellow-900 px-1.5 py-0.2 rounded text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {updates.details && (
              <ul className="list-disc list-inside text-gray-600 pl-1">
                {updates.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        );
      }

      case 'DELETE_PROJECT': {
        return (
          <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-800 flex items-center gap-2">
            <Trash2 size={13} className="text-red-600" />
            <span>Remove Project: <b>{action.payload.id}</b></span>
          </div>
        );
      }

      case 'UPDATE_PROFILE': {
        const updates = action.payload;
        return (
          <div key={index} className="bg-white border border-blue-200 rounded p-3 text-xs space-y-2 shadow-xs">
            <div className="font-bold text-blue-800 flex items-center gap-1 border-b pb-1">
              <User size={13} className="text-blue-600" />
              Update Profile & Identity
            </div>
            {updates.title && <p><b>Title:</b> {updates.title}</p>}
            {updates.headline && <p><b>Headline:</b> {updates.headline}</p>}
            {updates.bio && <p className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-200"><b>Bio:</b> {updates.bio}</p>}
            {updates.core_focus && (
              <div>
                <b>Core Focus:</b>
                <ul className="list-disc list-inside text-gray-600 pl-1 mt-0.5">
                  {updates.core_focus.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      }

      case 'ADD_SKILL': {
        const { category, skills } = action.payload;
        return (
          <div key={index} className="bg-white border border-green-200 rounded p-2.5 text-xs space-y-1 shadow-xs">
            <div className="font-bold text-green-800 flex items-center gap-1">
              <Cpu size={13} className="text-green-600" />
              Add Skills to "{category}"
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {skills.map((s, i) => (
                <span key={i} className="bg-green-100 text-green-900 font-medium px-2 py-0.5 rounded text-[11px] border border-green-300">
                  + {s}
                </span>
              ))}
            </div>
          </div>
        );
      }

      case 'REMOVE_SKILL': {
        return (
          <div key={index} className="bg-white border border-gray-200 rounded p-2 text-xs text-gray-700 flex items-center gap-2">
            <Cpu size={13} className="text-red-500" />
            <span>Remove skill <b>{action.payload.skill}</b> from <i>{action.payload.category}</i></span>
          </div>
        );
      }

      case 'ADD_EXPERIMENT': {
        const e = action.payload;
        return (
          <div key={index} className="bg-white border border-purple-200 rounded p-3 text-xs space-y-1.5 shadow-xs">
            <div className="font-bold text-purple-800 flex items-center justify-between border-b pb-1">
              <span className="flex items-center gap-1">
                <FlaskConical size={13} className="text-purple-600" />
                Add R&D Experiment: {e.title}
              </span>
              <span className="bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                {e.tag || 'EXP'}
              </span>
            </div>
            <p><b>Problem:</b> {e.problem}</p>
            <p><b>Approach:</b> {e.approach}</p>
            <p><b>Result:</b> {e.result}</p>
          </div>
        );
      }

      case 'UPDATE_EXPERIMENT': {
        return (
          <div key={index} className="bg-white border border-purple-200 rounded p-2 text-xs space-y-1">
            <div className="font-bold text-purple-700 flex items-center gap-1">
              <FlaskConical size={13} />
              Update Experiment {action.payload.id}
            </div>
          </div>
        );
      }

      case 'DELETE_EXPERIMENT': {
        return (
          <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-800">
            Delete Experiment: {action.payload.id}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] select-text">
      {/* Top AI Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-3 py-2 flex items-center justify-between border-b border-indigo-900 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-500/40 flex items-center justify-center border border-indigo-300/40">
            <Sparkles size={14} className="text-yellow-300" />
          </div>
          <div>
            <h4 className="font-bold text-xs leading-none">Portfolio AI Agent (Prompt-to-Portfolio)</h4>
            <span className="text-[10px] text-indigo-200">
              Provider: <b className="uppercase">{config.provider}</b> ({config.model})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {config.apiKey ? (
            <span className="flex items-center gap-1 text-[11px] bg-green-900/60 text-green-200 px-2 py-0.5 rounded border border-green-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              API Ready
            </span>
          ) : (
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1 text-[11px] bg-amber-500/80 hover:bg-amber-500 text-amber-950 font-bold px-2 py-0.5 rounded border border-amber-300"
            >
              <Key size={11} /> Set API Key
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1 rounded border border-white/20 transition-colors"
          >
            <Settings size={13} />
            Config
          </button>
        </div>
      </div>

      {/* Settings Panel (collapsible) */}
      {showSettings && (
        <form onSubmit={handleSaveSettings} className="bg-white border-b-2 border-indigo-200 p-3 space-y-3 text-xs shadow-md">
          <div className="flex items-center justify-between border-b pb-2">
            <h5 className="font-bold text-gray-800 flex items-center gap-1.5">
              <Settings size={14} className="text-indigo-600" />
              AI Copilot Configuration
            </h5>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-gray-500 hover:text-gray-700 text-xs px-1.5 py-0.5"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Provider */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">AI Provider:</label>
              <select
                value={config.provider}
                onChange={e => {
                  const p = e.target.value as AiProvider;
                  const defaultModel =
                    p === 'gemini' ? 'gemini-1.5-flash' : p === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';
                  setConfig({ ...config, provider: p, model: defaultModel });
                }}
                className="w-full border border-gray-300 rounded px-2 py-1.5 bg-gray-50 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="gemini">Google Gemini (Recommended / Free Tier)</option>
                <option value="groq">Groq (Ultra-Fast LPU)</option>
                <option value="openai">OpenAI (GPT-4o Mini / GPT-4o)</option>
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Model Name:</label>
              <input
                type="text"
                value={config.model}
                onChange={e => setConfig({ ...config, model: e.target.value })}
                placeholder="e.g. gemini-1.5-flash"
                className="w-full border border-gray-300 rounded px-2 py-1.5 bg-gray-50 text-xs focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
              />
            </div>

            {/* Auto Apply */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pt-3">
                <input
                  type="checkbox"
                  checked={config.autoApply}
                  onChange={e => setConfig({ ...config, autoApply: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="font-semibold text-gray-800">Auto-Apply to Portfolio</span>
              </label>
              <span className="text-[10px] text-gray-500">
                If checked, changes apply immediately without review button
              </span>
            </div>
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-gray-700">
                {config.provider.toUpperCase()} API Key:
              </label>
              {config.provider === 'gemini' && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                >
                  Get free Gemini API Key <ExternalLink size={10} />
                </a>
              )}
              {config.provider === 'groq' && (
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-600 hover:underline flex items-center gap-1 text-[11px]"
                >
                  Get Groq API Key <ExternalLink size={10} />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder={`Enter your ${config.provider} API key...`}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 pr-8 bg-gray-50 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <button
                type="submit"
                className="bg-[#0058EE] hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded text-xs border border-[#0038A8] shadow-xs cursor-pointer"
              >
                Save Config
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              🔒 Keys are stored securely in your browser's local storage and used directly from your browser.
            </p>
          </div>
        </form>
      )}

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#F0EDE0]">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-lg p-3 text-xs shadow-xs space-y-2 border ${
                msg.sender === 'user'
                  ? 'bg-[#0058EE] text-white border-[#0038A8]'
                  : msg.sender === 'system'
                  ? 'bg-red-50 text-red-900 border-red-300'
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-1.5 opacity-80 text-[10px] font-semibold border-b pb-1">
                {msg.sender === 'user' ? (
                  <span>You (Administrator)</span>
                ) : msg.sender === 'system' ? (
                  <span className="flex items-center gap-1 text-red-700">
                    <AlertCircle size={11} /> System Alert
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-indigo-700 font-bold">
                    <Sparkles size={11} /> Portfolio Copilot
                  </span>
                )}
                <span className="ml-auto">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Message Body */}
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

              {/* Action Previews */}
              {msg.responsePayload && msg.responsePayload.actions.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-gray-200">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
                    <span>Generated Portfolio Modifications ({msg.responsePayload.actions.length}):</span>
                    {msg.applied && (
                      <span className="text-green-700 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Applied to Portfolio
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {msg.responsePayload.actions.map((act, i) => renderActionPreview(act, i))}
                  </div>

                  {/* Action Buttons */}
                  {!msg.applied ? (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <button
                        onClick={() => handleApplyActions(msg.id, msg.responsePayload!.actions)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 shadow-xs cursor-pointer border border-green-800"
                      >
                        <CheckCircle2 size={13} />
                        Apply to Live Portfolio
                      </button>

                      <button
                        disabled={isSyncingCf}
                        onClick={() => handleApplyAndSyncToCloudflare(msg.id, msg.responsePayload!.actions)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 shadow-xs cursor-pointer border border-blue-800 disabled:opacity-50"
                      >
                        <Cloud size={13} />
                        {isSyncingCf ? 'Syncing...' : 'Apply & Sync to Cloudflare D1'}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-300 text-green-900 rounded p-2 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <CheckCircle2 size={14} className="text-green-600" />
                        Changes live on your portfolio!
                      </span>
                      <button
                        disabled={isSyncingCf}
                        onClick={async () => {
                          setIsSyncingCf(true);
                          const res = await portfolioStore.syncToCloudflare();
                          setIsSyncingCf(false);
                          if (res.success) {
                            onNotify('success', 'Synchronized to Cloudflare D1!');
                          } else {
                            onNotify('error', res.error || 'Failed to sync to Cloudflare');
                          }
                        }}
                        className="text-[11px] bg-white border border-green-400 hover:bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded flex items-center gap-1"
                      >
                        <Cloud size={11} /> Sync to Cloudflare
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                    Quick Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {msg.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s)}
                        className="text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded px-2 py-0.5 text-left transition-colors cursor-pointer"
                      >
                        {s} →
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-300 w-fit">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-semibold text-indigo-900">
              AI Copilot is analyzing your request and structuring portfolio updates...
            </span>
          </div>
        )}
      </div>

      {/* Starter Prompts Bar (when only welcome message) */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-3 py-2 bg-[#E2DEC8] border-t border-gray-300">
          <span className="text-[10px] font-bold text-gray-700 block mb-1 uppercase tracking-wider">
            💡 Click to try sample commands:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DEFAULT_STARTER_PROMPTS.map((promptText, i) => (
              <button
                key={i}
                onClick={() => setPrompt(promptText)}
                className="bg-white hover:bg-blue-50 text-gray-800 text-[11px] px-2 py-1 rounded border border-gray-400 text-left transition-colors shadow-2xs truncate max-w-md cursor-pointer"
                title={promptText}
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prompt Input Form */}
      <div className="bg-[#ECE9D8] border-t border-gray-400 p-2.5">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              rows={2}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Tell AI what to add or change on your portfolio... (e.g. 'I built an app called X with React and Supabase, add it with architectural impact points')"
              className="w-full bg-white border border-gray-400 rounded p-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none font-tahoma"
            />
            <span className="absolute right-2 bottom-2 text-[10px] text-gray-400 pointer-events-none">
              Press Enter ↵
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="h-[46px] px-4 bg-gradient-to-b from-[#2272FA] to-[#0048D0] hover:from-[#3180FF] hover:to-[#0058EE] text-white font-bold text-xs rounded border border-[#0038A8] shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={14} />
                <span>Execute</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
