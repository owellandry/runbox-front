# Runboxjs Demo IDE Redesign Plan

**Goal:** Redesign the DemoPage to match the provided "Codient" VSCode-like UI, adhering to Anthropic brand guidelines. The layout will switch between "Code" and "Preview" modes, hide the terminal by default, and feature a leftmost activity bar.

**Architecture & Layout:**
- **Full Screen Container:** Dark theme (`#141413`) with full viewport height (`h-screen`).
- **Top Bar:** 
  - Left: Logo / Title ("RunBox IDE").
  - Center: View Toggles (`Preview` | `Code`).
  - Right: `Terminal` toggle button, `Reset` button, Status, `Run` button.
- **Body (Flex Row):**
  - **Activity Bar (Leftmost):** Narrow vertical strip with icons (Explorer, GitHub, Settings).
  - **Sidebar (Explorer):** Fixed width, showing the file tree.
  - **Main Content Area (Flex Col):**
    - **Dynamic Content:**
      - If `Code` view: Shows File Tabs + Editor.
      - If `Preview` view: Shows Browser Address Bar + Iframe.
    - **Terminal Panel (Bottom):** Rendered conditionally if `showTerminal` is true. Splits the main content area vertically.

**Tech Stack:** React, Tailwind CSS, Lucide-react.

---

### Task 1: Update State and Top Bar Layout

**Files:**
- Modify: `src/pages/DemoPage.tsx`

- [ ] **Step 1: Add new state variables**
Add state for the active view (`'code' | 'preview'`) and terminal visibility (`showTerminal`).

```typescript
  const [activeView, setActiveView] = useState<'code' | 'preview'>('code');
  const [showTerminal, setShowTerminal] = useState(false);
```

- [ ] **Step 2: Restructure the Outer Layout and Top Bar**
Update the main wrapper to a flex column, and the Top Bar to include the View Toggles in the center. Use Anthropic brand colors (e.g., `#141413`, `#d97757` for orange).

```tsx
    <div className="h-screen w-full bg-[#141413] text-[#faf9f5] flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-4 py-3 border-b border-[#b0aea5]/10 shrink-0 bg-[#141413]">
        <div className="flex items-center gap-2 w-1/3">
          <Box className="w-5 h-5 text-[#d97757]" />
          <h1 className="text-lg font-poppins font-medium tracking-tight">RunBox IDE</h1>
        </div>
        
        <div className="flex items-center justify-center w-1/3">
          <div className="flex bg-[#1e1e1d] p-1 rounded-full border border-[#b0aea5]/10">
            <button
              onClick={() => setActiveView('preview')}
              className={\`px-4 py-1 text-xs font-poppins rounded-full transition-colors \${activeView === 'preview' ? 'bg-[#6a9bcc] text-[#141413] font-medium' : 'text-[#b0aea5] hover:text-[#faf9f5]'}\`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveView('code')}
              className={\`px-4 py-1 text-xs font-poppins rounded-full transition-colors \${activeView === 'code' ? 'bg-[#6a9bcc] text-[#141413] font-medium' : 'text-[#b0aea5] hover:text-[#faf9f5]'}\`}
            >
              Code
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 w-1/3">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={\`text-xs font-poppins flex items-center gap-1 transition-colors \${showTerminal ? 'text-[#faf9f5]' : 'text-[#b0aea5] hover:text-[#faf9f5]'}\`}
          >
            <TerminalIcon className="w-4 h-4" />
            Terminal
          </button>
          <button
            onClick={handleReset}
            className="text-xs font-poppins text-[#b0aea5] hover:text-[#faf9f5] transition-colors"
          >
            Reset
          </button>
          <div className="h-4 w-px bg-[#b0aea5]/20"></div>
          <div className="flex items-center gap-2">
            <span className={\`w-2 h-2 rounded-full \${isReady ? 'bg-[#788c5d]' : 'bg-[#d97757] animate-pulse'}\`}></span>
          </div>
          <button 
            onClick={handleRun}
            disabled={!isReady || isRunning}
            className="flex items-center gap-1.5 text-xs font-poppins font-medium text-[#141413] bg-[#d97757] px-4 py-1.5 rounded-full hover:bg-[#c76547] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3 h-3 fill-current" /> {isRunning ? 'Running' : 'Run'}
          </button>
        </div>
      </header>
```

### Task 2: Implement the Body Layout (Activity Bar & Explorer)

**Files:**
- Modify: `src/pages/DemoPage.tsx`

- [ ] **Step 1: Setup Flex Body and Activity Bar**
Below the header, add a `flex-1 flex min-h-0` container. Include a narrow leftmost Activity Bar.

```tsx
      {/* Main Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden bg-[#0a0a09]">
        {/* Activity Bar */}
        <div className="w-12 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col items-center py-4 gap-6">
          <button className="text-[#faf9f5] relative">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#d97757] rounded-r-full"></div>
            <Folder className="w-5 h-5" />
          </button>
          <button className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors">
            <Puzzle className="w-5 h-5" />
          </button>
          <button className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors mt-auto">
            <Settings className="w-5 h-5" />
          </button>
        </div>
```
*(Note: Import `Folder`, `Puzzle`, `Settings` from `lucide-react`)*

- [ ] **Step 2: Style the Explorer Sidebar**
Adapt the existing Explorer to fit seamlessly next to the Activity Bar without large gaps or rounded borders.

```tsx
        {/* Explorer Sidebar */}
        <div className="w-64 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-poppins font-medium text-[#faf9f5]">Explorer</span>
            <div className="flex gap-2">
              <button onClick={() => setCreatingFile(true)} className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors">
                <FilePlus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
             {/* Keep existing Explorer mapping logic here, update colors to #b0aea5 and #6a9bcc for active/hover states */}
             {/* Replace text-anthropic-light-gray with text-[#faf9f5], text-anthropic-mid-gray with text-[#b0aea5], etc. */}
             {Object.keys(files).sort().map(path => (
               // ... existing mapping with updated hex colors ...
             ))}
          </div>
        </div>
```

### Task 3: Implement Main Content Area (Code / Preview / Terminal)

**Files:**
- Modify: `src/pages/DemoPage.tsx`

- [ ] **Step 1: Container for Main Area**
Wrap the dynamic content and terminal in a flex-col container.

```tsx
        {/* Main Area (Editor/Preview + Terminal) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a09]">
```

- [ ] **Step 2: Dynamic Content (Code vs Preview)**

```tsx
          {/* Dynamic Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {activeView === 'code' ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* File Tabs */}
                <div className="flex items-center bg-[#141413] overflow-x-auto no-scrollbar">
                  {Object.keys(files).map(path => (
                    <button
                      key={path}
                      onClick={() => setActiveFile(path)}
                      className={\`px-4 py-2.5 text-xs font-mono transition-colors flex items-center gap-2 whitespace-nowrap border-r border-[#b0aea5]/10 \${
                        activeFile === path
                          ? 'bg-[#0a0a09] text-[#6a9bcc] border-t-2 border-t-[#6a9bcc]'
                          : 'bg-[#141413] text-[#b0aea5] hover:bg-[#1e1e1d] border-t-2 border-t-transparent'
                      }\`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {path.replace(/^\\//, '')}
                    </button>
                  ))}
                </div>
                {/* Textarea Editor */}
                <div className="flex-1 relative overflow-hidden bg-[#0a0a09]">
                  {/* Keep existing textarea logic, update colors */}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                {/* Address Bar */}
                <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 gap-2 shrink-0">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center flex-1 bg-white border border-gray-200 rounded px-2 py-1 gap-1">
                    <span className="text-xs text-gray-400 font-mono">localhost:{serverPort || '3000'}</span>
                    {/* ... existing input ... */}
                  </div>
                  {/* ... existing Go button ... */}
                </div>
                {/* Iframe */}
                <div className="flex-1 overflow-y-auto text-black">
                  {/* Keep existing iframe logic */}
                </div>
              </div>
            )}
          </div>
```

- [ ] **Step 3: Conditional Terminal**

```tsx
          {/* Terminal */}
          {showTerminal && (
            <div className="h-1/3 shrink-0 border-t border-[#b0aea5]/10 bg-[#141413] flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#b0aea5]/10 bg-[#1e1e1d]">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-[#b0aea5]" />
                  <span className="text-xs font-mono text-[#b0aea5] uppercase tracking-wider">Terminal</span>
                </div>
                <button 
                  onClick={() => setOutput(['$ Terminal cleared.'])}
                  className="text-xs font-mono text-[#b0aea5] hover:text-[#faf9f5]"
                >
                  Clear
                </button>
              </div>
              <div
                ref={terminalDivRef}
                onScroll={handleTerminalScroll}
                className="flex-1 p-4 font-mono text-xs text-[#e8e6dc] overflow-y-auto no-scrollbar"
              >
                {/* Keep existing output mapping, update colors to Anthropic brand */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
```

### Task 4: Auto-Switch to Preview on Run

**Files:**
- Modify: `src/pages/DemoPage.tsx`

- [ ] **Step 1: Automatically show preview when server is ready**
In the `handleRun` function, when a server port is detected, switch `activeView` to `'preview'` automatically to provide immediate feedback.

```typescript
      // Detectar si hay un servidor HTTP corriendo
      const serverMatch = execResult.stdout?.match(/localhost:(\d+)/);
      if (serverMatch) {
        const port = parseInt(serverMatch[1], 10);
        setServerPort(port);
        setBrowserUrl('/');
        // Primera request al servidor
        const response = JSON.parse(runbox.http_handle_request(JSON.stringify({
          port, method: 'GET', path: '/', headers: {}, body: null
        })));
        setPreviewHtml(injectNavScript(response.body || ''));
        setOutput(prev => [...prev, \`✓ Server ready — navigate using the browser above\`]);
        
        // Auto-switch to preview
        setActiveView('preview');
      } else {
        // Auto-switch to terminal if no server to show output
        setShowTerminal(true);
        setPreviewHtml('<div style="padding: 20px; text-align: center; color: #666;"><p>Check the terminal output</p></div>');
      }
```

### Task 5: Remove Old Wrapping and Padding

**Files:**
- Modify: `src/pages/DemoPage.tsx`

- [ ] **Step 1: Clean up outer divs**
Ensure the outermost `return` uses the new `h-screen w-full bg-[#141413]` structure. Remove any remnants of the old `max-w-7xl` or `rounded-3xl` gaps that broke the full-bleed IDE look. Import the newly required icons (`Folder`, `Puzzle`, `Settings`).

- [ ] **Step 2: Commit**
`git add src/pages/DemoPage.tsx`
`git commit -m "feat(demo): implement full-bleed IDE layout with code/preview toggles and anthropic branding"`
