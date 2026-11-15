// src/components/BsodScreen.tsx
import React, { useEffect } from 'react';
import { soundEffects } from '../core/soundEffects';

interface BsodScreenProps {
  onRestart: () => void;
  code?: string;
}

export const BsodScreen: React.FC<BsodScreenProps> = ({ onRestart, code = '0x000000D1' }) => {
  useEffect(() => {
    soundEffects.playError();

    const handleKey = () => {
      onRestart();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onRestart]);

  return (
    <div
      onClick={onRestart}
      className="fixed inset-0 z-[40000] bg-[#0000AA] text-white font-mono p-12 text-sm leading-relaxed select-none cursor-pointer flex flex-col justify-between"
    >
      <div>
        <p className="bg-gray-300 text-[#0000AA] inline-block px-2 font-bold mb-6">
          Windows
        </p>

        <p className="mb-4">
          A problem has been detected and Windows has been shut down to prevent damage
          to your computer.
        </p>

        <p className="mb-4 font-bold text-yellow-300">
          DRIVER_IRQL_NOT_LESS_OR_EQUAL
        </p>

        <p className="mb-4">
          If this is the first time you've seen this stop error screen,
          restart your computer. If this screen appears again, follow
          these steps:
        </p>

        <p className="mb-4">
          Check to make sure any new hardware or software is properly installed.
          If this is a new installation, ask your hardware or software manufacturer
          for any Windows updates you might need.
        </p>

        <p className="mb-4">
          If problems continue, disable or remove any newly installed hardware
          or software. Disable BIOS memory options such as caching or shadowing.
          If you need to use Safe Mode to remove or disable components, restart
          your computer, press F8 to select Advanced Startup Options, and then
          select Safe Mode.
        </p>

        <p className="mb-2">Technical information:</p>
        <p className="font-bold">
          *** STOP: {code} (0x0000000C, 0x00000002, 0x00000000, 0xF86B5A89)
        </p>
        <p className="mt-1 text-gray-300">
          *** arsh_kernel.sys - Address F86B5A89 base at F86B2000, DateStamp 3d6dd67c
        </p>
      </div>

      <div className="text-gray-400 text-xs animate-pulse">
        Press any key or click anywhere to restart Windows XP...
      </div>
    </div>
  );
};
