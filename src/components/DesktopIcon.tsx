import React from 'react';
import { motion } from 'motion/react';

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  onDoubleClick: () => void;
  onMove: (x: number, y: number) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, x, y, onDoubleClick, onMove }) => {
  return (
    <motion.div
      key={label}
      drag
      dragMomentum={false}
      dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 75, bottom: window.innerHeight - 120 }}
      whileDrag={{ zIndex: 1000 }}
      onDragEnd={(_, info) => {
        onMove(x + info.offset.x, y + info.offset.y);
      }}
      initial={{ x, y }}
      animate={{ x, y }}
      transition={{ type: 'spring', damping: 25, stiffness: 500, mass: 0.5 }}
      className="absolute flex flex-col items-center justify-start w-[72px] h-[80px] p-1 hover:bg-blue-500/30 rounded-[3px] cursor-pointer group select-none"
      onDoubleClick={onDoubleClick}
      style={{ left: 0, top: 0 }}
    >
      <div className="w-10 h-10 flex items-center justify-center mb-1 drop-shadow-md pointer-events-none">
        {icon}
      </div>
      <div className="text-center text-[11px] text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)] px-0.5 leading-tight group-hover:bg-[#0B61FF] group-hover:drop-shadow-none line-clamp-2 font-tahoma pointer-events-none">
        {label}
      </div>
    </motion.div>
  );
};