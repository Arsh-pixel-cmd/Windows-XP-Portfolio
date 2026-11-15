// src/components/FileExplorer.tsx
import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, ArrowUp, Folder, FileText, 
  HardDrive, Monitor, Search, Grid, List, Trash2, 
  Plus, CornerDownRight, Cpu
} from 'lucide-react';
import { Process, SystemState, FileNode } from '../core/types';
import { resolvePath, listDirectory } from '../core/vfs';
import { systemBus } from '../core/eventBus';
import { soundEffects } from '../core/soundEffects';

interface FileExplorerProps {
  process: Process;
  systemState: SystemState;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ process, systemState }) => {
  const initialPath = (typeof process.params?.initialPath === 'string' && process.params.initialPath)
    ? process.params.initialPath
    : 'C:/Users/Arsh';

  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'icons' | 'details' | 'list'>('icons');
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');

  // Get current node and children
  let currentNode: FileNode | null = null;
  let items: FileNode[] = [];
  try {
    currentNode = resolvePath(systemState.fileSystem, currentPath);
    if (currentNode.type === 'directory') {
      items = listDirectory(systemState.fileSystem, currentPath);
    }
  } catch {
    // Fallback if path doesn't exist
    items = [];
  }

  const navigateTo = (path: string) => {
    soundEffects.playClick();
    setCurrentPath(path);
    setSelectedNode(null);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), path]);
    setHistoryIndex(prev => prev + 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      soundEffects.playClick();
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(prev);
      setSelectedNode(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      soundEffects.playClick();
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(next);
      setSelectedNode(null);
    }
  };

  const handleUp = () => {
    if (currentPath === 'C:' || currentPath === 'C:/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const parent = parts.join('/') || 'C:';
    navigateTo(parent);
  };

  const handleItemClick = (node: FileNode) => {
    setSelectedNode(node);
  };

  const handleItemDoubleClick = (node: FileNode) => {
    if (node.type === 'directory') {
      const nextPath = currentPath.endsWith('/') ? `${currentPath}${node.name}` : `${currentPath}/${node.name}`;
      navigateTo(nextPath);
    } else {
      soundEffects.playClick();
      // Handle file opening
      const fullFilePath = `${currentPath}/${node.name}`;
      if (node.name.endsWith('.txt')) {
        systemBus.emit({
          type: 'PROC_START',
          payload: {
            appType: 'notepad',
            title: node.name,
            params: { filePath: fullFilePath }
          }
        });
      } else if (node.name.endsWith('.exe')) {
        const appType = node.name.replace('.exe', '').toLowerCase();
        systemBus.emit({
          type: 'PROC_START',
          payload: {
            appType,
            title: node.name
          }
        });
      }
    }
  };

  const handleCreateNewFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const targetPath = `${currentPath}/${newItemName.trim()}`;
    systemBus.emit({
      type: 'FS_CREATE_DIR',
      payload: { path: targetPath }
    });
    setNewItemName('');
    setIsCreatingFolder(false);
    soundEffects.playClick();
  };

  const handleDeleteSelected = () => {
    if (!selectedNode) return;
    soundEffects.playRecycle();
    const targetPath = `${currentPath}/${selectedNode.name}`;
    systemBus.emit({
      type: 'FS_DELETE',
      payload: { path: targetPath }
    });
    setSelectedNode(null);
  };

  return (
    <div className="h-full bg-white flex flex-col font-tahoma text-xs select-none overflow-hidden">
      {/* Menu Bar */}
      <div className="bg-[#ECE9D8] border-b border-gray-400 px-2 py-0.5 flex gap-4 text-gray-800">
        <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">File</span>
        <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Edit</span>
        <span className="hover:bg-[#316AC5] hover:text-white cursor-default px-1">View</span>
        <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Favorites</span>
        <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Tools</span>
        <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Help</span>
      </div>

      {/* Navigation Toolbar */}
      <div className="bg-[#ECE9D8] border-b border-gray-300 p-1 flex items-center gap-1">
        <button
          onClick={handleBack}
          disabled={historyIndex === 0}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60 active:bg-black/10 disabled:opacity-40"
          title="Back"
        >
          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white shadow-sm">
            <ArrowLeft size={12} />
          </div>
          <span className="font-bold">Back</span>
        </button>

        <button
          onClick={handleForward}
          disabled={historyIndex >= history.length - 1}
          className="p-1 rounded hover:bg-white/60 active:bg-black/10 disabled:opacity-40"
          title="Forward"
        >
          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white shadow-sm">
            <ArrowRight size={12} />
          </div>
        </button>

        <button
          onClick={handleUp}
          disabled={currentPath === 'C:' || currentPath === 'C:/'}
          className="p-1 rounded hover:bg-white/60 active:bg-black/10 disabled:opacity-40"
          title="Up"
        >
          <ArrowUp size={16} className="text-yellow-600" />
        </button>

        <div className="h-5 w-[1px] bg-gray-400 mx-1" />

        <button
          onClick={() => navigateTo('C:/Users/Arsh/Documents')}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60"
        >
          <Search size={15} className="text-[#0058EE]" />
          <span>Search</span>
        </button>

        <button
          onClick={() => setIsCreatingFolder(true)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60"
        >
          <Plus size={15} className="text-green-700" />
          <span>New Folder</span>
        </button>

        {selectedNode && (
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-red-50 text-red-700 font-semibold"
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        )}

        <div className="h-5 w-[1px] bg-gray-400 mx-1" />

        <div className="flex gap-0.5 ml-auto">
          <button
            onClick={() => setViewMode('icons')}
            className={`p-1 rounded ${viewMode === 'icons' ? 'bg-white border border-gray-400 shadow-inner' : 'hover:bg-white/60'}`}
            title="Icons"
          >
            <Grid size={14} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1 rounded ${viewMode === 'list' ? 'bg-white border border-gray-400 shadow-inner' : 'hover:bg-white/60'}`}
            title="List"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Address Bar */}
      <div className="bg-[#ECE9D8] border-b border-gray-400 px-2 py-1 flex items-center gap-2">
        <span className="text-gray-500 font-semibold">Address</span>
        <div className="flex-1 bg-white border border-gray-400 px-2 py-0.5 flex items-center gap-2 shadow-inner">
          <Folder size={14} className="text-yellow-600 shrink-0" />
          <input
            type="text"
            value={currentPath}
            onChange={e => setCurrentPath(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') navigateTo(currentPath);
            }}
            className="w-full bg-transparent border-none outline-none text-xs font-tahoma"
          />
        </div>
        <button
          onClick={() => navigateTo(currentPath)}
          className="xp-button px-3 py-0.5 flex items-center gap-1 text-green-700 font-bold"
        >
          <CornerDownRight size={12} />
          <span>Go</span>
        </button>
      </div>

      {/* Main Body with Sidebar + File View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Common Tasks Sidebar */}
        <div className="w-[190px] bg-gradient-to-b from-[#7A96DF] to-[#6080CE] p-2 flex flex-col gap-2.5 overflow-auto text-xs shrink-0">
          {/* File and Folder Tasks */}
          <div className="bg-white rounded-t-sm overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-[#215AC8] to-[#4684E8] text-white font-bold p-1.5 flex items-center justify-between text-[11px]">
              <span>System Tasks</span>
            </div>
            <div className="p-2 space-y-1.5 text-[11px] text-[#0C327D]">
              <div 
                onClick={() => setIsCreatingFolder(true)} 
                className="hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={12} className="text-green-600" />
                <span>Make a new folder</span>
              </div>
              <div 
                onClick={() => navigateTo('C:/Users/Arsh/Documents')}
                className="hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <FileText size={12} className="text-blue-600" />
                <span>View documents</span>
              </div>
            </div>
          </div>

          {/* Other Places */}
          <div className="bg-white rounded-t-sm overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-[#215AC8] to-[#4684E8] text-white font-bold p-1.5 flex items-center justify-between text-[11px]">
              <span>Other Places</span>
            </div>
            <div className="p-2 space-y-1.5 text-[11px] text-[#0C327D]">
              <div 
                onClick={() => navigateTo('C:')} 
                className="hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <HardDrive size={13} className="text-gray-600" />
                <span>Local Disk (C:)</span>
              </div>
              <div 
                onClick={() => navigateTo('C:/Users/Arsh/Desktop')} 
                className="hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <Monitor size={13} className="text-blue-500" />
                <span>Desktop</span>
              </div>
              <div 
                onClick={() => navigateTo('C:/Users/Arsh/Documents')} 
                className="hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <Folder size={13} className="text-yellow-600" />
                <span>My Documents</span>
              </div>
            </div>
          </div>

          {/* Details Pane */}
          {selectedNode && (
            <div className="bg-white rounded-t-sm overflow-hidden shadow-sm mt-auto">
              <div className="bg-gradient-to-r from-[#215AC8] to-[#4684E8] text-white font-bold p-1.5 text-[11px]">
                <span>Details</span>
              </div>
              <div className="p-2 text-[11px] text-gray-700 space-y-1">
                <p className="font-bold truncate">{selectedNode.name}</p>
                <p className="text-gray-500 capitalize">{selectedNode.type}</p>
                {selectedNode.type === 'file' && (
                  <p className="text-gray-500">{selectedNode.content ? `${selectedNode.content.length} bytes` : '0 bytes'}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Files Area */}
        <div className="flex-1 bg-white p-4 overflow-auto" onClick={() => setSelectedNode(null)}>
          {/* New folder inline prompt */}
          {isCreatingFolder && (
            <form onSubmit={handleCreateNewFolder} className="mb-4 p-2 bg-blue-50 border border-blue-300 rounded flex gap-2 items-center">
              <Folder size={16} className="text-yellow-500 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Folder name..."
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="border border-gray-400 p-1 text-xs bg-white rounded-sm flex-1"
              />
              <button type="submit" className="xp-button px-3 py-1 font-bold text-green-700">
                Create
              </button>
              <button type="button" onClick={() => setIsCreatingFolder(false)} className="xp-button px-2 py-1">
                Cancel
              </button>
            </form>
          )}

          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
              <span>This folder is empty.</span>
            </div>
          ) : viewMode === 'icons' ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
              {items.map(item => {
                const isSelected = selectedNode?.name === item.name;
                return (
                  <div
                    key={item.name}
                    onClick={e => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    onDoubleClick={e => {
                      e.stopPropagation();
                      handleItemDoubleClick(item);
                    }}
                    className={`flex flex-col items-center p-2 rounded cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#316AC5] text-white' : 'hover:bg-blue-50 text-gray-800'
                    }`}
                  >
                    {item.type === 'directory' ? (
                      <Folder size={38} className={isSelected ? 'text-white' : 'text-yellow-500 drop-shadow-sm'} />
                    ) : item.name.endsWith('.exe') ? (
                      <Cpu size={36} className={isSelected ? 'text-white' : 'text-blue-600 drop-shadow-sm'} />
                    ) : (
                      <FileText size={36} className={isSelected ? 'text-white' : 'text-gray-500 drop-shadow-sm'} />
                    )}
                    <span className="text-[11px] text-center mt-1 break-all line-clamp-2 leading-tight">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {items.map(item => {
                const isSelected = selectedNode?.name === item.name;
                return (
                  <div
                    key={item.name}
                    onClick={e => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    onDoubleClick={e => {
                      e.stopPropagation();
                      handleItemDoubleClick(item);
                    }}
                    className={`flex items-center gap-3 p-1 rounded cursor-pointer ${
                      isSelected ? 'bg-[#316AC5] text-white' : 'hover:bg-blue-50 text-gray-800'
                    }`}
                  >
                    {item.type === 'directory' ? (
                      <Folder size={16} className={isSelected ? 'text-white' : 'text-yellow-500'} />
                    ) : (
                      <FileText size={16} className={isSelected ? 'text-white' : 'text-gray-500'} />
                    )}
                    <span className="flex-1 truncate">{item.name}</span>
                    <span className="text-gray-400 capitalize">{item.type}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#ECE9D8] border-t border-gray-400 px-3 py-1 flex justify-between text-gray-600 text-[11px]">
        <span>{items.length} objects ({selectedNode ? `1 selected (${selectedNode.name})` : 'none selected'})</span>
        <span>Local Intranet • Free Space: 48.2 GB</span>
      </div>
    </div>
  );
};
