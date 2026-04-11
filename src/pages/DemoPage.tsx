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

  const defaultCode = `echo '<h1>Hello from Runboxjs!</h1><p>WebAssembly Sandbox Demo</p>'`;

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
    setOutput(prev => [...prev, `$ ${code}`]);
    setUserScrolledUp(false); // Reset scroll position when running

    try {
      // Execute the command
      const resultJson = runbox.exec(code);
      const result = JSON.parse(resultJson);

      // Check if execution was successful
      if (result.exit_code !== 0) {
        // Show error output
        if (result.stderr) {
          setOutput(prev => [...prev, `❌ ${result.stderr.trim()}`]);
        }
        setIsRunning(false);
        return;
      }

      // Show successful output
      if (result.stdout) {
        setOutput(prev => [...prev, result.stdout.trim()]);
      }

      // Extract HTML from the output (everything in quotes after echo)
      const match = code.match(/echo\s+['"`]?([\s\S]*?)['"`]?$/);
      const htmlToRender = match ? match[1] : result.stdout || '<p>Command executed</p>';

      // Simulate the HTTP request for the demo visual
      setTimeout(() => {
        setOutput(prev => [...prev, '$ curl http://localhost:3000']);
        setTimeout(() => {
          setOutput(prev => [...prev, 'Response: 200 OK']);
          setPreviewHtml(htmlToRender);
          setIsRunning(false);
        }, 800);
      }, 1000);

    } catch (err: any) {
      setOutput(prev => [...prev, `❌ Execution Error: ${err.message}`]);
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col gap-12">
        <header className="flex flex-col gap-4 text-center items-center">
          <h1 className="text-4xl md:text-6xl font-poppins font-medium tracking-tight">RunBox Interactive Demo</h1>
          <p className="text-xl font-lora text-anthropic-mid-gray leading-relaxed max-w-2xl">
            Execute shell commands in the browser using RunBox WebAssembly sandbox. Try: <code className="text-anthropic-orange">echo &apos;&lt;h1&gt;Hello&lt;/h1&gt;&apos;</code>, <code className="text-anthropic-orange">ls</code>, or <code className="text-anthropic-orange">cat filename</code>
          </p>
        </header>

        <div className="flex flex-col gap-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor */}
            <div className="rounded-3xl border border-anthropic-light-gray/10 bg-[#1a1a19] overflow-hidden flex flex-col shadow-2xl h-[400px]">
              <div className="flex items-center px-6 py-4 border-b border-anthropic-light-gray/10 bg-[#1e1e1d] justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-anthropic-mid-gray">runbox command</span>
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
                  placeholder="Try: echo '<h1>Hello</h1>' or ls or cat filename"
                  className="w-full h-full p-6 font-mono text-sm text-anthropic-light-gray bg-transparent resize-none focus:outline-none focus:ring-0 leading-relaxed no-scrollbar placeholder:text-anthropic-mid-gray/50"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="rounded-3xl border border-anthropic-light-gray/10 bg-white overflow-hidden flex flex-col shadow-2xl h-[400px]">
              <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50 gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-mono text-gray-500">http://localhost:3000/</span>
              </div>
              <div className="flex-1 p-6 text-black overflow-y-auto">
                {previewHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 font-poppins text-sm">
                    Click "Run" to see the preview
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terminal / Output */}
          <div className="rounded-3xl border border-anthropic-light-gray/10 bg-[#0d0d0c] overflow-hidden flex flex-col shadow-2xl h-[250px]">
            <div className="flex items-center px-6 py-4 border-b border-anthropic-light-gray/10 bg-[#1e1e1d] gap-2">
              <TerminalIcon className="w-4 h-4 text-anthropic-mid-gray" />
              <span className="text-xs font-mono text-anthropic-mid-gray">Terminal Output</span>
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