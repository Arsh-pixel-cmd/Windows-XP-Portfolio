import React, { useState } from 'react';
import { Power, ArrowRight, User, ShieldCheck, Key, HelpCircle } from 'lucide-react';
import { authStore } from '../core/authStore';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onTurnOff: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onTurnOff }) => {
  const [selectedUser, setSelectedUser] = useState<'admin' | 'guest' | null>(null);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    const success = await authStore.loginAsAdmin(password);
    setIsSubmitting(false);

    if (success) {
      onLoginSuccess();
    } else {
      const err = authStore.getState().error;
      setErrorMsg(err || 'The password you entered is incorrect.');
    }
  };

  const handleGuestLogin = () => {
    authStore.loginAsGuest();
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 z-[20000] bg-[#00138C] text-white flex flex-col justify-between select-none font-tahoma overflow-hidden">
      {/* Top Banner */}
      <div className="h-16 bg-gradient-to-r from-[#001B6B] via-[#0A249D] to-[#001B6B] border-b-2 border-[#002685] flex items-center justify-between px-10 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold tracking-tighter text-white">
            <span className="italic text-blue-300">Windows</span>
            <span className="text-orange-400 ml-1.5 font-normal">XP</span>
          </span>
          <span className="text-xs uppercase tracking-widest text-blue-200 mt-2 font-semibold ml-2">Professional</span>
        </div>
        <div className="text-sm font-light text-blue-200 italic">
          To begin, click your user name
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex items-center justify-center px-12 py-6 bg-gradient-to-b from-[#002890] via-[#0039B5] to-[#001A70]">
        <div className="w-full max-w-4xl flex items-center justify-between gap-12">
          {/* Left Hero Instructions */}
          <div className="w-[38%] flex flex-col gap-4 border-r border-blue-400/30 pr-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded border border-white/20 flex items-center justify-center">
                <ShieldCheck size={28} className="text-orange-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Welcome to Arsh OS</h1>
                <p className="text-xs text-blue-200">Interactive Systems Portfolio</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-blue-100">
              Sign in as <b>Guest</b> to view and interact with live projects, the simulated kernel, terminal, and system monitor.
            </p>
            <p className="text-xs leading-relaxed text-blue-200">
              Sign in as <b>Administrator</b> to manage portfolio projects, profile info, and synchronize with Cloudflare D1.
            </p>
          </div>

          {/* Right Users Panel */}
          <div className="w-[62%] flex flex-col gap-5 pl-4">
            {/* Arsh - Administrator */}
            <div 
              className={`p-3 rounded-lg border transition-all ${
                selectedUser === 'admin' 
                  ? 'bg-blue-600/40 border-orange-400/80 shadow-lg' 
                  : 'bg-transparent border-transparent hover:bg-white/10'
              }`}
            >
              <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => {
                  setSelectedUser(selectedUser === 'admin' ? null : 'admin');
                  setErrorMsg(null);
                }}
              >
                <div className="w-16 h-16 rounded-md bg-[#D97706] p-1 border-2 border-white/80 shadow-md flex items-center justify-center relative overflow-hidden">
                  <User size={36} className="text-white" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border border-white" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    Arsh Mishra
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500 text-white font-semibold uppercase">Admin</span>
                  </div>
                  <div className="text-xs text-blue-200">System Architect & Administrator</div>
                </div>
              </div>

              {/* Password prompt */}
              {selectedUser === 'admin' && (
                <form onSubmit={handleAdminLogin} className="mt-4 pt-3 border-t border-blue-400/30 pl-20 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-100 font-semibold">Type your password:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type="password"
                        autoFocus
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrorMsg(null);
                        }}
                        placeholder="Admin password..."
                        className="w-full px-3 py-1.5 text-sm bg-white text-black rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <Key size={14} className="absolute right-2.5 top-2.5 text-gray-400" />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-8 h-8 rounded bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 border border-green-300 flex items-center justify-center text-white shadow active:translate-y-0.5 disabled:opacity-50"
                      title="Log on"
                    >
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className="p-1.5 text-blue-200 hover:text-white"
                      title="Password Hint"
                    >
                      <HelpCircle size={18} />
                    </button>
                  </div>

                  {showHint && (
                    <div className="text-[11px] text-amber-300 bg-amber-950/60 p-2 rounded border border-amber-500/40 max-w-xs">
                      🔒 <b>Hint:</b> Enter the administrator master password configured in Cloudflare Secrets.
                    </div>
                  )}

                  {errorMsg && (
                    <div className="text-[11px] text-red-200 bg-red-950/80 p-2 rounded border border-red-500 max-w-xs">
                      ⚠️ {errorMsg}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Guest - Visitor */}
            <div 
              className={`p-3 rounded-lg border transition-all ${
                selectedUser === 'guest' 
                  ? 'bg-blue-600/40 border-blue-300/80 shadow-lg' 
                  : 'bg-transparent border-transparent hover:bg-white/10'
              }`}
            >
              <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={handleGuestLogin}
              >
                <div className="w-16 h-16 rounded-md bg-[#2563EB] p-1 border-2 border-white/80 shadow-md flex items-center justify-center">
                  <User size={36} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    Guest
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500 text-white font-semibold uppercase">Visitor</span>
                  </div>
                  <div className="text-xs text-blue-200">Click to enter portfolio (no password required)</div>
                </div>
                <button
                  onClick={handleGuestLogin}
                  className="px-4 py-1.5 bg-gradient-to-b from-[#4A8BE8] to-[#1D5ADA] hover:from-[#5B9CF9] hover:to-[#2A6CEB] border border-white/40 text-xs font-bold rounded shadow active:translate-y-0.5"
                >
                  Enter &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-14 bg-gradient-to-r from-[#001B6B] via-[#0A249D] to-[#001B6B] border-t-2 border-[#002685] flex items-center justify-between px-10">
        <button
          onClick={onTurnOff}
          className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/10 transition-colors text-xs font-semibold text-white border border-transparent hover:border-white/30"
        >
          <div className="w-6 h-6 rounded-full bg-red-600 border border-white/80 flex items-center justify-center shadow">
            <Power size={13} className="text-white" />
          </div>
          <span>Turn off computer</span>
        </button>

        <div className="text-xs text-blue-200 italic">
          Windows XP Kernel Simulator v4.0 • Cloudflare D1 Sync Ready
        </div>
      </div>
    </div>
  );
};
