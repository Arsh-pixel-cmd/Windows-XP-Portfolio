import React from 'react';
import { Mail } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] p-3 text-sm select-none">
      <div className="flex items-center gap-4 mb-4 border-b border-[#D5D2C1] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.8)]">
        <div className="w-12 h-12 bg-gradient-to-br from-[#0058EE] to-[#378DFF] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),2px_2px_4px_rgba(0,0,0,0.3)] border border-[#0F367A]">
          <Mail size={24} fill="currentColor" className="text-blue-100" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-black drop-shadow-[1px_1px_0_rgba(255,255,255,0.8)]">Internet Communication</h2>
          <p className="text-xs text-gray-700">Send a message directly to the developer.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 px-2">
        <div className="flex items-center gap-2">
          <label className="w-[70px] text-right text-black">To:</label>
          <input type="text" value="Frontend Developer" disabled className="flex-1 px-1.5 py-1 border border-[#7A96DF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] bg-gray-200 text-gray-600 cursor-not-allowed" />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-[70px] text-right text-black">From:</label>
          <input type="text" placeholder="Your Email" className="flex-1 px-1.5 py-1 border border-[#7A96DF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#0058EE] focus:ring-1 focus:ring-[#0058EE]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-[70px] text-right text-black">Subject:</label>
          <input type="text" placeholder="Job Offer / Inquiry" className="flex-1 px-1.5 py-1 border border-[#7A96DF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#0058EE] focus:ring-1 focus:ring-[#0058EE]" />
        </div>
        <div className="flex flex-col flex-1 gap-1 mt-1">
          <label className="pl-[78px] text-black">Message:</label>
          <textarea className="flex-1 ml-[78px] p-2 border border-[#7A96DF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#0058EE] resize-none focus:ring-1 focus:ring-[#0058EE]" />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#D5D2C1] shadow-[0_-1px_0_rgba(255,255,255,0.8)_inset]">
        <button className="min-w-[85px] px-4 py-1.5 bg-[#ECE9D8] border border-gray-400 rounded-[3px] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.8),1px_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)] active:translate-y-[1px] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
          Send
        </button>
        <button className="min-w-[85px] px-4 py-1.5 bg-[#ECE9D8] border border-gray-400 rounded-[3px] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.8),1px_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)] active:translate-y-[1px] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
          Cancel
        </button>
      </div>
    </div>
  );
};