import React, { useMemo } from 'react';
import { motion, useDragControls } from 'motion/react';
import { Resizable } from 're-resizable';

interface WindowProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  zIndex: number;
  active: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = React.memo(({
  title,
  icon,
  zIndex,
  active,
  isMinimized,
  isMaximized,
  position,
  size,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  children,
}) => {
  const dragControls = useDragControls();

  const windowStyle = useMemo(() => ({
    zIndex,
    position: 'absolute' as const,
    display: isMinimized ? 'none' : 'block',
    width: isMaximized ? '100%' : 'auto',
    height: isMaximized ? 'calc(100% - 30px)' : 'auto',
    top: isMaximized ? 0 : 'auto',
    left: isMaximized ? 0 : 'auto',
  }), [zIndex, isMinimized, isMaximized]);

  if (isMinimized) return null;

  return (
    <motion.div
      drag={!isMaximized}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 100, bottom: window.innerHeight - 100 }}
      onDragEnd={(_, info) => {
        onMove(position.x + info.offset.x, position.y + info.offset.y);
      }}
      onMouseDown={onFocus}
      initial={position}
      animate={isMaximized ? { x: 0, y: 0 } : { x: position.x, y: position.y }}
      style={windowStyle}
      className={`pointer-events-auto ${active ? 'z-[100]' : ''}`}
    >
      <Resizable
        size={isMaximized ? { width: '100%', height: 'calc(100vh - 30px)' } : size}
        minWidth={300}
        minHeight={200}
        enable={isMaximized ? false : {
          top: true, right: true, bottom: true, left: true,
          topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
        }}
        onResizeStop={(_, __, ref) => {
          onResize(ref.offsetWidth, ref.offsetHeight);
        }}
        className={`flex flex-col bg-[#ECE9D8] rounded-t-[8px] ${!isMaximized ? 'rounded-b-[3px] shadow-[2px_2px_10px_rgba(0,0,0,0.5),-1px_-1px_1px_rgba(255,255,255,0.8)]' : ''} border border-[#0058EE] overflow-hidden`}
        onResizeStart={onFocus}
      >
        {/* Header */}
        <div 
          className={`window-header h-[30px] ${active ? 'bg-gradient-to-r from-[#0058EE] to-[#378DFF]' : 'bg-[#7A96DF]'} flex items-center justify-between cursor-move select-none p-1 shrink-0`}
          onPointerDown={(e) => !isMaximized && dragControls.start(e)}
        >
          <div className="flex items-center gap-1.5 font-bold text-white text-xs px-1 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.6)] font-trebuchet">
            {icon} {title}
          </div>
            <div className="flex gap-[3px] pr-1 pb-1" onPointerDown={e => e.stopPropagation()}>
              <button
                onClick={onMinimize}
                className="w-[21px] h-[21px] bg-[#ECE9D8] hover:bg-[#D5D2C1] xp-window-btn flex items-center justify-center focus:outline-none transition-colors border border-white"
                title="Minimize"
              >
                <div className="w-2 h-[3px] bg-black mt-2" />
              </button>
              <button
                onClick={onMaximize}
                className="w-[21px] h-[21px] bg-[#ECE9D8] hover:bg-[#D5D2C1] xp-window-btn flex items-center justify-center focus:outline-none transition-colors border border-white"
                title={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized ? (
                  <div className="relative w-[10px] h-[10px]">
                    <div className="absolute top-0 right-0 w-[8px] h-[8px] border-[2px] border-black border-t-[3px]" />
                    <div className="absolute bottom-0 left-0 w-[8px] h-[8px] border-[2px] border-black border-t-[3px] bg-[#ECE9D8]" />
                  </div>
                ) : (
                  <div className="w-[10px] h-[10px] border-[2px] border-black border-t-[3px]" />
                )}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="w-[21px] h-[21px] bg-[#E81123] hover:bg-[#F25056] xp-window-btn flex items-center justify-center focus:outline-none ml-[2px] border border-white"
                title="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[1px_1px_0px_rgba(0,0,0,0.2)]">
                  <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="2.5" />
                </svg>
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
});