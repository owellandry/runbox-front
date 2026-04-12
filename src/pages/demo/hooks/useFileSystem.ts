import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEY, defaultFiles } from '../constants/defaultFiles';

export function useFileSystem() {
  const [files, setFiles] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultFiles;
    } catch { return defaultFiles; }
  });
  
  const [activeFile, setActiveFile] = useState<string>('/index.js');
  const [creatingFile, setCreatingFile] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  const handleCreateFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let path = newFileName.trim();
      if (!path) {
        setCreatingFile(false);
        return;
      }
      if (!path.startsWith('/')) path = '/' + path;
      
      if (!files[path]) {
        setFiles(prev => ({ ...prev, [path]: '' }));
        setActiveFile(path);
        
        const parentDir = path.substring(0, path.lastIndexOf('/'));
        if (parentDir) {
          setExpandedFolders(prev => ({ ...prev, [parentDir]: true }));
        }
      }
      setCreatingFile(false);
      setNewFileName('');
    } else if (e.key === 'Escape') {
      setCreatingFile(false);
      setNewFileName('');
    }
  };

  const handleCreateFolder = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let path = newFolderName.trim();
      if (!path) {
        setCreatingFolder(false);
        return;
      }
      if (!path.startsWith('/')) path = '/' + path;
      if (!path.endsWith('/')) path = path + '/';
      
      if (!files[path]) {
        setFiles(prev => ({ ...prev, [path]: '' }));
        const parentDir = path.substring(0, path.lastIndexOf('/', path.length - 2));
        if (parentDir) {
          setExpandedFolders(prev => ({ ...prev, [parentDir]: true }));
        }
      }
      setCreatingFolder(false);
      setNewFolderName('');
    } else if (e.key === 'Escape') {
      setCreatingFolder(false);
      setNewFolderName('');
    }
  };

  const handleDeleteFile = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ${path}?`)) return;
    const newFiles = { ...files };
    
    if (path.endsWith('/')) {
      Object.keys(newFiles).forEach(key => {
        if (key.startsWith(path)) {
          delete newFiles[key];
          if (activeFile === key) setActiveFile('');
        }
      });
    } else {
      delete newFiles[path];
      if (activeFile === path) setActiveFile('');
    }
    
    setFiles(newFiles);
    if (activeFile === path || path.endsWith('/')) {
      const remaining = Object.keys(newFiles).filter(k => !k.endsWith('/'));
      if (activeFile === '' || path.endsWith('/')) {
        setActiveFile(remaining.length > 0 ? remaining[0] : '');
      }
    }
  };

  const startRename = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingFile(path);
    setRenameInput(path.replace(/^\//, '').replace(/\/$/, ''));
  };

  const handleRenameFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && renamingFile) {
      let newPath = renameInput.trim();
      if (!newPath) {
        setRenamingFile(null);
        return;
      }
      if (!newPath.startsWith('/')) newPath = '/' + newPath;
      
      const isFolder = renamingFile.endsWith('/');
      if (isFolder && !newPath.endsWith('/')) newPath += '/';
      
      if (newPath !== renamingFile) {
        const newFiles = { ...files };
        
        if (isFolder) {
          Object.keys(newFiles).forEach(key => {
            if (key.startsWith(renamingFile)) {
              const newChildPath = newPath + key.substring(renamingFile.length);
              newFiles[newChildPath] = newFiles[key];
              delete newFiles[key];
              if (activeFile === key) setActiveFile(newChildPath);
            }
          });
          
          setExpandedFolders(prev => {
            const next = { ...prev };
            if (next[renamingFile.slice(0, -1)]) {
              next[newPath.slice(0, -1)] = true;
              delete next[renamingFile.slice(0, -1)];
            }
            return next;
          });
        } else {
          if (!newFiles[newPath]) {
            newFiles[newPath] = newFiles[renamingFile];
            delete newFiles[renamingFile];
            if (activeFile === renamingFile) setActiveFile(newPath);
          }
        }
        
        setFiles(newFiles);
      }
      setRenamingFile(null);
    } else if (e.key === 'Escape') {
      setRenamingFile(null);
    }
  };

  const toggleFolder = (folderPath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  const handleReset = () => {
    if (!window.confirm('Reset the workspace? All local changes will be lost.')) return;
    setFiles(defaultFiles); 
    setActiveFile('/index.js');
  };

  // Helper to build a file tree from flat paths
  const getFileTree = () => {
    const tree: any = {};
    Object.keys(files).forEach(path => {
      const parts = path.split('/').filter(Boolean);
      let current = tree;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const isFolder = isLast && path.endsWith('/');
        
        if (!current[part]) {
          current[part] = isLast && !isFolder ? { __isFile: true, path } : {};
        }
        current = current[part];
      }
    });
    return tree;
  };

  return {
    files,
    setFiles,
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
    setExpandedFolders,
    handleCreateFile,
    handleCreateFolder,
    handleDeleteFile,
    startRename,
    handleRenameFile,
    toggleFolder,
    handleReset,
    getFileTree
  };
}
