// src/components/RunDialog.tsx
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { soundEffects } from '../core/soundEffects';

interface RunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRun: (command: string) => boolean;
}

const COMMON_COMMANDS = ['cmd', 'notepad', 'explorer', 'control', 'projects', 'about', 'systems', 'experiments', 'contact', 'sysmon', 'bsod'];

export const RunDialog: React.FC<RunDialogProps> = ({ isOpen, onClose, onRun }) => {
  const [cmd, setCmd] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = cmd.trim();
    if (!target) return;

    const success = onRun(target);
    if (success) {
      soundEffects.playClick();
      setCmd('');
      setErrorMsg(null);
      onClose();
    } else {
      soundEffects.playError();
      setErrorMsg(`Windows cannot find '${target}'. Make sure you typed the name correctly, and then try again.`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[28000] bg-black/40 flex items-center justify-center font-tahoma select-none text-xs"
      onClick={onClose}
    >
      <div
        className="w-[390px] bg-[#ECE9D8] rounded-[5px] border-2 border-[#0058EE] shadow-2xl overflow-hidden p-[2px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="h-[26px] bg-gradient-to-r from-[#0058EE] via-[#378DFF] to-[#0058EE] px-2 flex items-center justify-between text-white font-bold drop-shadow">
          <div className="flex items-center gap-1.5">
            <span className="font-trebuchet text-xs">Run</span>
          </div>
          <button
            onClick={onClose}
            className="w-[18px] h-[18px] bg-[#E0533C] hover:bg-[#F26C4F] rounded-[2px] flex items-center justify-center text-white font-bold text-[10px] shadow"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          <div className="flex gap-3 items-start">
            {/* Windows XP Run Icon */}
            <div className="w-8 h-8 rounded bg-white border border-gray-400 p-1 flex items-center justify-center shrink-0 shadow-sm">
              <div className="grid grid-cols-2 gap-0.5 w-5 h-5 rotate-12">
                <div className="bg-[#F65314]" />
                <div className="bg-[#7CBB00]" />
                <div className="bg-[#00A1F1]" />
                <div className="bg-[#FFBB00]" />
              </div>
            </div>

            <p className="text-gray-800 leading-normal">
              Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <label htmlFor="run-cmd-input" className="font-bold text-gray-700 w-12">Open:</label>
              <div className="flex-1 relative">
                <input
                  id="run-cmd-input"
                  type="text"
                  autoFocus
                  list="run-commands-list"
                  value={cmd}
                  onChange={e => {
                    setCmd(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full border border-gray-500 bg-white p-1 text-xs focus:outline-[#0058EE] font-mono shadow-inner"
                  placeholder="e.g. cmd, explorer, control..."
                />
                <datalist id="run-commands-list">
                  {COMMON_COMMANDS.map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2 bg-red-50 border border-red-300 text-red-700 rounded-sm flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-300">
              <button
                type="submit"
                className="xp-button px-5 py-1 font-bold text-gray-800 border border-gray-500"
              >
                OK
              </button>
              <button
                type="button"
                onClick={onClose}
                className="xp-button px-5 py-1 text-gray-800 border border-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setCmd('explorer');
                }}
                className="xp-button px-4 py-1 text-gray-800 border border-gray-500"
              >
                Browse...
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
