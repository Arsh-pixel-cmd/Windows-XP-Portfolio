import React, { useState, useEffect } from 'react';
import { User, Cpu, Boxes } from 'lucide-react';
import { portfolioStore } from '../core/portfolioStore';
import { ProfileData } from '../types/portfolio';

export const Identity: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(portfolioStore.getData().profile);

  useEffect(() => {
    const unsub = portfolioStore.subscribe(data => setProfile(data.profile));
    return () => { unsub(); };
  }, []);

  return (
    <div className="h-full bg-white flex flex-col font-tahoma overflow-hidden select-text">
      <div className="flex-1 p-8 bg-gradient-to-br from-[#0058EE] to-[#3A89FF] text-white flex flex-col justify-center gap-6 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
          <Cpu size={300} strokeWidth={1} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <User size={24} className="text-orange-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter leading-none">{profile.name}</h1>
          </div>
          <p className="text-blue-100 font-bold tracking-widest uppercase text-[10px] ml-11">{profile.title}</p>
        </div>
        
        <div className="h-[2px] w-12 bg-orange-500 rounded-full ml-11" />
        
        <div className="ml-11 space-y-6">
          <p className="text-2xl font-medium leading-tight max-w-md">
            {profile.headline}
          </p>
          
          <div className="space-y-4 pt-2">
            {profile.core_focus.slice(0, 3).map((focus, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-orange-400 border border-white/10 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  <Boxes size={16} />
                </div>
                <p className="font-bold text-sm tracking-wide">{focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-8 py-3 bg-[#F0F0E0] border-t border-gray-400 flex justify-between items-center shrink-0">
        <p className="text-[10px] text-gray-500 italic font-bold">
          {profile.quote || '"Engineering is the art of reliable abstractions."'}
        </p>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/20" />
        </div>
      </div>
    </div>
  );
};

export default Identity;
