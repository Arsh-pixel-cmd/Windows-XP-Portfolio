// src/components/LogViewer.tsx
import React, { useState } from 'react';
import { SystemState } from '../core/types';
import { Search, Filter, Terminal as LogIcon, AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface LogViewerProps {
  systemState: SystemState;
}

export const LogViewer: React.FC<LogViewerProps> = ({ systemState }) => {
  const [filter, setFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [search, setSearch] = useState('');

  const filteredLogs = systemState.logs.filter(log => {
    const matchesFilter = filter === 'ALL' || log.level === filter;
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) || 
                         log.meta?.eventType?.toLowerCase().includes(search.toLowerCase()) ||
                         log.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] font-tahoma text-xs">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-2 bg-white border-b border-gray-300 shadow-sm">
        <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 px-2 py-1 rounded">
          <Search size={14} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="bg-transparent outline-none w-40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-500" />
          <select 
            className="bg-white border border-gray-300 px-1 py-0.5 outline-none rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">Info</option>
            <option value="WARN">Warning</option>
            <option value="ERROR">Error</option>
          </select>
        </div>
        
        <div className="ml-auto text-gray-500 font-bold">
          {filteredLogs.length} Entries
        </div>
      </div>

      {/* Log List */}
      <div className="flex-1 overflow-auto p-1 bg-white">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-100 border-b border-gray-300 text-left">
            <tr>
              <th className="p-1 border-r border-gray-300 w-16">Time</th>
              <th className="p-1 border-r border-gray-300 w-16">Level</th>
              <th className="p-1 border-r border-gray-300">Message</th>
              <th className="p-1 w-32">Event ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="p-1 text-gray-500 border-r border-gray-100">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="p-1 border-r border-gray-100">
                  <span className={`flex items-center gap-1 font-bold ${
                    log.level === 'ERROR' ? 'text-red-600' : 
                    log.level === 'WARN' ? 'text-orange-600' : 'text-blue-600'
                  }`}>
                    {log.level === 'ERROR' && <AlertCircle size={12} />}
                    {log.level === 'WARN' && <AlertTriangle size={12} />}
                    {log.level === 'INFO' && <Info size={12} />}
                    {log.level}
                  </span>
                </td>
                <td className="p-1 border-r border-gray-100">
                  <div className="font-medium">{log.message}</div>
                  {log.meta && (
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {log.meta.eventType && `[${log.meta.eventType}] `}
                      {log.meta.path && `path: ${log.meta.path} `}
                      {log.meta.pid && `pid: ${log.meta.pid} `}
                      {log.meta.parentEventId && `ref: ${log.meta.parentEventId}`}
                    </div>
                  )}
                </td>
                <td className="p-1 text-gray-400 font-mono text-[10px]">
                  {log.id.split('-').slice(-1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Status Bar */}
      <div className="p-1 bg-[#ebe9ed] border-t border-gray-300 text-[10px] text-gray-600 flex justify-between">
        <div>System Version: {systemState.version}</div>
        <div>Tick: {systemState.tick}</div>
      </div>
    </div>
  );
};
