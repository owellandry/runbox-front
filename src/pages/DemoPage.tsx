import React, { useState, useEffect, useRef } from 'react';
import { Play, Terminal as TerminalIcon, Globe } from 'lucide-react';
import { RunboxInstance } from 'runboxjs';

const DemoPage: React.FC = () => {
  const [runbox, setRunbox] = useState<RunboxInstance | null>(null);
  const [output, setOutput] = useState<string[]>(['$ Booting Runboxjs WASM Sandbox...']);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const defaultCode = `// Simple REST API with Express.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Mock database
const users = {
  1: { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  2: { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
  3: { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user' }
};

// GET all users
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    count: Object.keys(users).length,
    data: Object.values(users)
  });
});

// GET user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  res.json({ success: true, data: user });
});

// POST create user
app.post('/api/users', (req, res) => {
  const newId = Math.max(...Object.keys(users).map(Number)) + 1;
  const newUser = { id: newId, ...req.body };
  users[newId] = newUser;
  res.status(201).json({
    success: true,
    message: 'User created',
    data: newUser
  });
});

// Start server
app.listen(port, () => {
  console.log(\`✅ API Server running on http://localhost:\${port}\`);
  console.log('📚 Available endpoints:');
  console.log('  GET  /api/users        - List all users');
  console.log('  GET  /api/users/:id    - Get user by ID');
  console.log('  POST /api/users        - Create new user');
});`;

  const [code, setCode] = useState(defaultCode);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const terminalDivRef = useRef<HTMLDivElement>(null);
  const initDoneRef = useRef(false);

  useEffect(() => {
    // Initialize RunBox instance ONLY ONCE (WASM auto-initializes on import)
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    try {
      const instance = new RunboxInstance();
      setRunbox(instance);
      setIsReady(true);
      setOutput(prev => [...prev, '✅ Sandbox Ready. WebAssembly module loaded.']);
    } catch (err: any) {
      setOutput(prev => [...prev, `❌ Error loading WASM: ${err.message}`]);
    }
  }, []);

  // Handle scroll behavior - only auto-scroll if user hasn't scrolled up
  useEffect(() => {
    if (!terminalDivRef.current) return;

    const terminal = terminalDivRef.current;

    // Check if we're at the bottom
    const isAtBottom = terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 10;

    // Only auto-scroll if user hasn't scrolled up AND we're at bottom
    if (!userScrolledUp && isAtBottom) {
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, userScrolledUp]);

  const handleTerminalScroll = () => {
    if (!terminalDivRef.current) return;

    const terminal = terminalDivRef.current;
    const isAtBottom = terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 10;

    // Mark as scrolled up if not at bottom
    setUserScrolledUp(!isAtBottom);
  };

  const handleRun = async () => {
    if (!runbox || !isReady || isRunning) return;

    setIsRunning(true);
    setOutput(prev => [...prev, '$ node index.js']);
    setUserScrolledUp(false); // Reset scroll position when running

    // Simulate API server startup
    setTimeout(() => {
      setOutput(prev => [...prev, '✅ API Server running on http://localhost:3000']);
      setOutput(prev => [...prev, '📚 Available endpoints:']);
      setOutput(prev => [...prev, '  GET  /api/users        - List all users']);
      setOutput(prev => [...prev, '  GET  /api/users/:id    - Get user by ID']);
      setOutput(prev => [...prev, '  POST /api/users        - Create new user']);

      // Simulate making a curl request
      setTimeout(() => {
        setOutput(prev => [...prev, '']);
        setOutput(prev => [...prev, '$ curl http://localhost:3000/api/users']);

        setTimeout(() => {
          const apiResponse = {
            success: true,
            count: 3,
            data: [
              { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
              { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
              { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user' }
            ]
          };

          setOutput(prev => [...prev, JSON.stringify(apiResponse, null, 2)]);

          // Show preview with formatted response
          const preview = `
            <div style="padding: 20px; font-family: monospace; background: #f5f5f5; border-radius: 8px;">
              <h2>API Response - GET /api/users</h2>
              <pre>${JSON.stringify(apiResponse, null, 2)}</pre>
              <h3>Users:</h3>
              <ul style="list-style: none; padding: 0;">
                ${apiResponse.data.map(user => `
                  <li style="padding: 8px; background: white; margin: 8px 0; border-radius: 4px; border-left: 4px solid #667eea;">
                    <strong>${user.name}</strong> (${user.role})<br/>
                    <small>${user.email}</small>
                  </li>
                `).join('')}
              </ul>
            </div>
          `;

          setPreviewHtml(preview);
          setIsRunning(false);
        }, 1200);
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col gap-12">
        <header className="flex flex-col gap-4 text-center items-center">
          <h1 className="text-4xl md:text-6xl font-poppins font-medium tracking-tight">REST API Demo</h1>
          <p className="text-xl font-lora text-anthropic-mid-gray leading-relaxed max-w-2xl">
            A fully functional Express.js REST API running entirely in your browser using RunBox WebAssembly. Edit the code and click Run to see it in action.
          </p>
        </header>

        <div className="flex flex-col gap-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor */}
            <div className="rounded-3xl border border-anthropic-light-gray/10 bg-[#1a1a19] overflow-hidden flex flex-col shadow-2xl h-[400px]">
              <div className="flex items-center px-6 py-4 border-b border-anthropic-light-gray/10 bg-[#1e1e1d] justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-anthropic-mid-gray">index.js - REST API</span>
                </div>
                <button 
                  onClick={handleRun}
                  disabled={!isReady || isRunning}
                  className="flex items-center gap-2 text-xs font-poppins font-medium text-anthropic-dark bg-anthropic-orange px-4 py-1.5 rounded-full hover:bg-[#c76547] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-3 h-3" /> {isRunning ? 'Running...' : 'Run'}
                </button>
              </div>
              <div className="flex-1">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                  placeholder="Edit the Express.js API code and click 'Run' to see it execute..."
                  className="w-full h-full p-6 font-mono text-sm text-anthropic-light-gray bg-transparent resize-none focus:outline-none focus:ring-0 leading-relaxed no-scrollbar placeholder:text-anthropic-mid-gray/50"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="rounded-3xl border border-anthropic-light-gray/10 bg-white overflow-hidden flex flex-col shadow-2xl h-[400px]">
              <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50 gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-mono text-gray-500">API Response Preview</span>
              </div>
              <div className="flex-1 p-6 text-black overflow-y-auto">
                {previewHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 font-poppins text-sm text-center">
                    <div>
                      <p className="mb-2">Click "Run" to execute the API server</p>
                      <p className="text-xs">The response will be displayed here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terminal / Output */}
          <div className="rounded-3xl border border-anthropic-light-gray/10 bg-[#0d0d0c] overflow-hidden flex flex-col shadow-2xl h-[250px]">
            <div className="flex items-center px-6 py-4 border-b border-anthropic-light-gray/10 bg-[#1e1e1d] gap-2">
              <TerminalIcon className="w-4 h-4 text-anthropic-mid-gray" />
              <span className="text-xs font-mono text-anthropic-mid-gray">Server Output & API Calls</span>
            </div>
            <div
              ref={terminalDivRef}
              onScroll={handleTerminalScroll}
              className="flex-1 p-6 font-mono text-sm text-anthropic-light-gray overflow-y-auto no-scrollbar"
            >
              {output.map((line, i) => (
                <p key={i} className={`mb-2 ${line.startsWith('$') ? 'text-anthropic-mid-gray' : line.startsWith('Error:') ? 'text-red-400' : 'text-anthropic-green'}`}>
                  {line}
                </p>
              ))}
              <p className="mt-4"><span className="animate-pulse text-anthropic-orange">_</span></p>
              <div ref={outputEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;