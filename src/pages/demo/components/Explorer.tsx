import React from 'react';
import { FilePlus, FolderPlus, FileText, Folder, ChevronRight, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { FileIcon } from './FileIcon';
import { FolderIconComponent } from './FolderIcon';

interface ExplorerProps {
  files: Record<string, string>;
  activeFile: string;
  setActiveFile: (path: string) => void;
  creatingFile: boolean;
  setCreatingFile: (val: boolean) => void;
  creatingFolder: boolean;
  setCreatingFolder: (val: boolean) => void;
  newFileName: string;
  setNewFileName: (val: string) => void;
  newFolderName: string;
  setNewFolderName: (val: string) => void;
  renamingFile: string | null;
  setRenamingFile: (val: string | null) => void;
  renameInput: string;
  setRenameInput: (val: string) => void;
  expandedFolders: Record<string, boolean>;
  handleCreateFile: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCreateFolder: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleDeleteFile: (path: string, e: React.MouseEvent) => void;
  startRename: (path: string, e: React.MouseEvent) => void;
  handleRenameFile: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  toggleFolder: (folderPath: string, e: React.MouseEvent) => void;
  getFileTree: () => any;
}

export const Explorer: React.FC<ExplorerProps> = ({
  files,
  activeFile,
  setActiveFile,
  creatingFile,
  setCreatingFile,
  creatingFolder,
  setCreatingFolder,
  newFileName,
  setNewFileName,
  newFolderName,
  setNewFolderName,
  renamingFile,
  setRenamingFile,
  renameInput,
  setRenameInput,
  expandedFolders,
  handleCreateFile,
  handleCreateFolder,
  handleDeleteFile,
  startRename,
  handleRenameFile,
  toggleFolder,
  getFileTree
}) => {

  const renderFileTree = (node: any, currentPath: string = '', level: number = 0) => {
    return Object.keys(node).sort((a, b) => {
      const aIsFile = node[a].__isFile;
      const bIsFile = node[b].__isFile;
      if (aIsFile && !bIsFile) return 1;
      if (!aIsFile && bIsFile) return -1;
      return a.localeCompare(b);
    }).map(key => {
      if (key === '__isFile') return null;
      
      const child = node[key];
      const isFile = child.__isFile;
      const fullPath = isFile ? child.path : `${currentPath}/${key}`;
      const folderKey = isFile ? null : fullPath;
      const isExpanded = folderKey ? expandedFolders[folderKey] : false;
      const isRenaming = renamingFile === fullPath || renamingFile === `${fullPath}/`;

      return (
        <div key={fullPath} className="w-full">
          <div className="group">
            {isRenaming ? (
              <div className="flex items-center w-full py-1.5" style={{ paddingLeft: `${level * 12 + 16}px` }}>
                {isFile ? (
                  <FileIcon path={key} className="w-3.5 h-3.5 text-[#6a9bcc] mr-2 shrink-0" />
                ) : (
                  <FolderIconComponent folderName={key} isExpanded={isExpanded} className="w-3.5 h-3.5 text-[#d97757] mr-2 shrink-0" />
                )}
                <input
                  autoFocus
                  value={renameInput}
                  onChange={e => setRenameInput(e.target.value)}
                  onKeyDown={handleRenameFile}
                  onBlur={() => setRenamingFile(null)}
                  className="w-full bg-[#0a0a09] text-xs font-mono text-[#faf9f5] border border-[#6a9bcc] px-1 py-0.5 outline-none"
                />
              </div>
            ) : (
              <div 
                onClick={(e) => isFile ? setActiveFile(fullPath) : toggleFolder(folderKey!, e)}
                className={`flex items-center w-full py-1.5 cursor-pointer text-xs font-mono transition-colors ${
                  activeFile === fullPath 
                    ? 'bg-[#0a0a09] text-[#faf9f5] border-l-2 border-[#6a9bcc]' 
                    : 'text-[#b0aea5] hover:bg-[#b0aea5]/5 border-l-2 border-transparent'
                }`}
                style={{ paddingLeft: `${level * 12 + 16}px` }}
              >
                {isFile ? (
                  <FileIcon path={key} className={`w-3.5 h-3.5 mr-2 shrink-0 ${activeFile === fullPath ? 'text-[#6a9bcc]' : 'text-[#b0aea5]'}`} />
                ) : (
                  <FolderIconComponent folderName={key} isExpanded={isExpanded} className={`w-3.5 h-3.5 mr-2 shrink-0 ${isExpanded ? 'text-[#d97757]' : 'text-[#b0aea5]'}`} />
                )}
                
                <span className="truncate flex-1 text-left">{key}</span>
                
                {!isFile && (
                  <span className="shrink-0 text-[#b0aea5] mr-2">
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </span>
                )}
                
                <div className="hidden group-hover:flex items-center gap-1 shrink-0 pr-2">
                  <button onClick={(e) => startRename(isFile ? fullPath : `${fullPath}/`, e)} className="text-[#b0aea5] hover:text-[#faf9f5]">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button onClick={(e) => handleDeleteFile(isFile ? fullPath : `${fullPath}/`, e)} className="text-[#b0aea5] hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {!isFile && isExpanded && (
            <div className="w-full">
              {renderFileTree(child, fullPath, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-64 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs font-poppins font-medium text-[#faf9f5]">Explorer</span>
        <div className="flex gap-2">
          <button onClick={() => setCreatingFile(true)} className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors cursor-pointer" title="New File">
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setCreatingFolder(true)} className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors cursor-pointer" title="New Folder">
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {renderFileTree(getFileTree())}
        
        {creatingFile && (
          <div className="px-4 py-1.5 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[#6a9bcc] shrink-0" />
            <input
              autoFocus
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              onKeyDown={handleCreateFile}
              onBlur={() => setCreatingFile(false)}
              placeholder="filename.js"
              className="w-full bg-[#0a0a09] text-xs font-mono text-[#faf9f5] border border-[#6a9bcc] px-1 py-0.5 outline-none"
            />
          </div>
        )}

        {creatingFolder && (
          <div className="px-4 py-1.5 flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 text-[#d97757] shrink-0" />
            <input
              autoFocus
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={handleCreateFolder}
              onBlur={() => setCreatingFolder(false)}
              placeholder="folder_name"
              className="w-full bg-[#0a0a09] text-xs font-mono text-[#faf9f5] border border-[#d97757] px-1 py-0.5 outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
