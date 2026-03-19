import React, { useState } from 'react';
import { motion, useDragControls } from 'motion/react';
import { Resizable } from 're-resizable';
import { X, Square, Minus } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  defaultSize?: { width: number; height: number };
}

export const Window: React.FC<WindowProps> = ({
  title,
  icon,
  zIndex,
  onClose,
  onFocus,
  children,
  defaultSize = { width: 500, height: 400 }
}) => {
  const dragControls = useDragControls();
  const [position] = useState(() => ({
    x: 50 + Math.random() * 50,
    y: 50 + Math.random() * 50
  }));

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onMouseDown={onFocus}
      initial={position}
      style={{ zIndex, position: 'absolute' }}
      className="pointer-events-auto"
    >
      <Resizable
        defaultSize={defaultSize}
        minWidth={300}
        minHeight={200}
        className="flex flex-col bg-[#ECE9D8] rounded-t-[8px] rounded-b-[3px] shadow-[2px_2px_10px_rgba(0,0,0,0.5),-1px_-1px_1px_rgba(255,255,255,0.8)] border border-[#0058EE] overflow-hidden"
        onResizeStart={onFocus}
      >
        {/* Header */}
        <div 
          className="window-header h-[30px] bg-gradient-to-r from-[#0058EE] to-[#378DFF] flex items-center justify-between cursor-move select-none p-1 shrink-0"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="flex items-center gap-1.5 font-bold text-white text-xs px-1 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.6)] font-trebuchet">
            {icon} {title}
          </div>
          <div className="flex gap-[2px] pr-0.5 pb-0.5" onPointerDown={e => e.stopPropagation()}>
            <button
              className="w-[21px] h-[21px] bg-[#ECE9D8] hover:bg-[#D5D2C1] border border-white rounded-[3px] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.8),inset_-1px_-1px_1px_rgba(0,0,0,0.2)] flex items-center justify-center focus:outline-none"
            >
              <Minus size={12} strokeWidth={3} className="text-black translate-y-[3px]" />
            </button>
            <button
              className="w-[21px] h-[21px] bg-[#ECE9D8] hover:bg-[#D5D2C1] border border-white rounded-[3px] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.8),inset_-1px_-1px_1px_rgba(0,0,0,0.2)] flex items-center justify-center focus:outline-none"
            >
              <Square size={10} strokeWidth={3} className="text-black" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-[21px] h-[21px] bg-[#E81123] hover:bg-[#F25056] border border-white rounded-[3px] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_rgba(0,0,0,0.4)] flex items-center justify-center focus:outline-none ml-[2px]"
            >
              <X size={12} strokeWidth={3} className="text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)]" />
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col m-1 bg-white border border-[#7A96DF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] overflow-hidden text-sm font-tahoma" onPointerDown={e => e.stopPropagation()}>
          {children}
        </div>
      </Resizable>
    </motion.div>
  );
};