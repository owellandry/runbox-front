import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Zap, Globe, ArrowRight, Copy, Check } from 'lucide-react';
import HeroBackground from './HeroBackground';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DocsPage from './pages/DocsPage';
import DemoPage from './pages/demo';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install runboxjs');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
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
              Ejecuta Node.js directamente en el navegador. Entornos instantÃ¡neos, sin configuraciÃ³n. Arranca una aplicaciÃ³n full-stack dentro del navegador con rendimiento nativo.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <a href="#documentation" className="flex items-center gap-2 bg-anthropic-light text-anthropic-dark px-8 py-4 rounded-full font-poppins font-medium hover:bg-anthropic-light-gray transition-colors shadow-[0_0_40px_rgba(217,119,87,0.15)]">
                Comenzar <ArrowRight className="w-4 h-4" />
              </a>
              <button 
                onClick={handleCopy}
                className="group relative flex items-center gap-3 text-sm font-mono text-anthropic-light-gray px-5 py-4 rounded-xl bg-anthropic-dark/50 border border-anthropic-light-gray/10 shadow-inner hover:bg-anthropic-dark/80 transition-colors cursor-pointer"
                title="Copiar al portapapeles"
              >
                <span>npm install runboxjs</span>
                {copied ? (
                  <Check className="w-4 h-4 text-anthropic-green" />
                ) : (
                  <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
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
              <p><span className="text-anthropic-blue">~/proyecto</span> $ npx create-runboxjs-app</p>
              <p className="text-anthropic-light-gray/70">Iniciando entorno...</p>
              <p className="text-anthropic-light-gray/70">Iniciando Node.js v18.16.0</p>
              <p className="text-anthropic-light-gray/70">Servidor listo en el puerto 3000</p>
              <p><span className="text-anthropic-blue">~/proyecto</span> $ <span className="animate-pulse">_</span></p>
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
              <h3 className="text-2xl font-poppins font-medium text-anthropic-light">Inicio InstantÃ¡neo</h3>
              <p className="text-anthropic-mid-gray font-lora leading-relaxed text-lg">Los entornos se inician en milisegundos. Sin contenedores que provisionar, ni imÃ¡genes que descargar.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              <Terminal className="w-8 h-8 text-anthropic-blue" />
              <h3 className="text-2xl font-poppins font-medium text-anthropic-light">API Completa de Node</h3>
              <p className="text-anthropic-mid-gray font-lora leading-relaxed text-lg">Ejecuta Express, Vite, Next.js y mÃ¡s. Un entorno de ejecuciÃ³n de Node.js totalmente compatible dentro de la pestaÃ±a de tu navegador.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <Globe className="w-8 h-8 text-anthropic-green" />
              <h3 className="text-2xl font-poppins font-medium text-anthropic-light">Local Primero</h3>
              <p className="text-anthropic-mid-gray font-lora leading-relaxed text-lg">Trabaja sin conexiÃ³n. El procesamiento se mantiene local. Seguro por diseÃ±o sin requerir dependencias de backend.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section id="documentation" className="py-32 px-6 md:px-12 bg-[#1a1a19] border-y border-anthropic-light-gray/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl md:text-5xl font-poppins font-medium tracking-tight leading-tight text-anthropic-light">
              IDEs integrables.<br />
              Docs interactivos.
            </h2>
            <p className="text-lg text-anthropic-mid-gray font-lora leading-relaxed max-w-md">
              Integra Runboxjs en tu plataforma para proporcionar ejemplos de cÃ³digo interactivos, tutoriales o entornos de desarrollo completos. Simplemente funciona.
            </p>
            <ul className="flex flex-col gap-6 text-anthropic-light-gray font-lora">
              <li className="flex items-center gap-4 border-b border-anthropic-light-gray/10 pb-6">
                <span className="w-2 h-2 rounded-full bg-anthropic-orange"></span>
                Monta sistemas de archivos virtuales al instante
              </li>
              <li className="flex items-center gap-4 border-b border-anthropic-light-gray/10 pb-6">
                <span className="w-2 h-2 rounded-full bg-anthropic-blue"></span>
                Ejecuta comandos de shell de forma programÃ¡tica
              </li>
              <li className="flex items-center gap-4 pb-6">
                <span className="w-2 h-2 rounded-full bg-anthropic-green"></span>
                Intercepta solicitudes de red sin problemas
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
<code className="text-anthropic-orange">import</code> {'{'} RunboxInstance {'}'} <code className="text-anthropic-orange">from</code> <code className="text-anthropic-green">'runboxjs'</code>;
<br/><br/>
<code className="text-anthropic-blue">const</code> runbox = <code className="text-anthropic-orange">new</code> <code className="text-anthropic-blue">RunboxInstance</code>();
<br/><br/>
<code className="text-anthropic-blue">const</code> content = <code className="text-anthropic-orange">new</code> <code className="text-anthropic-blue">TextEncoder</code>().<code className="text-anthropic-blue">encode</code>(<code className="text-anthropic-green">'console.log("Hello from browser!");'</code>);<br/>
runbox.<code className="text-anthropic-blue">write_file</code>(<code className="text-anthropic-green">'/app.js'</code>, content);
<br/><br/>
<code className="text-anthropic-blue">const</code> result = runbox.<code className="text-anthropic-blue">exec</code>(<code className="text-anthropic-green">'node /app.js'</code>);<br/>
console.<code className="text-anthropic-blue">log</code>(JSON.<code className="text-anthropic-blue">parse</code>(result));
            </pre>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 md:px-12 flex flex-col items-center text-center bg-anthropic-dark">
        <h2 className="text-5xl md:text-7xl font-poppins font-medium tracking-tighter mb-8 text-anthropic-light">
          Empieza a construir.
        </h2>
        <p className="text-xl font-lora text-anthropic-mid-gray max-w-lg mb-12 leading-relaxed">
          AÃ±ade Runboxjs a tu proyecto y experimenta el poder de los entornos Node.js en el navegador.
        </p>
        <a href="/doc" className="bg-anthropic-orange text-anthropic-dark px-10 py-5 rounded-full font-poppins font-medium text-lg hover:bg-[#c76547] hover:scale-105 transition-all shadow-xl">
          Lee la DocumentaciÃ³n
        </a>
      </section>
    </>
  );
};

export default function App() {
  const location = useLocation();
  const isDemoRoute = location.pathname === '/demo';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 selection:text-white font-sans flex flex-col">
      {!isDemoRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doc" element={<DocsPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>
      {!isDemoRoute && <Footer />}
    </div>
  );
}
