import React from 'react';
import { Terminal, Zap, FileText } from 'lucide-react';

const DocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-6xl font-poppins font-medium tracking-tight">Documentation</h1>
          <p className="text-xl font-lora text-anthropic-mid-gray leading-relaxed">
            Everything you need to know about integrating Runboxjs into your platform.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#1a1a19] border border-anthropic-light-gray/10 flex flex-col gap-4 hover:border-anthropic-orange/50 transition-colors cursor-pointer">
            <Zap className="w-8 h-8 text-anthropic-orange" />
            <h3 className="text-xl font-poppins font-medium">Quick Start</h3>
            <p className="text-anthropic-mid-gray font-lora text-sm">Get up and running in less than 5 minutes.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#1a1a19] border border-anthropic-light-gray/10 flex flex-col gap-4 hover:border-anthropic-blue/50 transition-colors cursor-pointer">
            <Terminal className="w-8 h-8 text-anthropic-blue" />
            <h3 className="text-xl font-poppins font-medium">API Reference</h3>
            <p className="text-anthropic-mid-gray font-lora text-sm">Detailed documentation of the Runboxjs API.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#1a1a19] border border-anthropic-light-gray/10 flex flex-col gap-4 hover:border-anthropic-green/50 transition-colors cursor-pointer">
            <FileText className="w-8 h-8 text-anthropic-green" />
            <h3 className="text-xl font-poppins font-medium">Guides</h3>
            <p className="text-anthropic-mid-gray font-lora text-sm">Step-by-step tutorials for common use cases.</p>
          </div>
        </div>

        <section className="mt-8 flex flex-col gap-6">
          <h2 className="text-2xl font-poppins font-medium border-b border-anthropic-light-gray/10 pb-4">Installation</h2>
          <p className="font-lora text-anthropic-mid-gray">Install the package using your preferred package manager:</p>
          <pre className="p-6 rounded-xl bg-[#1a1a19] border border-anthropic-light-gray/10 font-mono text-sm overflow-x-auto no-scrollbar selection:bg-anthropic-light-gray/20">
            <code className="text-anthropic-light-gray">npm install runboxjs</code>
          </pre>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-poppins font-medium border-b border-anthropic-light-gray/10 pb-4">Quick Start</h2>
          <p className="font-lora text-anthropic-mid-gray">Create a RunboxInstance, write files, and execute commands. The WebAssembly module initializes automatically on import:</p>
          <pre className="p-6 rounded-xl bg-[#1a1a19] border border-anthropic-light-gray/10 font-mono text-sm overflow-x-auto no-scrollbar selection:bg-anthropic-light-gray/20">
<code className="text-anthropic-orange">import</code> {'{'} RunboxInstance {'}'} <code className="text-anthropic-orange">from</code> <code className="text-anthropic-green">'runboxjs'</code>;
<br/><br/>
<span className="text-anthropic-mid-gray/50">// 1. Create a RunBox isolated sandbox</span><br/>
<code className="text-anthropic-blue">const</code> runbox = <code className="text-anthropic-orange">new</code> <code className="text-anthropic-blue">RunboxInstance</code>();
<br/><br/>
<span className="text-anthropic-mid-gray/50">// 2. Write a file using the Virtual Filesystem</span><br/>
<code className="text-anthropic-blue">const</code> fileContent = <code className="text-anthropic-orange">new</code> <code className="text-anthropic-blue">TextEncoder</code>().<code className="text-anthropic-blue">encode</code>(<code className="text-anthropic-green">'console.log("Hello from WASM!");'</code>);<br/>
runbox.<code className="text-anthropic-blue">write_file</code>(<code className="text-anthropic-green">'/app.js'</code>, fileContent);
<br/><br/>
<span className="text-anthropic-mid-gray/50">// 3. Execute a command synchronously</span><br/>
<code className="text-anthropic-blue">const</code> result = runbox.<code className="text-anthropic-blue">exec</code>(<code className="text-anthropic-green">'node /app.js'</code>);<br/>
<code className="text-anthropic-blue">const</code> output = JSON.<code className="text-anthropic-blue">parse</code>(result);
<br/><br/>
console.<code className="text-anthropic-blue">log</code>(output.stdout); <span className="text-anthropic-mid-gray/50">// "Hello from WASM!\n"</span>
          </pre>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-poppins font-medium border-b border-anthropic-light-gray/10 pb-4">Advanced: Interactive Terminal</h2>
          <p className="font-lora text-anthropic-mid-gray">Runboxjs provides full terminal emulation capabilities. You can send inputs exactly as if a user was typing in an xterm.js instance:</p>
          <pre className="p-6 rounded-xl bg-[#1a1a19] border border-anthropic-light-gray/10 font-mono text-sm overflow-x-auto no-scrollbar selection:bg-anthropic-light-gray/20">
<span className="text-anthropic-mid-gray/50">// Simulate user typing "ls -la" and pressing Enter</span><br/>
runbox.<code className="text-anthropic-blue">terminal_input</code>(<code className="text-anthropic-green">'l'</code>);<br/>
runbox.<code className="text-anthropic-blue">terminal_input</code>(<code className="text-anthropic-green">'s'</code>);<br/>
runbox.<code className="text-anthropic-blue">terminal_input</code>(<code className="text-anthropic-green">' -la'</code>);<br/>
runbox.<code className="text-anthropic-blue">terminal_input</code>(<code className="text-anthropic-green">'\r'</code>); <span className="text-anthropic-mid-gray/50">// Execute</span><br/>
<br/>
<span className="text-anthropic-mid-gray/50">// Drain the terminal output buffer (call this in requestAnimationFrame)</span><br/>
<code className="text-anthropic-blue">const</code> json = runbox.<code className="text-anthropic-blue">terminal_drain</code>();<br/>
<code className="text-anthropic-blue">const</code> chunks = JSON.<code className="text-anthropic-blue">parse</code>(json);<br/>
chunks.<code className="text-anthropic-blue">forEach</code>(chunk {'=>'} {'{'}<br/>
&nbsp;&nbsp;console.<code className="text-anthropic-blue">log</code>(chunk.data);<br/>
{'}'});
          </pre>
        </section>
      </div>
    </div>
  );
};

export default DocsPage;