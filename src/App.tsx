import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Box, Zap, Globe, ArrowRight } from 'lucide-react';
import HeroBackground from './HeroBackground';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

export default function App() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 selection:text-white font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-md bg-anthropic-dark/40 border-b border-anthropic-light-gray/10">
        <div className="flex items-center gap-2 text-xl font-poppins font-medium tracking-tight text-anthropic-light">
          <Box className="w-5 h-5 text-anthropic-orange" />
          <span>Runboxjs</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-poppins font-medium text-anthropic-light-gray">
          <a href="#" className="hover:text-anthropic-light transition-colors">Documentation</a>
          <a href="#" className="hover:text-anthropic-light transition-colors">Enterprise</a>
          <a href="#" className="flex items-center gap-2 hover:text-anthropic-light transition-colors">
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 overflow-hidden bg-[#141413]">
        <HeroBackground />
        
        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 max-w-4xl mt-12"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] leading-[0.85] font-poppins font-medium tracking-tighter mb-8 text-anthropic-light"
          >
            Runboxjs.
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl backdrop-blur-sm bg-anthropic-dark/30 p-6 rounded-3xl border border-anthropic-light-gray/10"
          >
            <p className="text-xl md:text-2xl text-anthropic-light-gray/90 font-lora font-light mb-10 leading-snug">
              Run Node.js directly in the browser. Instant environments, zero setup. Boot a full-stack app inside the browser with native performance.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <a href="#" className="flex items-center gap-2 bg-anthropic-light text-anthropic-dark px-8 py-4 rounded-full font-poppins font-medium hover:bg-anthropic-light-gray transition-colors shadow-[0_0_40px_rgba(217,119,87,0.15)]">
                Get Started <ArrowRight className="w-4 h-4" />
              </a>
              <code className="text-sm font-mono text-anthropic-light-gray px-5 py-4 rounded-xl bg-anthropic-dark/50 border border-anthropic-light-gray/10 shadow-inner">
                npm install @runboxjs/core
              </code>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Visual Anchor - Terminal Simulation */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[800px] h-[500px] hidden lg:block z-10"
        >
          <div className="w-full h-full rounded-2xl border border-anthropic-light-gray/10 bg-anthropic-dark/70 backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="h-12 border-b border-anthropic-light-gray/10 flex items-center px-4 gap-2 bg-anthropic-dark/50">
              <div className="w-3 h-3 rounded-full bg-anthropic-orange" />
              <div className="w-3 h-3 rounded-full bg-anthropic-blue" />
              <div className="w-3 h-3 rounded-full bg-anthropic-green" />
            </div>
            <div className="p-6 font-mono text-sm text-anthropic-green/90 flex flex-col gap-2">
              <p><span className="text-anthropic-blue">~/project</span> $ npx create-runboxjs-app</p>
              <p className="text-anthropic-light-gray/70">Booting environment...</p>
              <p className="text-anthropic-light-gray/70">Starting Node.js v18.16.0</p>
              <p className="text-anthropic-light-gray/70">Server ready on port 3000</p>
              <p><span className="text-anthropic-blue">~/project</span> $ <span className="animate-pulse">_</span></p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Support Section */}
      <section className="py-32 px-6 md:px-12 bg-anthropic-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 md:gap-24">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              <Zap className="w-8 h-8 text-anthropic-orange" />
              <h3 className="text-2xl font-poppins font-medium text-anthropic-light">Instant Boot</h3>
              <p className="text-anthropic-mid-gray font-lora leading-relaxed text-lg">Environments start in milliseconds. No containers to provision, no images to pull.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              <Terminal className="w-8 h-8 text-anthropic-blue" />
              <h3 className="text-2xl font-poppins font-medium text-anthropic-light">Full Node API</h3>
              <p className="text-anthropic-mid-gray font-lora leading-relaxed text-lg">Run Express, Vite, Next.js, and more. A fully compliant Node.js runtime inside your browser tab.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <Globe className="w-8 h-8 text-anthropic-green" />
              <h3 className="text-2xl font-poppins font-medium text-anthropic-light">Local-First</h3>
              <p className="text-anthropic-mid-gray font-lora leading-relaxed text-lg">Work offline. Compute stays local. Secure by design with zero backend dependencies required.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="py-32 px-6 md:px-12 bg-[#1a1a19] border-y border-anthropic-light-gray/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl md:text-5xl font-poppins font-medium tracking-tight leading-tight text-anthropic-light">
              Embeddable IDEs.<br />
              Interactive Docs.
            </h2>
            <p className="text-lg text-anthropic-mid-gray font-lora leading-relaxed max-w-md">
              Integrate Runboxjs into your platform to provide interactive code examples, tutorials, or full-fledged development environments. It just works.
            </p>
            <ul className="flex flex-col gap-6 text-anthropic-light-gray font-lora">
              <li className="flex items-center gap-4 border-b border-anthropic-light-gray/10 pb-6">
                <span className="w-2 h-2 rounded-full bg-anthropic-orange"></span>
                Mount virtual filesystems instantly
              </li>
              <li className="flex items-center gap-4 border-b border-anthropic-light-gray/10 pb-6">
                <span className="w-2 h-2 rounded-full bg-anthropic-blue"></span>
                Execute shell commands programmatically
              </li>
              <li className="flex items-center gap-4 pb-6">
                <span className="w-2 h-2 rounded-full bg-anthropic-green"></span>
                Intercept network requests seamlessly
              </li>
            </ul>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-anthropic-light-gray/10 bg-anthropic-dark overflow-hidden shadow-2xl"
          >
            <div className="flex items-center px-6 py-4 border-b border-anthropic-light-gray/10 bg-[#1e1e1d]">
              <span className="text-xs font-mono text-anthropic-mid-gray">app.js</span>
            </div>
            <pre className="p-8 text-sm md:text-base font-mono text-anthropic-light-gray overflow-x-auto leading-relaxed no-scrollbar selection:bg-anthropic-light-gray/20">
<code className="text-anthropic-orange">import</code> {'{'} Runbox {'}'} <code className="text-anthropic-orange">from</code> <code className="text-anthropic-green">'@runboxjs/core'</code>;
<br/><br/>
<code className="text-anthropic-blue">const</code> runbox = <code className="text-anthropic-orange">await</code> Runbox.<code className="text-anthropic-blue">boot</code>();
<br/><br/>
<code className="text-anthropic-orange">await</code> runbox.<code className="text-anthropic-blue">mount</code>({'{'}
  <code className="text-anthropic-green">'server.js'</code>: <code className="text-anthropic-green">`
    const http = require('http');
    http.createServer((req, res) =&gt; {'{'}
      res.end('Hello from Runboxjs');
    {'}'}).listen(8080);
  `</code>
{'}'});
<br/><br/>
<code className="text-anthropic-blue">const</code> process = <code className="text-anthropic-orange">await</code> runbox.<code className="text-anthropic-blue">spawn</code>(<code className="text-anthropic-green">'node'</code>, [<code className="text-anthropic-green">'server.js'</code>]);
            </pre>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-anthropic-dark">
        <h2 className="text-5xl md:text-7xl font-poppins font-medium tracking-tighter mb-8 text-anthropic-light">
          Start building.
        </h2>
        <p className="text-xl font-lora text-anthropic-mid-gray max-w-lg mb-12 leading-relaxed">
          Add Runboxjs to your project and experience the power of in-browser Node.js environments.
        </p>
        <a href="#" className="bg-anthropic-orange text-anthropic-dark px-10 py-5 rounded-full font-poppins font-medium text-lg hover:bg-[#c76547] hover:scale-105 transition-all shadow-xl">
          Read the Documentation
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-anthropic-dark pt-24 pb-12 px-6 md:px-12 border-t border-anthropic-light-gray/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-2xl font-poppins font-medium tracking-tight text-anthropic-light">
              <Box className="w-6 h-6 text-anthropic-orange" />
              <span>Runboxjs</span>
            </div>
            <p className="text-anthropic-mid-gray font-lora max-w-sm leading-relaxed">
              Bringing native Node.js environments directly to your browser tab. Fast, secure, and entirely local.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-poppins font-medium text-anthropic-light mb-2">Resources</h4>
            <a href="#" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-orange transition-colors w-fit">Documentation</a>
            <a href="#" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-orange transition-colors w-fit">API Reference</a>
            <a href="#" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-orange transition-colors w-fit">Blog</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-poppins font-medium text-anthropic-light mb-2">Community</h4>
            <a href="#" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-blue transition-colors w-fit">GitHub</a>
            <a href="#" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-blue transition-colors w-fit">Discord</a>
            <a href="#" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-blue transition-colors w-fit">Twitter / X</a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-anthropic-light-gray/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-poppins text-anthropic-mid-gray/70">
          <p>© 2026 Runboxjs. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-anthropic-light transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-anthropic-light transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
