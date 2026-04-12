import React from 'react';
import { Folder, Layout, Library, Layers } from 'lucide-react';

interface FolderIconProps {
  folderName: string;
  isExpanded: boolean;
  className?: string;
}

export const FolderIconComponent = ({ folderName, isExpanded, className }: FolderIconProps) => {
  const name = folderName.toLowerCase();
  
  if (name === 'components') return <Layout className={className} />;
  if (name === 'lib' || name === 'utils') return <Library className={className} />;
  if (name === 'pages' || name === 'views') return <Layers className={className} />;
  
  return <Folder className={className} />;
};
