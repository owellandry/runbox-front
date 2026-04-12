import React from 'react';
import { Folder, Puzzle, Settings } from 'lucide-react';

export const ActivityBar: React.FC = () => {
  return (
    <div className="w-12 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col items-center py-4 gap-6">
      <button className="text-[#faf9f5] relative">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#d97757] rounded-r-full" />
        <Folder className="w-5 h-5" />
      </button>
      <button className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors"><Puzzle className="w-5 h-5" /></button>
      <button className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors mt-auto"><Settings className="w-5 h-5" /></button>
    </div>
  );
};
