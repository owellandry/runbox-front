import React from 'react';
import { Terminal, Zap, FileText } from 'lucide-react';

const DocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-6xl font-poppins font-medium tracking-tight">Documentación</h1>
          <p className="text-xl font-lora text-anthropic-mid-gray leading-relaxed">
            Todo lo que necesitas saber sobre cómo integrar Runboxjs en tu plataforma.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#1a1a19] border border-anthropic-light-gray/10 flex flex-col gap-4 hover:border-anthropic-orange/50 transition-colors cursor-pointer">
            <Zap className="w-8 h-8 text-anthropic-orange" />
            <h3 className="text-xl font-poppins font-medium">Inicio Rápido</h3>
            <p className="text-anthropic-mid-gray font-lora text-sm">Empieza a usarlo en menos de 5 minutos.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#1a1a19] border border-anthropic-light-gray/10 flex flex-col gap-4 hover:border-anthropic-blue/50 transition-colors cursor-pointer">
            <Terminal className="w-8 h-8 text-anthropic-blue" />
            <h3 className="text-xl font-poppins font-medium">Referencia de la API</h3>
            <p className="text-anthropic-mid-gray font-lora text-sm">Documentación detallada de la API de Runboxjs.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#1a1a19] border border-anthropic-light-gray/10 flex flex-col gap-4 hover:border-anthropic-green/50 transition-colors cursor-pointer">
            <FileText className="w-8 h-8 text-anthropic-green" />
            <h3 className="text-xl font-poppins font-medium">Guías</h3>
            <p className="text-anthropic-mid-gray font-lora text-sm">Tutoriales paso a paso para casos de uso comunes.</p>
          </div>
        </div>

        <section className="mt-8 flex flex-col gap-6">
          <h2 className="text-2xl font-poppins font-medium border-b border-anthropic-light-gray/10 pb-4">Instalación</h2>
          <p className="font-lora text-anthropic-mid-gray">Instala el paquete utilizando tu gestor de paquetes preferido:</p>
          <pre className="p-6 rounded-xl bg-[#1a1a19] border border-anthropic-light-gray/10 font-mono text-sm overflow-x-auto no-scrollbar selection:bg-anthropic-light-gray/20">
            <code className="text-anthropic-light-gray">npm install runboxjs</code>
          </pre>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-poppins font-medium border-b border-anthropic-light-gray/10 pb-4">Inicio Rápido</h2>
          <p className="font-lora text-anthropic-mid-gray">Crea un RunboxInstance, escribe archivos y ejecuta comandos. El módulo WebAssembly se inicializa automáticamente al importar:</p>
          <pre className="p-6 rounded-xl bg-[#1a1a19] border border-anthropic-light-gray/10 font-mono text-sm overflow-x-auto no-scrollbar selection:bg-anthropic-light-gray/20">
<code className="text-anthropic-orange">import</code> {'{'} RunboxInstance {'}'} <code className="text-anthropic-orange">from</code> <code className="text-anthropic-green">'runboxjs'</code>;
<br/><br/>
<span className="text-anthropic-mid-gray/50">// 1. Crea un sandbox aislado de RunBox</span><br/>
<code className="text-anthropic-blue">const</code> runbox = <code className="text-anthropic-orange">new</code> <code className="text-anthropic-blue">RunboxInstance</code>();
<br/><br/>
<span className="text-anthropic-mid-gray/50">// 2. Escribe un archivo usando el Sistema de Archivos Virtual</span><br/>
<code className="text-anthropic-blue">const</code> fileContent = <code className="text-anthropic-orange">new</code> <code className="text-anthropic-blue">TextEncoder</code>().<code className="text-anthropic-blue">encode</code>(<code className="text-anthropic-green">'console.log("¡Hola desde WASM!");'</code>);<br/>
runbox.<code className="text-anthropic-blue">write_file</code>(<code className="text-anthropic-green">'/app.js'</code>, fileContent);
<br/><br/>
<span className="text-anthropic-mid-gray/50">// 3. Ejecuta un comando síncronamente</span><br/>
<code className="text-anthropic-blue">const</code> result = runbox.<code className="text-anthropic-blue">exec</code>(<code className="text-anthropic-green">'node /app.js'</code>);<br/>
<code className="text-anthropic-blue">const</code> output = JSON.<code className="text-anthropic-blue">parse</code>(result);
<br/><br/>
console.<code className="text-anthropic-blue">log</code>(output.stdout); <span className="text-anthropic-mid-gray/50">// "¡Hola desde WASM!\n"</span>
          </pre>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-poppins font-medium border-b border-anthropic-light-gray/10 pb-4">Avanzado: Terminal Interactiva</h2>
          <p className="font-lora text-anthropic-mid-gray">Runboxjs proporciona capacidades completas de emulación de terminal. Puedes enviar entradas exactamente como si un usuario estuviera escribiendo en una instancia de xterm.js:</p>
          <pre className="p-6 rounded-xl bg-[#1a1a19] border border-anthropic-light-gray/10 font-mono text-sm overflow-x-auto no-scrollbar selection:bg-anthropic-light-gray/20">
<span className="text-anthropic-mid-gray/50">// Simula a un usuario escribiendo "ls -la" y presionando Enter</span><br/>
runbox.<code className="text-anthropic-blue">terminal_input</code>(<code className="text-anthropic-green">'l'</code>);<br/>
runbox.<code className="text-anthropic-blue">terminal_input</code>(<code className="text-anthropic-green">'s'</code>);<br/>
runbox.<code className="text-anthropic-blue">terminal_input</code>(<code className="text-anthropic-green">' -la'</code>);<br/>
runbox.<code className="text-anthropic-blue">terminal_input</code>(<code className="text-anthropic-green">'\r'</code>); <span className="text-anthropic-mid-gray/50">// Ejecutar</span><br/>
<br/>
<span className="text-anthropic-mid-gray/50">// Drena el buffer de salida de la terminal (llama a esto en requestAnimationFrame)</span><br/>
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