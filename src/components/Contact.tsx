import React from 'react';
import { Mail, Github, Linkedin, MapPin, Send, ExternalLink } from 'lucide-react';
import { Process, SystemState } from '../core/types';

interface ContactProps {
  process: Process;
  systemState: SystemState;
}

export const Contact: React.FC<ContactProps> = () => {
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleDispatch = () => {
    const mailtoUrl = `mailto:arshmishra37@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="h-full bg-[#ECE9D8] flex flex-col font-tahoma selection:bg-[#316AC5] selection:text-white">
      <div className="p-8 flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">Get In Touch</h2>
            <p className="text-gray-600 mt-2">Open for collaborations, system design roles, and interesting engineering challenges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 border border-gray-300 shadow-sm rounded-sm overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Email</p>
                  <a href="mailto:arshmishra37@gmail.com" className="text-blue-600 hover:underline font-bold text-sm block truncate">arshmishra37@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 border border-gray-300 shadow-sm rounded-sm overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="text-green-600" size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Location</p>
                  <p className="font-bold text-gray-700 text-sm truncate">Greater Noida, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <a 
              href="https://github.com/Arsh-pixel-cmd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-gray-900 text-white p-4 rounded-sm flex items-center justify-center gap-3 hover:bg-black transition-all border-b-2 border-gray-700 shadow-md group active:translate-y-0.5 active:border-0"
            >
              <Github size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">GitHub</span>
              <ExternalLink size={12} className="opacity-40" />
            </a>
            <a 
              href="https://www.linkedin.com/in/arsh-mishra-030093325/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-[#0077b5] text-white p-4 rounded-sm flex items-center justify-center gap-3 hover:bg-[#006396] transition-all border-b-2 border-[#005885] shadow-md group active:translate-y-0.5 active:border-0"
            >
              <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">LinkedIn</span>
              <ExternalLink size={12} className="opacity-40" />
            </a>
          </div>

          <div className="bg-white border border-gray-300 p-8 shadow-sm rounded-sm">
             <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
               <Send size={18} className="text-blue-500" />
               System Signal Dispatch
             </h3>
             <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquiry Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-gray-300 p-2.5 text-sm focus:outline-blue-500 bg-gray-50 focus:bg-white transition-colors" 
                    placeholder="Engineering Payload Target..." 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message Payload</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-300 p-2.5 text-sm min-h-[120px] focus:outline-blue-500 bg-gray-50 focus:bg-white transition-colors resize-none" 
                    placeholder="Describe your architectural requirements here..." 
                  />
                </div>
                <button 
                  onClick={handleDispatch}
                  className="bg-[#1D5ADA] text-white px-8 py-3 rounded-sm font-bold text-sm hover:bg-[#316AC5] border-b-4 border-r-2 border-[#0A3D91] active:translate-y-0.5 active:border-0 shadow-lg transition-all flex items-center gap-2 group"
                >
                   <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   Dispatch Process
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="h-8 bg-[#F0F0E7] border-t border-gray-300 px-6 flex items-center justify-between text-[10px] text-gray-500 font-bold shrink-0">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Protocol: SMTP/Secure</span>
          <span>Status: SIGNAL_READY</span>
        </div>
        <span>Availability: {'>'}99.9% // ARSH-KERNEL</span>
      </div>
    </div>
  );
};