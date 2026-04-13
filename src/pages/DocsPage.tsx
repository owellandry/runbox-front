import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Terminal,
  Sparkles,
  Wrench,
  Bot,
  Rocket,
  AlertTriangle,
  CheckCircle2,
  FolderTree,
  Server,
  Shield,
} from 'lucide-react';

type RuntimeCard = {
  title: string;
  command: string;
  notes: string;
};

type ApiGroup = {
  title: string;
  methods: string[];
  detail: string;
};

const sectionLinks = [
  { id: 'overview', label: 'Descripción General' },
  { id: 'install', label: 'Instalación + Vite' },
  { id: 'quickstart', label: 'Inicio Rápido' },
  { id: 'runtime-matrix', label: 'Matriz de Ejecución' },
  { id: 'api-reference', label: 'Referencia de la API' },
  { id: 'assistant-skill', label: 'Habilidad del Asistente' },
  { id: 'examples', label: 'Plantillas y Escenarios' },
  { id: 'troubleshooting', label: 'Solución de Problemas' },
];

const installCode = `npm install runboxjs`;

const viteConfigCode = `import init, { RunboxInstance } from 'runboxjs';

await init();
const runbox = new RunboxInstance();`;

const quickStartCode = `import init, { RunboxInstance } from 'runboxjs';

await init();
const runbox = new RunboxInstance();

runbox.write_file('/index.js', new TextEncoder().encode("console.log('hello');"));

const result = JSON.parse(runbox.exec('node /index.js'));
console.log(result.stdout);`;

const aiDispatchCode = `const call = {
  name: 'exec_command',
  arguments: { command: 'npm run start' },
};

const response = JSON.parse(runbox.ai_dispatch(JSON.stringify(call)));
console.log(response);`;

const runtimeCards: RuntimeCard[] = [
  {
    title: 'Entorno Bun/Node',
    command: 'bun run, node, nodejs, tsx, ts-node',
    notes: 'Los alias de Node se dirigen a la capa de ejecución de Bun para su ejecución en el sandbox.',
  },
  {
    title: 'Gestores de Paquetes',
    command: 'npm, npx, pnpm, pnpx, yarn, bun install/add',
    notes: 'Soporte para flujos de install/add/remove/list/audit/update con generación de lockfile en el VFS.',
  },
  {
    title: 'Entorno Git',
    command: 'git init/add/commit/status/branch/checkout/merge/push/pull',
    notes: 'Flujo de trabajo de git en memoria con credenciales y ayudantes remotos.',
  },
  {
    title: 'Entorno Python',
    command: 'python/python3, pip/pip3',
    notes: 'Los entornos de navegador pueden conectarse con Pyodide; los objetivos nativos intentan usar primero el Python del sistema.',
  },
  {
    title: 'Comandos Shell Nativos',
    command: 'cd, ls, echo, cat, pwd, mkdir, rm, cp, mv, touch',
    notes: 'Útil para la orquestación de archivos y del espacio de trabajo desde flujos de asistentes.',
  },
  {
    title: 'Flujo de Terminal',
    command: 'terminal_input, terminal_drain, terminal_resize',
    notes: 'Modelo de flujo estilo xterm con consultas (polling) incrementales de salida.',
  },
];

const apiGroups: ApiGroup[] = [
  {
    title: 'Sistema de Archivos',
    methods: ['write_file', 'read_file', 'list_dir', 'file_exists', 'remove_file'],
    detail: 'Opera sobre el sistema de archivos virtual en memoria con soporte de lectura/escritura seguro para binarios.',
  },
  {
    title: 'Ejecución',
    methods: ['exec'],
    detail: 'Ejecuta comandos y recibe una salida JSON estructurada con stdout, stderr y exit_code.',
  },
  {
    title: 'Flujo de Tarballs de Paquetes',
    methods: ['npm_packages_needed', 'npm_process_tarball'],
    detail: 'Flujo de instalación de dependencias amigable con WASM utilizando la obtención de registros npm del lado del host e ingesta de tarballs.',
  },
  {
    title: 'Consola y Terminal',
    methods: ['console_push', 'console_all', 'console_since', 'terminal_input', 'terminal_drain'],
    detail: 'Captura registros, transmite salidas y potencia interfaces de terminal en el navegador.',
  },
  {
    title: 'Recarga en Caliente e Inspector',
    methods: ['hot_tick', 'hot_flush', 'inspector_activate', 'inspector_set_node', 'inspector_overlay'],
    detail: 'Impulsa decisiones de actualización de UI y superposiciones de inspección DOM desde una aplicación anfitriona.',
  },
  {
    title: 'Herramientas de IA',
    methods: ['ai_tools', 'ai_dispatch'],
    detail: 'Expone esquemas de herramientas para OpenAI/Anthropic/Gemini y ejecuta llamadas a habilidades en el contexto del sandbox.',
  },
  {
    title: 'Sandbox y Puentes de Red',
    methods: ['sandbox_command', 'sandbox_event', 'http_handle_request', 'sw_handle_request'],
    detail: 'Conecta servidores de vista previa, eventos de sandbox y manejo de peticiones controladas por service-workers.',
  },
];

const templateScenarios = [
  {
    name: 'Dashboard en React',
    goal: 'Cargar la aplicación, instalar dependencias, ejecutar script de inicio y exponer previsualización en localhost.',
  },
  {
    name: 'Aplicación Vanilla JS',
    goal: 'Aplicación simple sin compilación con inicio rápido y vista previa nativa en el navegador.',
  },
  {
    name: 'Playground API TypeScript',
    goal: 'Ejecutar puntos de entrada de servidor en TypeScript mediante la ejecución de scripts en el entorno.',
  },
  {
    name: 'Laboratorio de Datos en Python',
    goal: 'Validar pip install/list/freeze y el comportamiento de la ejecución de scripts python.',
  },
  {
    name: 'Demostración del Flujo Git',
    goal: 'Validar flujos init/add/status/branch/checkout/commit/remote dentro del sistema de archivos (VFS).',
  },
  {
    name: 'Demostración pnpm',
    goal: 'Probar la generación de lockfiles y el ciclo de vida de comandos de paquetes con pnpm.',
  },
  {
    name: 'Demostración yarn',
    goal: 'Probar la generación de lockfiles y el ciclo de vida de comandos de paquetes con yarn.',
  },
];

const SectionCard: React.FC<{ id: string; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  id,
  title,
  icon,
  children,
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-120px' }}
    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    className="rounded-3xl border border-anthropic-light-gray/10 bg-[#181816] p-6 md:p-8 scroll-mt-28"
  >
    <div className="flex items-center gap-3 mb-5">
      <span className="w-10 h-10 rounded-xl bg-anthropic-light/5 border border-anthropic-light-gray/10 flex items-center justify-center text-anthropic-orange">
        {icon}
      </span>
      <h2 className="text-2xl md:text-3xl font-poppins font-medium tracking-tight text-anthropic-light">{title}</h2>
    </div>
    <div className="space-y-5 text-anthropic-mid-gray font-lora leading-relaxed">{children}</div>
  </motion.section>
);

const DocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-28 pb-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="uppercase tracking-[0.22em] text-xs text-anthropic-blue font-poppins">Documentación de RunboxJS</p>
          <h1 className="text-4xl md:text-6xl font-poppins font-medium tracking-tight mt-3 text-anthropic-light">
            Docs Completos para /doc
          </h1>
          <p className="max-w-3xl mt-4 text-lg text-anthropic-mid-gray font-lora">
            Arquitectura, API, comportamiento de ejecución, habilidades de asistente y orientación real de integración para construir sandboxes de navegador robustos con RunboxJS.
          </p>
        </motion.header>

        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
          <aside className="hidden lg:block sticky top-28 rounded-2xl border border-anthropic-light-gray/10 bg-[#171715] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-anthropic-mid-gray font-poppins mb-4">En esta página</p>
            <nav className="space-y-2">
              {sectionLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="block text-sm text-anthropic-light-gray/85 hover:text-anthropic-light transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-7">
            <SectionCard id="overview" title="Descripción General" icon={<BookOpen className="w-5 h-5" />}>
              <p>
                RunboxJS es un entorno de ejecución orientado a WebAssembly que te permite ejecutar flujos de trabajo de proyectos directamente en el navegador: archivos,
                comandos, flujos de terminal, instalaciones de paquetes, flujos git y llamadas a herramientas de asistentes.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Paquete principal</p>
                  <p className="text-sm text-anthropic-mid-gray mt-1">`runboxjs` (WASM + enlaces JS)</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Modelo de ejecución</p>
                  <p className="text-sm text-anthropic-mid-gray mt-1">Sistema de archivos virtual + despacho de ejecución por objetivo de comando</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Contrato de salida</p>
                  <p className="text-sm text-anthropic-mid-gray mt-1">`exec()` siempre devuelve un JSON con `stdout`, `stderr`, `exit_code`</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Mejor uso</p>
                  <p className="text-sm text-anthropic-mid-gray mt-1">Docs interactivos, playgrounds, IDEs en el navegador, copilotos de programación IA</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="install" title="Instalación + Vite" icon={<Wrench className="w-5 h-5" />}>
              <p>
                RunboxJS ahora funciona en aplicaciones Vite estándar sin configuración adicional de plugins. Instala e inicializa directamente.
              </p>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{installCode}</code>
              </pre>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{viteConfigCode}</code>
              </pre>
            </SectionCard>

            <SectionCard id="quickstart" title="Inicio Rápido" icon={<Rocket className="w-5 h-5" />}>
              <p>
                Inicializa una vez con `await init()`, luego crea entornos aislados instanciando `RunboxInstance`.
              </p>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{quickStartCode}</code>
              </pre>
              <div className="rounded-2xl border border-anthropic-green/25 bg-anthropic-green/10 p-4 text-sm">
                <p className="text-anthropic-light flex items-center gap-2 font-poppins">
                  <CheckCircle2 className="w-4 h-4 text-anthropic-green" />
                  Consejo para producción
                </p>
                <p className="mt-2">
                  Siempre analiza los resultados del comando y ramifica el comportamiento con `exit_code` en lugar de coincidir cadenas de texto en `stderr`.
                </p>
              </div>
            </SectionCard>

            <SectionCard id="runtime-matrix" title="Matriz de Ejecución" icon={<Server className="w-5 h-5" />}>
              <p>
                El despacho de comandos está basado en programas y se dirige a módulos de ejecución dedicados. Esta matriz ayuda cuando se construyen 
                interfaces de comandos o planificadores de asistentes.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {runtimeCards.map((runtime) => (
                  <div key={runtime.title} className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                    <h3 className="text-anthropic-light font-poppins text-base">{runtime.title}</h3>
                    <p className="text-anthropic-orange/90 font-mono text-xs mt-2">{runtime.command}</p>
                    <p className="text-sm text-anthropic-mid-gray mt-3">{runtime.notes}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4 text-sm">
                <p className="text-anthropic-light font-poppins mb-2">Rutas de salida de Lockfiles</p>
                <p>`npm` {'->'} `/package-lock.json`</p>
                <p>`pnpm` {'->'} `/pnpm-lock.yaml`</p>
                <p>`yarn` {'->'} `/yarn.lock`</p>
                <p>`bun` {'->'} `/bun.lock`</p>
              </div>
            </SectionCard>

            <SectionCard id="api-reference" title="Referencia de la API" icon={<Terminal className="w-5 h-5" />}>
              <p>
                La API está diseñada en grupos para que puedas conectar el estado del editor, el estado de la terminal y el estado de la vista previa sin
                protocolos personalizados.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {apiGroups.map((group) => (
                  <div key={group.title} className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                    <h3 className="text-anthropic-light font-poppins text-base">{group.title}</h3>
                    <p className="text-sm mt-2">{group.detail}</p>
                    <p className="text-xs font-mono text-anthropic-blue mt-3 leading-relaxed">{group.methods.join(' • ')}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="assistant-skill" title="Integración de Habilidad de Asistente" icon={<Bot className="w-5 h-5" />}>
              <p>
                `ai_tools(provider)` expone esquemas para OpenAI, Anthropic y Gemini. `ai_dispatch` ejecuta la herramienta solicitada en el mismo estado del sandbox.
              </p>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{aiDispatchCode}</code>
              </pre>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm mb-2">Nombres de habilidades disponibles</p>
                  <p className="text-xs font-mono leading-relaxed text-anthropic-blue">
                    read_file • write_file • list_dir • exec_command • search_code • get_console_logs • reload_sandbox •
                    install_packages • get_file_tree
                  </p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm mb-2">Bucle de control recomendado</p>
                  <p className="text-sm">
                    inspeccionar árbol {'->'} ejecutar comando {'->'} analizar exit_code {'->'} aplicar parche a archivos {'->'} volver a ejecutar {'->'} reportar resultado determinista
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="examples" title="Plantillas y Escenarios" icon={<Sparkles className="w-5 h-5" />}>
              <p>
                Estos escenarios reflejan plantillas reales utilizadas en el entorno de demostración y son ideales para comprobaciones de regresión cuando se despliegan
                actualizaciones de ejecución.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {templateScenarios.map((scenario) => (
                  <div key={scenario.name} className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                    <p className="text-anthropic-light font-poppins text-sm">{scenario.name}</p>
                    <p className="text-sm mt-2">{scenario.goal}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-anthropic-blue/30 bg-anthropic-blue/10 p-4 text-sm">
                <p className="flex items-center gap-2 text-anthropic-light font-poppins">
                  <FolderTree className="w-4 h-4 text-anthropic-blue" />
                  Línea base de regresión
                </p>
                <p className="mt-2">
                  Mantén los registros de escenarios agrupados y exportables para que cada plantilla pueda validarse sin copiar y pegar manualmente desde el panel del terminal.
                </p>
              </div>
            </SectionCard>

            <SectionCard id="troubleshooting" title="Solución de Problemas" icon={<AlertTriangle className="w-5 h-5" />}>
              <div className="space-y-4">
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">La importación de WASM falla en Vite</p>
                  <p className="text-sm mt-2">Limpia la caché y reinstala las dependencias. RunboxJS ya no requiere `vite-plugin-wasm`.</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Módulos no encontrados después de instalar</p>
                  <p className="text-sm mt-2">Verifica tanto las entradas de dependencia en `/package.json` como `/node_modules/&lt;nombre&gt;/package.json` en el VFS.</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">El comando de Python advierte sobre la falta de python3</p>
                  <p className="text-sm mt-2">Se espera en entornos sin Python nativo; los adaptadores de navegador deben proporcionar la integración de Pyodide.</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Lockfile no visible en la UI</p>
                  <p className="text-sm mt-2">El entorno de ejecución crea los lockfiles en el VFS, por lo que el problema suele ser la lógica de actualización del árbol de archivos en el frontend.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-anthropic-orange/30 bg-anthropic-orange/10 p-4 text-sm mt-2">
                <p className="text-anthropic-light font-poppins flex items-center gap-2">
                  <Shield className="w-4 h-4 text-anthropic-orange" />
                  Recomendación de estabilidad
                </p>
                <p className="mt-2">
                  Agrega una matriz automatizada de plantillas que ejecute aserciones de humo (install + start) por cada entorno para atrapar regresiones antes de un lanzamiento.
                </p>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
