import React from 'react';
import { Mail, Github, Linkedin, MapPin, Send, ExternalLink } from 'lucide-react';
import { Process, SystemState } from '../core/types';

interface ContactProps {
  process: Process;
  systemState: SystemState;
}

export const Contact: React.FC<ContactProps> = () => {
  return (
    <div className="h-full bg-[#ECE9D8] flex flex-col font-tahoma">
      <div className="p-8 flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Get In Touch</h2>
            <p className="text-gray-600 mt-2">Open for collaborations, system design roles, and interesting engineering challenges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-gray-300 shadow-sm rounded-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</p>
                  <a href="mailto:arsh_mishra@engineer.com" className="text-blue-600 hover:underline font-bold">arsh_mishra@engineer.com</a>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-300 shadow-sm rounded-sm text-gray-400 italic">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                  <p className="font-bold">New Delhi / Remote</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <a 
              href="https://github.com/arsh-mishra" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-gray-900 text-white p-4 rounded-sm flex items-center justify-center gap-2 hover:bg-black transition-colors"
            >
              <Github size={20} />
              <span className="font-bold">GitHub</span>
              <ExternalLink size={14} className="opacity-50" />
            </a>
            <a 
              href="https://linkedin.com/in/arsh-mishra" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-[#0077b5] text-white p-4 rounded-sm flex items-center justify-center gap-2 hover:bg-[#006396] transition-colors"
            >
              <Linkedin size={20} />
              <span className="font-bold">LinkedIn</span>
              <ExternalLink size={14} className="opacity-50" />
            </a>
          </div>

          <div className="bg-white border border-gray-300 p-8 shadow-sm">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <Send size={18} className="text-blue-500" />
               System Signal
             </h3>
             <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">Subject</label>
                  <input type="text" className="w-full border border-gray-300 p-2 text-sm focus:outline-blue-500" placeholder="Engineering Inquiry..." />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">Message Payload</label>
                  <textarea className="w-full border border-gray-300 p-2 text-sm min-h-[100px] focus:outline-blue-500 resize-none" placeholder="Enter your proposal here..." />
                </div>
                <button className="bg-[#1D5ADA] text-white px-6 py-2 rounded-sm font-bold text-sm hover:bg-[#316AC5] border-b-2 border-r-2 border-[#0A3D91] active:border-0 shadow-md">
                   Dispatch Process
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="h-8 bg-[#ECE9D8] border-t border-gray-300 px-4 flex items-center justify-between text-[10px] text-gray-500 italic">
        <span>Protocol: SMTP/Secure</span>
        <span>Availability: {'>'}99.9%</span>
      </div>
    </div>
  );
};