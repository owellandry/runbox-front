# Runboxjs Demo Page IDE Redesign Spec

## 1. Overview

The goal is to redesign the `DemoPage` in the Runboxjs landing page to function as a "Lite IDE" (VSCode in the cloud). The new design will allow users to experience the full power of the Runbox WebAssembly module by interacting with a complete virtual workspace.

## 2. Architecture & Layout

The DemoPage will adopt a professional IDE layout divided into distinct sections:

- **Top Bar**:
  - Global actions: "Run" button, environment status indicator (Ready, Running, Error), and a "Reset Workspace" option.
- **Main Workspace (3-column split)**:
  - **Left Sidebar (File Explorer)**: A file tree view showing all files in the virtual filesystem.
  - **Center Panel (Editor)**: A textarea-based code editor with file tabs.
  - **Right Panel (Live Preview)**: A mini-browser window that renders HTTP responses when a server is spawned.
- **Bottom Panel (Terminal)**:
  - Full-width terminal output pane displaying standard output, standard error, and system messages.

## 3. Core Features

### 3.1. File Explorer (CRUD)
- **State**: The workspace state will be maintained as a flat object of `Record<string, string>` where keys are absolute file paths (e.g., `/src/index.js`) and values are file contents.
- **Actions**:
  - **Create**: Add new files to the workspace state.
  - **Rename**: Change the key of an existing file in the state.
  - **Delete**: Remove a file from the state.
  - **Select**: Clicking a file opens it in the Center Panel editor.

### 3.2. Editor (Textarea Pro)
- Built using a styled `<textarea>` for simplicity and performance, avoiding the heavy payload of Monaco in the landing page.
- Will feature decorative line numbers synchronized with the textarea scroll.
- Supports multiple open file tabs, allowing the user to switch between files like `package.json` and `index.js`.
- Synchronizes edits instantly to the React state.

### 3.3. Persistence
- The entire workspace state (`Record<string, string>`) will be persisted to `localStorage` under a specific key (e.g., `runbox_demo_workspace`).
- On initial load, the app will attempt to restore the workspace from `localStorage`. If empty, it will fall back to a default template (Express.js server).
- The "Reset Workspace" button will clear `localStorage` and restore the default template.

### 3.4. Execution Flow
- When "Run" is clicked:
  1. The UI iterates over the entire workspace state and writes every file to the Runbox Virtual Filesystem (`runbox.write_file`).
  2. Creates any necessary parent directories via `runbox.exec('mkdir -p ...')`.
  3. Executes `npm install` if `package.json` has changed, fetching and extracting tarballs via `npm_process_tarball`.
  4. Executes the main command (`bun run /index.js`).
  5. Monitors stdout for a port binding (e.g., `localhost:3000`). If detected, activates the Live Preview panel.

### 3.5. Live Preview & Terminal
- **Live Preview**: Maintains its current functionality of injecting a script to intercept navigation (`<a>` clicks) and routing them through `runbox.http_handle_request`.
- **Terminal**: Maintains its current functionality of auto-scrolling and displaying colored logs.

## 4. UI/UX Details

- **Theme**: Anthropic Dark theme (consistent with the rest of the landing page).
- **Icons**: Lucide-react icons for files, folders, and actions.
- **Responsiveness**:
  - On desktop (`lg:`): 3-column layout.
  - On mobile/tablet: Stacks vertically (Explorer -> Editor -> Preview -> Terminal) or uses a tabbed interface for the main panels to save space.

## 5. Technical Constraints
- Do not introduce Monaco Editor or heavy dependencies. Stick to React state and native DOM elements for the editor.
- Keep the `RunboxInstance` initialization exactly as it is (WebAssembly bundler target).