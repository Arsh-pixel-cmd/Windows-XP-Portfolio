// src/components/InternetExplorer.tsx
import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, X, RotateCw, Home, Search, 
  Star, ExternalLink, Globe, Lock, CornerDownRight 
} from 'lucide-react';
import { soundEffects } from '../core/soundEffects';

interface Bookmark {
  name: string;
  url: string;
}

const BOOKMARKS: Bookmark[] = [
  { name: 'Google (2004)', url: 'about:google' },
  { name: 'GitHub: Arsh-pixel-cmd', url: 'https://github.com/Arsh-pixel-cmd' },
  { name: 'SmartSpend AI', url: 'https://github.com/Arsh-pixel-cmd/expense-tracker' },
  { name: 'Jyotix-Astro', url: 'https://jyotix-astro.vercel.app' },
  { name: 'Portfolio Overview', url: 'about:home' },
];

export const InternetExplorer: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string>('about:google');
  const [inputUrl, setInputUrl] = useState<string>('about:google');
  const [history, setHistory] = useState<string[]>(['about:google']);
  const [historyIdx, setHistoryIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigateTo = (url: string) => {
    soundEffects.playClick();
    setIsLoading(true);
    setCurrentUrl(url);
    setInputUrl(url);
    setHistory(prev => [...prev.slice(0, historyIdx + 1), url]);
    setHistoryIdx(prev => prev + 1);

    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const handleBack = () => {
    if (historyIdx > 0) {
      soundEffects.playClick();
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      setCurrentUrl(prev);
      setInputUrl(prev);
    }
  };

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      soundEffects.playClick();
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      setCurrentUrl(next);
      setInputUrl(next);
    }
  };

  const handleRefresh = () => {
    soundEffects.playClick();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleSubmitUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl.trim();
    if (!target) return;
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('about:')) {
      target = `https://${target}`;
    }
    navigateTo(target);
  };

  return (
    <div className="h-full bg-[#ECE9D8] flex flex-col font-tahoma text-xs select-none overflow-hidden">
      {/* Menu Bar */}
      <div className="bg-[#ECE9D8] border-b border-gray-400 px-2 py-0.5 flex items-center justify-between text-gray-800">
        <div className="flex gap-3">
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">File</span>
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Edit</span>
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">View</span>
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Favorites</span>
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Tools</span>
          <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Help</span>
        </div>
        {/* Animated Windows Globe */}
        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center border border-white/60 shadow-inner">
          <div className={`w-3.5 h-3.5 border-2 border-white rounded-full border-t-transparent ${isLoading ? 'animate-spin' : ''}`} />
        </div>
      </div>

      {/* Navigation Toolbar */}
      <div className="bg-[#ECE9D8] border-b border-gray-300 p-1 flex items-center gap-1">
        <button
          onClick={handleBack}
          disabled={historyIdx === 0}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60 active:bg-black/10 disabled:opacity-40"
          title="Back"
        >
          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white shadow-sm">
            <ArrowLeft size={12} />
          </div>
          <span className="font-bold text-gray-700">Back</span>
        </button>

        <button
          onClick={handleForward}
          disabled={historyIdx >= history.length - 1}
          className="p-1 rounded hover:bg-white/60 active:bg-black/10 disabled:opacity-40"
          title="Forward"
        >
          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white shadow-sm">
            <ArrowRight size={12} />
          </div>
        </button>

        <button
          onClick={() => setIsLoading(false)}
          className="p-1 rounded hover:bg-white/60 active:bg-black/10"
          title="Stop"
        >
          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shadow-sm">
            <X size={12} />
          </div>
        </button>

        <button
          onClick={handleRefresh}
          className="p-1 rounded hover:bg-white/60 active:bg-black/10"
          title="Refresh"
        >
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <RotateCw size={12} />
          </div>
        </button>

        <button
          onClick={() => navigateTo('about:home')}
          className="p-1 rounded hover:bg-white/60 active:bg-black/10"
          title="Home"
        >
          <Home size={16} className="text-yellow-600" />
        </button>

        <div className="h-5 w-[1px] bg-gray-400 mx-1" />

        <button
          onClick={() => navigateTo('about:google')}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60"
        >
          <Search size={14} className="text-[#0058EE]" />
          <span>Search</span>
        </button>

        <button
          onClick={() => soundEffects.playBalloon()}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60"
        >
          <Star size={14} className="text-yellow-500 fill-yellow-400" />
          <span>Favorites</span>
        </button>
      </div>

      {/* Address Bar */}
      <form onSubmit={handleSubmitUrl} className="bg-[#ECE9D8] border-b border-gray-400 px-2 py-1 flex items-center gap-2">
        <span className="text-gray-500 font-semibold">Address</span>
        <div className="flex-1 bg-white border border-gray-400 px-2 py-0.5 flex items-center gap-2 shadow-inner">
          <Globe size={14} className="text-blue-600 shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs font-tahoma"
          />
        </div>
        <button
          type="submit"
          className="xp-button px-3 py-0.5 flex items-center gap-1 text-green-700 font-bold"
        >
          <CornerDownRight size={12} />
          <span>Go</span>
        </button>
      </form>

      {/* Bookmarks Quick Bar */}
      <div className="bg-[#ECE9D8] border-b border-gray-300 px-2 py-0.5 flex items-center gap-2 text-[11px] overflow-x-auto">
        <span className="text-gray-400 font-semibold shrink-0">Links:</span>
        {BOOKMARKS.map(bm => (
          <button
            key={bm.name}
            onClick={() => navigateTo(bm.url)}
            className="hover:underline text-blue-800 hover:text-blue-900 shrink-0 flex items-center gap-1"
          >
            <span>{bm.name}</span>
          </button>
        ))}
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 bg-white overflow-auto relative">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-100 overflow-hidden z-10">
            <div className="h-full bg-blue-600 animate-[xp-boot-progress_1s_infinite_linear] w-1/3" />
          </div>
        )}

        {/* 1. Classic Google Search 2004 Page */}
        {currentUrl === 'about:google' && (
          <div className="h-full flex flex-col items-center justify-center p-6 bg-white text-center font-arial select-text">
            {/* Vintage Google Logo */}
            <div className="text-5xl font-bold tracking-tight mb-4 select-none">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>

            <div className="w-full max-w-md">
              <input
                type="text"
                placeholder="Search Arsh's portfolio, projects, skills..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') navigateTo('about:home');
                }}
                className="w-full border-2 border-gray-400 p-2 text-sm rounded shadow-inner mb-4 focus:outline-none focus:border-blue-500"
              />

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => navigateTo('about:home')}
                  className="xp-button px-4 py-1.5 text-xs font-bold text-gray-800"
                >
                  Google Search
                </button>
                <button
                  onClick={() => navigateTo('https://github.com/Arsh-pixel-cmd')}
                  className="xp-button px-4 py-1.5 text-xs text-gray-700"
                >
                  I'm Feeling Lucky
                </button>
              </div>
            </div>

            <div className="mt-8 text-xs text-gray-500">
              <span>Google.com in Windows XP Edition • Powered by Cloudflare D1</span>
            </div>
          </div>
        )}

        {/* 2. Portfolio Portal Home */}
        {currentUrl === 'about:home' && (
          <div className="p-6 max-w-2xl mx-auto space-y-6 select-text font-tahoma">
            <div className="border-b-2 border-blue-600 pb-3">
              <h1 className="text-xl font-bold text-blue-900">
                Arsh Mishra - Portfolio Portal
              </h1>
              <p className="text-xs text-gray-500">
                Senior Systems Architect & Full-Stack Engineer
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => navigateTo('https://github.com/Arsh-pixel-cmd/expense-tracker')}
                className="border border-blue-200 p-3 bg-blue-50/50 rounded hover:bg-blue-100/60 cursor-pointer transition-colors"
              >
                <h3 className="font-bold text-blue-800 text-sm mb-1">
                  SmartSpend AI
                </h3>
                <p className="text-xs text-gray-600">
                  AI-driven expense management platform with Groq and Gemini multimodal pipelines.
                </p>
              </div>

              <div 
                onClick={() => navigateTo('https://jyotix-astro.vercel.app')}
                className="border border-purple-200 p-3 bg-purple-50/50 rounded hover:bg-purple-100/60 cursor-pointer transition-colors"
              >
                <h3 className="font-bold text-purple-800 text-sm mb-1">
                  Jyotix-Astro
                </h3>
                <p className="text-xs text-gray-600">
                  AI-driven astrology platform with Gemini conversational engines.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 border border-gray-300 rounded text-xs space-y-2">
              <h4 className="font-bold text-gray-800">Direct Navigation:</h4>
              <p className="text-gray-600">
                You can browse any external webpage using the address bar above. If a third-party website blocks iframe embedding, click "Open in External Window" to launch it directly.
              </p>
            </div>
          </div>
        )}

        {/* 3. External Webpages */}
        {currentUrl.startsWith('http') && (
          <div className="h-full flex flex-col">
            <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-yellow-800 shrink-0">
              <span>Viewing external site: <strong>{currentUrl}</strong></span>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                <span>Open in Real Browser</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <iframe
              src={currentUrl}
              title="Internet Explorer Browser View"
              className="w-full flex-1 border-none"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-[#ECE9D8] border-t border-gray-400 px-3 py-1 flex items-center justify-between text-gray-600 text-[11px]">
        <div className="flex items-center gap-1.5">
          <Globe size={13} className="text-blue-600" />
          <span>{isLoading ? 'Opening page...' : 'Done'}</span>
        </div>
        <div className="flex items-center gap-2 border-l border-gray-400 pl-3">
          <Lock size={12} className="text-yellow-600" />
          <span>Internet | Protected Mode: On</span>
        </div>
      </div>
    </div>
  );
};
