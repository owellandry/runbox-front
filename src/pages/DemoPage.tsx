import React from 'react';
import { Play, Terminal as TerminalIcon } from 'lucide-react';

const DemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col gap-12">
        <header className="flex flex-col gap-4 text-center items-center">
          <h1 className="text-4xl md:text-6xl font-poppins font-medium tracking-tight">Interactive Demo</h1>
          <p className="text-xl font-lora text-anthropic-mid-gray leading-relaxed max-w-2xl">
            Experience Runboxjs directly in your browser. This is a live instance of Node.js running entirely on the client side.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Fake Editor */}
          <div className="rounded-3xl border border-anthropic-light-gray/10 bg-[#1a1a19] overflow-hidden flex flex-col shadow-2xl h-[500px]">
            <div className="flex items-center px-6 py-4 border-b border-anthropic-light-gray/10 bg-[#1e1e1d] justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-anthropic-mid-gray">index.js</span>
              </div>
              <button className="flex items-center gap-2 text-xs font-poppins font-medium text-anthropic-dark bg-anthropic-orange px-4 py-1.5 rounded-full hover:bg-[#c76547] transition-colors">
                <Play className="w-3 h-3" /> Run
              </button>
            </div>
            <div className="flex-1 p-6 font-mono text-sm text-anthropic-light-gray overflow-y-auto">
              <span className="text-anthropic-blue">const</span> express = <span className="text-anthropic-orange">require</span>(<span className="text-anthropic-green">'express'</span>);<br/>
              <span className="text-anthropic-blue">const</span> app = express();<br/>
              <span className="text-anthropic-blue">const</span> port = <span className="text-anthropic-orange">3000</span>;<br/><br/>
              app.get(<span className="text-anthropic-green">'/'</span>, (req, res) {'=>'} {'{'}<br/>
              &nbsp;&nbsp;res.send(<span className="text-anthropic-green">'Hello from Runboxjs Interactive Demo!'</span>);<br/>
              {'}'});<br/><br/>
              app.listen(port, () {'=>'} {'{'}<br/>
              &nbsp;&nbsp;console.log(<span className="text-anthropic-green">`Example app listening on port ${'{'}port{'}'}`</span>);<br/>
              {'}'});
            </div>
          </div>

          {/* Fake Terminal / Output */}
          <div className="rounded-3xl border border-anthropic-light-gray/10 bg-[#0d0d0c] overflow-hidden flex flex-col shadow-2xl h-[500px]">
            <div className="flex items-center px-6 py-4 border-b border-anthropic-light-gray/10 bg-[#1e1e1d] gap-2">
              <TerminalIcon className="w-4 h-4 text-anthropic-mid-gray" />
              <span className="text-xs font-mono text-anthropic-mid-gray">Terminal Output</span>
            </div>
            <div className="flex-1 p-6 font-mono text-sm text-anthropic-light-gray overflow-y-auto">
              <p className="text-anthropic-mid-gray">$ node index.js</p>
              <p className="text-anthropic-green mt-2">Example app listening on port 3000</p>
              <p className="text-anthropic-mid-gray mt-4">$ curl http://localhost:3000</p>
              <p className="text-anthropic-light mt-2">Hello from Runboxjs Interactive Demo!</p>
              <p className="mt-4"><span className="animate-pulse text-anthropic-orange">_</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;