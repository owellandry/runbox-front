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
          <p className="font-lora text-anthropic-mid-gray">Install the core package using your preferred package manager:</p>
          <pre className="p-6 rounded-xl bg-[#1a1a19] border border-anthropic-light-gray/10 font-mono text-sm overflow-x-auto">
            <code className="text-anthropic-light-gray">npm install @runboxjs/core</code>
          </pre>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-poppins font-medium border-b border-anthropic-light-gray/10 pb-4">Basic Usage</h2>
          <p className="font-lora text-anthropic-mid-gray">Initialize a Runbox instance and run a simple command:</p>
          <pre className="p-6 rounded-xl bg-[#1a1a19] border border-anthropic-light-gray/10 font-mono text-sm overflow-x-auto">
            <code className="text-anthropic-orange">import</code> {'{'} Runbox {'}'} <code className="text-anthropic-orange">from</code> <code className="text-anthropic-green">'@runboxjs/core'</code>;
            <br/><br/>
            <code className="text-anthropic-blue">const</code> runbox = <code className="text-anthropic-orange">await</code> Runbox.<code className="text-anthropic-blue">boot</code>();<br/>
            <code className="text-anthropic-blue">const</code> result = <code className="text-anthropic-orange">await</code> runbox.<code className="text-anthropic-blue">exec</code>(<code className="text-anthropic-green">'node -v'</code>);<br/><br/>
            console.<code className="text-anthropic-blue">log</code>(result.stdout); <span className="text-anthropic-mid-gray/50">// v18.16.0</span>
          </pre>
        </section>
      </div>
    </div>
  );
};

export default DocsPage;