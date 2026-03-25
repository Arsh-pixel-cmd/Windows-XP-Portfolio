import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="h-full bg-[#ECE9D8] flex flex-col font-tahoma">
      <div className="p-8 flex-1 overflow-auto">
        <div className="max-w-md mx-auto bg-white border border-[#7A96DF] p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Let’s build something real.</h2>
          <p className="text-xs text-gray-500 mb-6">Establishing secure connection to Arsh's neural link...</p>

          <div className="space-y-4">
            <a
              href="mailto:arshmishra37@gmail.com"
              className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-100 hover:bg-white hover:border-blue-300 transition-all group"
            >
              <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                <p className="text-sm font-bold text-gray-800">arshmishra37@gmail.com</p>
              </div>
            </a>

            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://github.com/Arsh-pixel-cmd" target="_blank" rel="noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 border border-gray-100 hover:bg-white hover:border-blue-300 transition-all group text-center"
              >
                <Github size={24} className="text-gray-700" />
                <span className="text-xs font-bold text-gray-600">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/arsh-mishra-030093325/" target="_blank" rel="noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 border border-gray-100 hover:bg-white hover:border-blue-300 transition-all group text-center"
              >
                <Linkedin size={24} className="text-blue-700" />
                <span className="text-xs font-bold text-gray-600">LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Available for</p>
            <div className="flex flex-wrap gap-2">
              {['Freelance', 'Internships', 'System Design', 'AI Engineering'].map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-bold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#D4D0C8] p-2 flex justify-end gap-2 border-t border-white">
        <button className="px-4 py-1 bg-[#ECE9D8] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-500 shadow-sm text-xs font-bold active:border-gray-500 active:border-b-white active:border-r-white min-w-[80px]">
          Cancel
        </button>
        <button className="px-4 py-1 bg-[#ECE9D8] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-500 shadow-sm text-xs font-bold active:border-gray-500 active:border-b-white active:border-r-white min-w-[80px]">
          Send Message
        </button>
      </div>
    </div>
  );
};