import React from 'react';

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  onDoubleClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, onDoubleClick }) => {
  return (
    <div
      className="flex flex-col items-center justify-start w-[72px] h-[80px] m-1 p-1 hover:bg-blue-500/30 rounded-[3px] cursor-pointer group select-none"
      onDoubleClick={onDoubleClick}
    >
      <div className="w-10 h-10 flex items-center justify-center mb-1 drop-shadow-md">
        {icon}
      </div>
      <div className="text-center text-xs text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)] px-0.5 leading-tight group-hover:bg-[#0B61FF] group-hover:drop-shadow-none line-clamp-2" style={{ fontFamily: "Tahoma, 'MS Sans Serif', sans-serif" }}>
        {label}
      </div>
    </div>
  );
};