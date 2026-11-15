import React, { useState, useEffect } from 'react';
import { Process, SystemState } from '../core/types';
import { portfolioStore } from '../core/portfolioStore';
import { ProfileData } from '../types/portfolio';

interface AboutMeProps {
  process: Process;
  systemState: SystemState;
}

export const AboutMe: React.FC<AboutMeProps> = () => {
  const [profile, setProfile] = useState<ProfileData>(portfolioStore.getData().profile);
  const [skills, setSkills] = useState(portfolioStore.getData().skills);

  useEffect(() => {
    const unsub = portfolioStore.subscribe(data => {
      setProfile(data.profile);
      setSkills(data.skills);
    });
    return () => { unsub(); };
  }, []);

  const allSkills = skills.flatMap(s => s.items);

  return (
    <div className="p-6 h-full overflow-auto bg-white text-gray-800 leading-relaxed font-tahoma select-text">
      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-1 inline-block">
            {profile.name}
          </h2>
          <p className="text-lg font-bold text-blue-800 mt-1">{profile.title}</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            {profile.bio}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 border border-blue-100 rounded">
            <h3 className="font-bold text-blue-800 flex items-center gap-2">🚀 Core Focus</h3>
            <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
              {profile.core_focus.map((focus, i) => (
                <li key={i}>{focus}</li>
              ))}
            </ul>
          </div>
          <div className="bg-orange-50 p-4 border border-orange-100 rounded">
            <h3 className="font-bold text-orange-800 flex items-center gap-2">🧠 Philosophy</h3>
            <p className="mt-2 text-xs whitespace-pre-line leading-relaxed">
              {profile.philosophy}
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 border-b pb-1 mb-2">Technical Prowess</h3>
          <div className="flex flex-wrap gap-2">
            {allSkills.map(skill => (
              <span key={skill} className="px-2 py-1 bg-gray-100 border rounded text-[10px] font-bold text-gray-600">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {profile.quote && (
          <section className="bg-gray-900 text-white p-4 rounded shadow-lg">
            <p className="text-xs italic leading-relaxed opacity-90">
              "{profile.quote}"
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default AboutMe;
