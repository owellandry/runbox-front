import React from 'react';
import { Folder, LayoutTemplate, Settings } from 'lucide-react';

interface ActivityBarProps {
  activeSidebar: 'explorer' | 'templates';
  setActiveSidebar: (sidebar: 'explorer' | 'templates') => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({ activeSidebar, setActiveSidebar }) => {
  return (
    <div className="w-12 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col items-center py-4 gap-6">
      <button 
        onClick={() => setActiveSidebar('explorer')}
        className={`relative transition-colors cursor-pointer ${activeSidebar === 'explorer' ? 'text-[#faf9f5]' : 'text-[#b0aea5] hover:text-[#faf9f5]'}`}
      >
        {activeSidebar === 'explorer' && <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#d97757] rounded-r-full" />}
        <Folder className="w-5 h-5" fill={activeSidebar === 'explorer' ? "currentColor" : "none"} fillOpacity={0.2} />
      </button>
      <button 
        onClick={() => setActiveSidebar('templates')}
        className={`relative transition-colors cursor-pointer ${activeSidebar === 'templates' ? 'text-[#faf9f5]' : 'text-[#b0aea5] hover:text-[#faf9f5]'}`}
      >
        {activeSidebar === 'templates' && <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#d97757] rounded-r-full" />}
        <LayoutTemplate className="w-5 h-5" />
      </button>
      <button className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors mt-auto cursor-pointer"><Settings className="w-5 h-5" /></button>
    </div>
  );
};
