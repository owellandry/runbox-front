# Runboxjs Demo IDE Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the current DemoPage into a fully interactive Lite IDE (VSCode style) featuring a File Explorer, Multi-tab Editor, Live Preview, and Terminal.

**Architecture:** We will maintain the state of the workspace as a `Record<string, string>` in a single React component (`DemoPage.tsx`). We will implement CRUD operations on this object, synchronize it with `localStorage` for persistence, and layout the components using a 3-column split for the main workspace and a bottom panel for the terminal. We will use Lucide icons for the UI and standard textarea for the editor.

**Tech Stack:** React, Tailwind CSS, Lucide-react, runboxjs, framer-motion (optional for UI transitions).

---

### Task 1: Setup Workspace State & Persistence

**Goal**: Update the React state to support arbitrary files, initialize from `localStorage`, and auto-save changes. Add the Top Bar UI.

**Files:**
- Modify: `src/pages/DemoPage.tsx`

- [x] **Step 1: Define default template and persistence keys**

```typescript
const LOCAL_STORAGE_KEY = 'runbox_demo_workspace';

const defaultFiles: Record<string, string> = {
  '/package.json': \`{
  "name": "runbox-demo",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2"
  },
  "scripts": {
    "start": "bun run /index.js"
  }
}\`,
  '/index.js': \`const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Hello from Runboxjs IDE!</h1><p>Edit this file and click Run.</p>');
});

app.listen(port, () => {
  console.log(\\\`Server listening on port \\\${port}\\\`);
});\`
};
```

- [x] **Step 2: Update state hooks to use persistence**

```typescript
  // Replace current activeFile and files state with:
  const [files, setFiles] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultFiles;
      }
    }
    return defaultFiles;
  });
  
  const [activeFile, setActiveFile] = useState<string>('/index.js');
  
  // Effect to save to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(files));
  }, [files]);
```

- [x] **Step 3: Implement Reset Workspace function**

```typescript
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the workspace? All local changes will be lost.')) {
      setFiles(defaultFiles);
      setActiveFile('/index.js');
      setPreviewHtml('');
      setServerPort(null);
      setOutput(['$ Workspace reset to default template.']);
    }
  };
```

- [x] **Step 4: Update Top Bar UI**

Modify the `<header>` in `DemoPage.tsx` to include the Run and Reset buttons:

```tsx
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#15151a] p-4 rounded-2xl border border-anthropic-light-gray/10 shadow-lg">
          <div>
            <h1 className="text-2xl font-poppins font-medium tracking-tight">RunBox IDE</h1>
            <p className="text-sm font-lora text-anthropic-mid-gray">
              Local WebAssembly Node.js Environment
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="text-xs font-poppins text-anthropic-mid-gray hover:text-white transition-colors"
            >
              Reset Workspace
            </button>
            <div className="h-6 w-px bg-anthropic-light-gray/20"></div>
            <div className="flex items-center gap-2">
              <span className={\`w-2 h-2 rounded-full \${isReady ? 'bg-anthropic-green' : 'bg-anthropic-orange animate-pulse'}\`}></span>
              <span className="text-xs font-mono text-anthropic-mid-gray">{isReady ? 'Ready' : 'Booting...'}</span>
            </div>
            <button 
              onClick={handleRun}
              disabled={!isReady || isRunning}
              className="flex items-center gap-2 text-sm font-poppins font-medium text-anthropic-dark bg-anthropic-orange px-6 py-2 rounded-xl hover:bg-[#c76547] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(217,119,87,0.2)]"
            >
              <Play className="w-4 h-4" /> {isRunning ? 'Running...' : 'Run'}
            </button>
          </div>
        </header>
```

- [x] **Step 5: Test and Commit**
Verify the header renders correctly, reset button works, and files state defaults properly.
Run `git add src/pages/DemoPage.tsx` and `git commit -m "feat(demo): add workspace state persistence and IDE header"`

---

### Task 2: Implement File Explorer Sidebar

**Goal**: Create a left sidebar that lists all files in the state, allowing the user to select, create, rename, and delete files.

**Files:**
- Modify: `src/pages/DemoPage.tsx`

- [ ] **Step 1: Add state for new/rename inputs**

```typescript
  import { FileText, FolderPlus, FilePlus, Trash2, Edit2, ChevronRight, ChevronDown } from 'lucide-react';

  const [creatingFile, setCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');
```

- [ ] **Step 2: Add File CRUD handlers**

```typescript
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
      }
      setCreatingFile(false);
      setNewFileName('');
    } else if (e.key === 'Escape') {
      setCreatingFile(false);
      setNewFileName('');
    }
  };

  const handleDeleteFile = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(\`Delete \${path}?\`)) {
      const newFiles = { ...files };
      delete newFiles[path];
      setFiles(newFiles);
      if (activeFile === path) {
        const remaining = Object.keys(newFiles);
        setActiveFile(remaining.length > 0 ? remaining[0] : '');
      }
    }
  };

  const startRename = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingFile(path);
    setRenameInput(path.replace(/^\\//, ''));
  };

  const handleRenameFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && renamingFile) {
      let newPath = renameInput.trim();
      if (!newPath) {
        setRenamingFile(null);
        return;
      }
      if (!newPath.startsWith('/')) newPath = '/' + newPath;
      
      if (newPath !== renamingFile && !files[newPath]) {
        const newFiles = { ...files };
        newFiles[newPath] = newFiles[renamingFile];
        delete newFiles[renamingFile];
        setFiles(newFiles);
        if (activeFile === renamingFile) setActiveFile(newPath);
      }
      setRenamingFile(null);
    } else if (e.key === 'Escape') {
      setRenamingFile(null);
    }
  };
```

- [ ] **Step 3: Update Main Grid Layout and insert Sidebar**

Replace the current `<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">` with a 3-column grid and insert the Explorer.

```tsx
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
            
            {/* Explorer Sidebar (Span 2) */}
            <div className="lg:col-span-2 rounded-2xl border border-anthropic-light-gray/10 bg-[#15151a] flex flex-col overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-anthropic-light-gray/10">
                <span className="text-xs font-poppins font-medium text-anthropic-mid-gray uppercase tracking-wider">Explorer</span>
                <div className="flex gap-1">
                  <button onClick={() => setCreatingFile(true)} className="text-anthropic-mid-gray hover:text-white transition-colors">
                    <FilePlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {Object.keys(files).sort().map(path => (
                  <div key={path} className="group">
                    {renamingFile === path ? (
                      <div className="px-4 py-1.5 flex items-center">
                        <FileText className="w-3.5 h-3.5 text-anthropic-blue mr-2 shrink-0" />
                        <input
                          autoFocus
                          value={renameInput}
                          onChange={e => setRenameInput(e.target.value)}
                          onKeyDown={handleRenameFile}
                          onBlur={() => setRenamingFile(null)}
                          className="w-full bg-[#0d0d0c] text-xs font-mono text-white border border-anthropic-blue px-1 py-0.5 outline-none"
                        />
                      </div>
                    ) : (
                      <div 
                        onClick={() => setActiveFile(path)}
                        className={\`px-4 py-1.5 flex items-center cursor-pointer text-xs font-mono transition-colors \${activeFile === path ? 'bg-anthropic-blue/10 text-anthropic-light border-l-2 border-anthropic-blue' : 'text-anthropic-mid-gray hover:bg-white/5 border-l-2 border-transparent'}\`}
                      >
                        <FileText className={\`w-3.5 h-3.5 mr-2 shrink-0 \${activeFile === path ? 'text-anthropic-blue' : 'text-anthropic-mid-gray'}\`} />
                        <span className="truncate flex-1">{path.replace(/^\\//, '')}</span>
                        
                        <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-2">
                          <button onClick={(e) => startRename(path, e)} className="text-anthropic-mid-gray hover:text-white"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={(e) => handleDeleteFile(path, e)} className="text-anthropic-mid-gray hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {creatingFile && (
                  <div className="px-4 py-1.5 flex items-center">
                    <FileText className="w-3.5 h-3.5 text-anthropic-blue mr-2 shrink-0" />
                    <input
                      autoFocus
                      value={newFileName}
                      onChange={e => setNewFileName(e.target.value)}
                      onKeyDown={handleCreateFile}
                      onBlur={() => setCreatingFile(false)}
                      placeholder="filename.js"
                      className="w-full bg-[#0d0d0c] text-xs font-mono text-white border border-anthropic-blue px-1 py-0.5 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
```

- [ ] **Step 4: Test and Commit**
Test creating, renaming, deleting, and selecting files in the sidebar.
Run `git add src/pages/DemoPage.tsx` and `git commit -m "feat(demo): implement file explorer sidebar with CRUD operations"`

---

### Task 3: Update Editor and Preview Layout

**Goal**: Adjust the Editor and Preview components to fit into the new 12-column grid system (Span 5 each) and handle dynamic file tabs.

**Files:**
- Modify: `src/pages/DemoPage.tsx`

- [ ] **Step 1: Update Editor Panel (Span 5)**

```tsx
            {/* Editor (Span 5) */}
            <div className="lg:col-span-5 rounded-2xl border border-anthropic-light-gray/10 bg-[#1a1a19] overflow-hidden flex flex-col shadow-2xl">
              <div className="flex items-center bg-[#15151a] border-b border-anthropic-light-gray/10 overflow-x-auto no-scrollbar">
                {Object.keys(files).map(path => (
                  <button
                    key={path}
                    onClick={() => setActiveFile(path)}
                    className={\`px-4 py-3 text-xs font-mono transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap shrink-0 \${
                      activeFile === path
                        ? 'border-anthropic-orange text-anthropic-orange bg-[#1a1a19]'
                        : 'border-transparent text-anthropic-mid-gray hover:text-anthropic-light-gray hover:bg-white/5'
                    }\`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {path.replace(/^\\//, '')}
                  </button>
                ))}
              </div>

              <div className="flex-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-12 bg-[#0f0f14] border-r border-anthropic-light-gray/10 pt-6 pointer-events-none text-right pr-3 h-full overflow-hidden">
                  <div className="text-xs text-anthropic-mid-gray/40 font-mono leading-relaxed">
                    {activeFile && files[activeFile] ? files[activeFile].split('\\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    )) : <div>1</div>}
                  </div>
                </div>
                {activeFile && files[activeFile] !== undefined ? (
                  <textarea
                    value={files[activeFile]}
                    onChange={(e) => setFiles({ ...files, [activeFile]: e.target.value })}
                    spellCheck="false"
                    className="w-full h-full pl-14 pr-6 pt-6 pb-6 font-mono text-sm text-anthropic-light-gray bg-transparent resize-none focus:outline-none focus:ring-0 leading-relaxed no-scrollbar"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-anthropic-mid-gray font-mono text-sm">
                    Select or create a file to edit
                  </div>
                )}
              </div>
            </div>
```

- [ ] **Step 2: Update Live Preview Panel (Span 5)**

```tsx
            {/* Live Preview (Span 5) */}
            <div className="lg:col-span-5 rounded-2xl border border-anthropic-light-gray/10 bg-white overflow-hidden flex flex-col shadow-2xl">
              <div className="flex items-center px-3 py-2 border-b border-gray-200 bg-gray-100 gap-2">
                <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-md px-2 py-1 gap-1">
                  <span className="text-xs text-gray-400 font-mono shrink-0">localhost:{serverPort || '3000'}</span>
                  <input
                    type="text"
                    value={browserUrl}
                    onChange={e => setBrowserUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleNavigate(browserUrl)}
                    disabled={!serverPort}
                    className="flex-1 text-xs font-mono text-gray-700 focus:outline-none min-w-0 disabled:bg-transparent"
                  />
                </div>
                <button
                  onClick={() => handleNavigate(browserUrl)}
                  disabled={!serverPort}
                  className="text-xs bg-anthropic-orange text-white px-2 py-1 rounded font-mono shrink-0 disabled:opacity-50"
                >
                  Go
                </button>
              </div>
              <div className="flex-1 overflow-y-auto text-black">
                {serverPort ? (
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                    onLoad={e => {
                      const iframe = e.currentTarget;
                      try {
                        iframe.contentDocument?.querySelectorAll('a[href]').forEach(a => {
                          (a as HTMLAnchorElement).addEventListener('click', ev => {
                            ev.preventDefault();
                            const href = (a as HTMLAnchorElement).getAttribute('href') || '/';
                            handleNavigate(href);
                          });
                        });
                      } catch (_) {}
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400 font-poppins text-sm text-center p-6">
                    <div>
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="mb-2 text-gray-600">No server running</p>
                      <p className="text-xs">Click "Run" to execute your code. If it starts an HTTP server, the preview will appear here.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
```

- [ ] **Step 3: Test and Commit**
Verify Editor tabs match state files. Verify Preview panel layout.
Run `git add src/pages/DemoPage.tsx` and `git commit -m "style(demo): update editor and preview panels to fit new 3-column IDE layout"`

---

### Task 4: Fix Execution Flow (handleRun)

**Goal**: Update the `handleRun` function to iterate over all files in the state, write them to VFS, create directories if needed, and execute cleanly.

**Files:**
- Modify: `src/pages/DemoPage.tsx`

- [ ] **Step 1: Update `handleRun` logic**

Replace the existing file writing block in `handleRun` with:

```typescript
      // Write all files from state to VFS
      for (const [path, content] of Object.entries(files)) {
        // Create parent directories if needed
        const dir = path.substring(0, path.lastIndexOf('/'));
        if (dir && dir !== '') {
           runbox.exec(\`mkdir -p \${dir}\`);
        }
        
        const bytes = new TextEncoder().encode(content);
        runbox.write_file(path, bytes);
      }
```

- [ ] **Step 2: Adjust Execution Command**

Make sure it attempts to run the start script if package.json exists, otherwise fallback to `bun run /index.js`.

```typescript
      let cmdToRun = 'bun run /index.js';
      
      // Basic detection if they have a package.json start script
      if (files['/package.json']) {
         try {
           const pkg = JSON.parse(files['/package.json']);
           if (pkg.scripts && pkg.scripts.start) {
             cmdToRun = 'npm run start';
           }
         } catch(e) {}
      }

      setOutput(prev => [...prev, '']);
      setOutput(prev => [...prev, \`$ \${cmdToRun}\`]);

      const execResult = JSON.parse(runbox.exec(cmdToRun));
```

- [ ] **Step 3: Test and Commit**
Verify that adding a file in the explorer, running it, and checking the terminal works perfectly.
Run `git add src/pages/DemoPage.tsx` and `git commit -m "fix(demo): sync entire workspace state to vfs before execution"`

---

### Task 5: Final Polish

**Goal**: Ensure Terminal panel sits at the bottom and has correct styling. Clean up any unused imports.

**Files:**
- Modify: `src/pages/DemoPage.tsx`

- [ ] **Step 1: Update Terminal Panel layout**

```tsx
          {/* Terminal / Output (Full Width Bottom) */}
          <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#0d0d0c] overflow-hidden flex flex-col shadow-2xl h-[250px]">
            <div className="flex items-center justify-between px-6 py-3 border-b border-anthropic-light-gray/10 bg-[#1e1e1d]">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-anthropic-mid-gray" />
                <span className="text-xs font-mono text-anthropic-mid-gray uppercase tracking-wider">Terminal</span>
              </div>
              <button 
                onClick={() => setOutput(['$ Terminal cleared.'])}
                className="text-xs font-mono text-anthropic-mid-gray hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            <div
              ref={terminalDivRef}
              onScroll={handleTerminalScroll}
              className="flex-1 p-6 font-mono text-sm text-anthropic-light-gray overflow-y-auto no-scrollbar"
            >
              {output.map((line, i) => (
                <p key={i} className={\`mb-1.5 \${line.startsWith('$') ? 'text-anthropic-mid-gray' : line.includes('[ERROR]') || line.startsWith('Error:') ? 'text-red-400' : 'text-anthropic-green/90'}\`}>
                  {line}
                </p>
              ))}
              <p className="mt-4"><span className="animate-pulse text-anthropic-orange">_</span></p>
              <div ref={outputEndRef} />
            </div>
          </div>
```

- [ ] **Step 2: Clean up imports and unused code**
Remove unused imports, especially `Code` and `Package` if no longer strictly needed in the hardcoded tabs.
Ensure `lucide-react` imports cover all used icons (`FileText, FolderPlus, FilePlus, Trash2, Edit2, Play, TerminalIcon, Globe`).

- [ ] **Step 3: Test and Commit**
Verify full layout responsiveness and aesthetics.
Run `git add src/pages/DemoPage.tsx` and `git commit -m "style(demo): finalize IDE terminal panel and polish UI details"`