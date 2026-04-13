import React, { useState } from 'react';
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
import { useTranslation } from 'react-i18next';

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

type TemplateScenario = {
  name: string;
  goal: string;
};

type LocaleContent = {
  headerTag: string;
  headerTitle: string;
  headerDesc: string;
  onThisPage: string;
  sectionLabels: {
    overview: string;
    install: string;
    quickstart: string;
    runtime: string;
    api: string;
    assistant: string;
    examples: string;
    troubleshooting: string;
  };
  overviewIntro: string;
  overviewCards: Array<{ label: string; value: string }>;
  installIntro: string;
  quickstartIntro: string;
  quickstartTipTitle: string;
  quickstartTipBody: string;
  runtimeIntro: string;
  lockfilesTitle: string;
  apiIntro: string;
  assistantIntro: string;
  assistantToolsTitle: string;
  assistantLoopTitle: string;
  assistantLoopBody: string;
  examplesIntro: string;
  regressionTitle: string;
  regressionBody: string;
  troubleshootingItems: Array<{ title: string; body: string }>;
  stabilityTitle: string;
  stabilityBody: string;
  runtimeCards: RuntimeCard[];
  apiGroups: ApiGroup[];
  templateScenarios: TemplateScenario[];
};

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

const docsByLocale: Record<'en' | 'es', LocaleContent> = {
  en: {
    headerTag: 'RunboxJS Documentation',
    headerTitle: 'Complete Docs for /doc',
    headerDesc:
      'Architecture, API, execution behavior, assistant skills, and practical integration guidance for robust browser sandboxes.',
    onThisPage: 'On this page',
    sectionLabels: {
      overview: 'Overview',
      install: 'Install + Vite',
      quickstart: 'Quick Start',
      runtime: 'Runtime Matrix',
      api: 'API Reference',
      assistant: 'Assistant Skill Integration',
      examples: 'Templates and Scenarios',
      troubleshooting: 'Troubleshooting',
    },
    overviewIntro:
      'RunboxJS is a WebAssembly-first runtime that executes project workflows directly in the browser: files, commands, terminal streams, package installs, git flows, and assistant tool calls.',
    overviewCards: [
      { label: 'Core package', value: '`runboxjs` (WASM + JS bindings)' },
      { label: 'Execution model', value: 'Virtual filesystem + command-target runtime dispatch' },
      { label: 'Output contract', value: '`exec()` returns JSON with `stdout`, `stderr`, and `exit_code`' },
      { label: 'Best fit', value: 'Interactive docs, playgrounds, browser IDEs, coding copilots' },
    ],
    installIntro:
      'RunboxJS needs Vite WASM support enabled (`vite-plugin-wasm` + top-level await). Then install and initialize directly.',
    quickstartIntro:
      'Initialize once with `await init()`, then create isolated environments by instantiating `RunboxInstance`.',
    quickstartTipTitle: 'Production tip',
    quickstartTipBody:
      'Always branch behavior using `exit_code` instead of matching arbitrary text from `stderr`.',
    runtimeIntro:
      'Command dispatch is program-based and routed to dedicated runtime modules. This matrix helps when building command UIs or assistant planners.',
    lockfilesTitle: 'Lockfile output paths',
    apiIntro:
      'The API is grouped so editor state, terminal state, and preview state can be wired without custom protocols.',
    assistantIntro:
      '`ai_tools(provider)` exposes schemas for OpenAI, Anthropic, and Gemini. `ai_dispatch` executes requested tools in the same sandbox state.',
    assistantToolsTitle: 'Available skill names',
    assistantLoopTitle: 'Recommended control loop',
    assistantLoopBody:
      'inspect tree -> execute command -> evaluate exit_code -> patch files -> rerun -> report deterministic outcome',
    examplesIntro:
      'These scenarios mirror real templates used by the demo and are useful for regression checks before runtime releases.',
    regressionTitle: 'Regression baseline',
    regressionBody:
      'Keep scenario logs grouped and exportable so each template can be validated without manual copy/paste from the terminal panel.',
    troubleshootingItems: [
      {
        title: 'WASM import fails in Vite',
        body: 'Ensure `vite-plugin-wasm` and `vite-plugin-top-level-await` are enabled, put WASM plugin first, and exclude `runboxjs` from optimizeDeps.',
      },
      {
        title: 'Modules not found after install',
        body: 'Verify dependency entries in `/package.json` and `/node_modules/<name>/package.json` inside the VFS.',
      },
      {
        title: 'Python command warns about missing python3',
        body: 'Expected in environments without native Python. Browser adapters should provide Pyodide integration.',
      },
      {
        title: 'Lockfile not visible in UI',
        body: 'Lockfiles are created in the VFS, so check file-tree refresh logic in the frontend.',
      },
    ],
    stabilityTitle: 'Stability recommendation',
    stabilityBody:
      'Add an automated template matrix that runs smoke assertions (install + start) for each runtime to catch regressions before release.',
    runtimeCards: [
      {
        title: 'Bun/Node runtime',
        command: 'bun run, node, nodejs, tsx, ts-node',
        notes: 'Node aliases route into Bun execution in the sandbox.',
      },
      {
        title: 'Package managers',
        command: 'npm, npx, pnpm, pnpx, yarn, bun install/add',
        notes: 'Supports install/add/remove/list/audit/update with VFS lockfile generation.',
      },
      {
        title: 'Git runtime',
        command: 'git init/add/commit/status/branch/checkout/merge/push/pull',
        notes: 'In-memory git workflow with credentials and remote helpers.',
      },
      {
        title: 'Python runtime',
        command: 'python/python3, pip/pip3',
        notes: 'Browser runtimes can connect to Pyodide; native targets try local Python first.',
      },
      {
        title: 'Native shell commands',
        command: 'cd, ls, echo, cat, pwd, mkdir, rm, cp, mv, touch',
        notes: 'Useful for workspace orchestration from assistants.',
      },
      {
        title: 'Terminal stream',
        command: 'terminal_input, terminal_drain, terminal_resize',
        notes: 'xterm-like streaming model with incremental output polling.',
      },
    ],
    apiGroups: [
      {
        title: 'Filesystem',
        methods: ['write_file', 'read_file', 'list_dir', 'file_exists', 'remove_file'],
        detail: 'Operate on the in-memory virtual filesystem with safe binary support.',
      },
      {
        title: 'Execution',
        methods: ['exec'],
        detail: 'Run commands and receive structured JSON output with stdout/stderr/exit_code.',
      },
      {
        title: 'Package tarball flow',
        methods: ['npm_packages_needed', 'npm_process_tarball'],
        detail: 'WASM-friendly dependency install flow with host-side npm registry fetches.',
      },
      {
        title: 'Console and terminal',
        methods: ['console_push', 'console_all', 'console_since', 'terminal_input', 'terminal_drain'],
        detail: 'Capture logs, stream output, and power browser terminal interfaces.',
      },
      {
        title: 'Hot reload and inspector',
        methods: ['hot_tick', 'hot_flush', 'inspector_activate', 'inspector_set_node', 'inspector_overlay'],
        detail: 'Drive UI refresh decisions and DOM inspector overlays from a host app.',
      },
      {
        title: 'AI tooling',
        methods: ['ai_tools', 'ai_dispatch'],
        detail: 'Expose tool schemas and execute skill calls inside the sandbox.',
      },
      {
        title: 'Sandbox and network bridges',
        methods: ['sandbox_command', 'sandbox_event', 'http_handle_request', 'sw_handle_request'],
        detail: 'Bridge preview servers, sandbox events, and service-worker style requests.',
      },
    ],
    templateScenarios: [
      {
        name: 'React Dashboard',
        goal: 'Load app, install deps, run start script, and expose localhost preview.',
      },
      {
        name: 'Vanilla JS app',
        goal: 'Run a simple app without build tooling and preview in browser.',
      },
      {
        name: 'TypeScript API playground',
        goal: 'Run TypeScript server entrypoints via runtime script execution.',
      },
      {
        name: 'Python data lab',
        goal: 'Validate pip install/list/freeze and Python execution behavior.',
      },
      {
        name: 'Git workflow demo',
        goal: 'Validate init/add/status/branch/checkout/commit/remote flows in VFS.',
      },
      {
        name: 'pnpm showcase',
        goal: 'Validate lockfile generation and package lifecycle with pnpm.',
      },
      {
        name: 'yarn showcase',
        goal: 'Validate lockfile generation and package lifecycle with yarn.',
      },
    ],
  },
  es: {
    headerTag: 'Documentacion RunboxJS',
    headerTitle: 'Docs completos para /doc',
    headerDesc:
      'Arquitectura, API, comportamiento de ejecucion, skills de asistente y guia practica de integracion para sandboxes de navegador.',
    onThisPage: 'En esta pagina',
    sectionLabels: {
      overview: 'Descripcion general',
      install: 'Instalacion + Vite',
      quickstart: 'Inicio rapido',
      runtime: 'Matriz de ejecucion',
      api: 'Referencia API',
      assistant: 'Integracion de skill de asistente',
      examples: 'Plantillas y escenarios',
      troubleshooting: 'Solucion de problemas',
    },
    overviewIntro:
      'RunboxJS es un runtime orientado a WebAssembly que ejecuta flujos de trabajo de proyecto directamente en el navegador: archivos, comandos, terminal, paquetes, flujos git y herramientas de asistente.',
    overviewCards: [
      { label: 'Paquete principal', value: '`runboxjs` (WASM + bindings JS)' },
      { label: 'Modelo de ejecucion', value: 'Filesystem virtual + despacho por objetivo de comando' },
      { label: 'Contrato de salida', value: '`exec()` devuelve JSON con `stdout`, `stderr` y `exit_code`' },
      { label: 'Mejor uso', value: 'Docs interactivas, playgrounds, IDEs en navegador, copilotos de codigo' },
    ],
    installIntro:
      'RunboxJS requiere habilitar soporte WASM en Vite (`vite-plugin-wasm` + top-level await). Luego instala e inicializa directo.',
    quickstartIntro:
      'Inicializa una vez con `await init()` y luego crea entornos aislados con `RunboxInstance`.',
    quickstartTipTitle: 'Tip para produccion',
    quickstartTipBody:
      'Siempre ramifica comportamiento con `exit_code` en lugar de comparar texto libre en `stderr`.',
    runtimeIntro:
      'El despacho de comandos es por programa y se enruta a modulos de runtime dedicados. Esta matriz ayuda al construir UI de comandos o planificadores de asistentes.',
    lockfilesTitle: 'Rutas de salida de lockfiles',
    apiIntro:
      'La API esta agrupada para conectar estado del editor, terminal y preview sin protocolos personalizados.',
    assistantIntro:
      '`ai_tools(provider)` expone esquemas para OpenAI, Anthropic y Gemini. `ai_dispatch` ejecuta herramientas en el mismo estado del sandbox.',
    assistantToolsTitle: 'Nombres de skills disponibles',
    assistantLoopTitle: 'Bucle de control recomendado',
    assistantLoopBody:
      'inspeccionar arbol -> ejecutar comando -> evaluar exit_code -> aplicar parche -> re-ejecutar -> reportar resultado determinista',
    examplesIntro:
      'Estos escenarios reflejan plantillas reales del demo y sirven para pruebas de regresion antes de un release.',
    regressionTitle: 'Linea base de regresion',
    regressionBody:
      'Mantener logs de escenarios agrupados y exportables ayuda a validar cada plantilla sin copiar/pegar manualmente desde el terminal.',
    troubleshootingItems: [
      {
        title: 'Falla importacion WASM en Vite',
        body: 'Asegura `vite-plugin-wasm` y `vite-plugin-top-level-await`, coloca el plugin WASM primero y excluye `runboxjs` en optimizeDeps.',
      },
      {
        title: 'Modulos no encontrados despues de instalar',
        body: 'Verifica dependencias en `/package.json` y `/node_modules/<name>/package.json` dentro del VFS.',
      },
      {
        title: 'Python advierte que falta python3',
        body: 'Es esperado en entornos sin Python nativo. Adaptadores de navegador deben integrar Pyodide.',
      },
      {
        title: 'Lockfile no visible en la UI',
        body: 'Los lockfiles se crean en el VFS, asi que revisa la logica de refresco del arbol de archivos en frontend.',
      },
    ],
    stabilityTitle: 'Recomendacion de estabilidad',
    stabilityBody:
      'Agrega una matriz automatizada de plantillas que ejecute smoke tests (install + start) por runtime para detectar regresiones antes de lanzar.',
    runtimeCards: [
      {
        title: 'Runtime Bun/Node',
        command: 'bun run, node, nodejs, tsx, ts-node',
        notes: 'Los alias de Node se enrutan a la capa de ejecucion de Bun en sandbox.',
      },
      {
        title: 'Gestores de paquetes',
        command: 'npm, npx, pnpm, pnpx, yarn, bun install/add',
        notes: 'Soporta install/add/remove/list/audit/update con generacion de lockfile en VFS.',
      },
      {
        title: 'Runtime Git',
        command: 'git init/add/commit/status/branch/checkout/merge/push/pull',
        notes: 'Flujo git en memoria con credenciales y helpers remotos.',
      },
      {
        title: 'Runtime Python',
        command: 'python/python3, pip/pip3',
        notes: 'En navegador puede conectarse a Pyodide; en nativo intenta Python local primero.',
      },
      {
        title: 'Comandos shell nativos',
        command: 'cd, ls, echo, cat, pwd, mkdir, rm, cp, mv, touch',
        notes: 'Util para orquestar archivos y workspace desde asistentes.',
      },
      {
        title: 'Flujo de terminal',
        command: 'terminal_input, terminal_drain, terminal_resize',
        notes: 'Modelo tipo xterm con polling incremental de salida.',
      },
    ],
    apiGroups: [
      {
        title: 'Filesystem',
        methods: ['write_file', 'read_file', 'list_dir', 'file_exists', 'remove_file'],
        detail: 'Opera sobre filesystem virtual en memoria con soporte seguro para binarios.',
      },
      {
        title: 'Ejecucion',
        methods: ['exec'],
        detail: 'Ejecuta comandos y devuelve salida JSON estructurada con stdout/stderr/exit_code.',
      },
      {
        title: 'Flujo de tarballs de paquetes',
        methods: ['npm_packages_needed', 'npm_process_tarball'],
        detail: 'Flujo compatible con WASM para instalar dependencias usando fetch de registro npm en host.',
      },
      {
        title: 'Consola y terminal',
        methods: ['console_push', 'console_all', 'console_since', 'terminal_input', 'terminal_drain'],
        detail: 'Captura logs, transmite salida y habilita terminales de navegador.',
      },
      {
        title: 'Hot reload e inspector',
        methods: ['hot_tick', 'hot_flush', 'inspector_activate', 'inspector_set_node', 'inspector_overlay'],
        detail: 'Controla refresco de UI y overlays de inspector DOM desde una app host.',
      },
      {
        title: 'Herramientas IA',
        methods: ['ai_tools', 'ai_dispatch'],
        detail: 'Expone esquemas de herramientas y ejecuta llamadas de skills dentro del sandbox.',
      },
      {
        title: 'Sandbox y puentes de red',
        methods: ['sandbox_command', 'sandbox_event', 'http_handle_request', 'sw_handle_request'],
        detail: 'Conecta preview servers, eventos de sandbox y requests tipo service-worker.',
      },
    ],
    templateScenarios: [
      {
        name: 'Dashboard React',
        goal: 'Cargar app, instalar deps, ejecutar script start y exponer preview localhost.',
      },
      {
        name: 'App Vanilla JS',
        goal: 'Ejecutar una app simple sin build y verla en preview de navegador.',
      },
      {
        name: 'Playground API TypeScript',
        goal: 'Ejecutar entrypoints de servidor TypeScript via runtime.',
      },
      {
        name: 'Laboratorio de datos Python',
        goal: 'Validar pip install/list/freeze y ejecucion de scripts Python.',
      },
      {
        name: 'Demo flujo Git',
        goal: 'Validar flujos init/add/status/branch/checkout/commit/remote en VFS.',
      },
      {
        name: 'Demo pnpm',
        goal: 'Validar lockfile y ciclo de comandos de paquetes con pnpm.',
      },
      {
        name: 'Demo yarn',
        goal: 'Validar lockfile y ciclo de comandos de paquetes con yarn.',
      },
    ],
  },
};

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
  const { i18n } = useTranslation();
  const locale: 'en' | 'es' = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const copy = docsByLocale[locale];
  const [activeSection] = useState('overview');

  const sectionLinks = [
    { id: 'overview', label: copy.sectionLabels.overview },
    { id: 'install', label: copy.sectionLabels.install },
    { id: 'quickstart', label: copy.sectionLabels.quickstart },
    { id: 'runtime-matrix', label: copy.sectionLabels.runtime },
    { id: 'api-reference', label: copy.sectionLabels.api },
    { id: 'assistant-skill', label: copy.sectionLabels.assistant },
    { id: 'examples', label: copy.sectionLabels.examples },
    { id: 'troubleshooting', label: copy.sectionLabels.troubleshooting },
  ];

  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-28 pb-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="uppercase tracking-[0.22em] text-xs text-anthropic-blue font-poppins">{copy.headerTag}</p>
          <h1 className="text-4xl md:text-6xl font-poppins font-medium tracking-tight mt-3 text-anthropic-light">{copy.headerTitle}</h1>
          <p className="max-w-3xl mt-4 text-lg text-anthropic-mid-gray font-lora">{copy.headerDesc}</p>
        </motion.header>

        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
          <aside className="hidden lg:block sticky top-28 rounded-2xl border border-anthropic-light-gray/10 bg-[#171715] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-anthropic-mid-gray font-poppins mb-4">{copy.onThisPage}</p>
            <nav className="space-y-2">
              {sectionLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`block text-sm transition-colors ${
                    activeSection === link.id ? 'text-anthropic-light' : 'text-anthropic-light-gray/85 hover:text-anthropic-light'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-7">
            <SectionCard id="overview" title={copy.sectionLabels.overview} icon={<BookOpen className="w-5 h-5" />}>
              <p>{copy.overviewIntro}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {copy.overviewCards.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                    <p className="text-anthropic-light font-poppins text-sm">{item.label}</p>
                    <p className="text-sm text-anthropic-mid-gray mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="install" title={copy.sectionLabels.install} icon={<Wrench className="w-5 h-5" />}>
              <p>{copy.installIntro}</p>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{installCode}</code>
              </pre>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{viteConfigCode}</code>
              </pre>
            </SectionCard>

            <SectionCard id="quickstart" title={copy.sectionLabels.quickstart} icon={<Rocket className="w-5 h-5" />}>
              <p>{copy.quickstartIntro}</p>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{quickStartCode}</code>
              </pre>
              <div className="rounded-2xl border border-anthropic-green/25 bg-anthropic-green/10 p-4 text-sm">
                <p className="text-anthropic-light flex items-center gap-2 font-poppins">
                  <CheckCircle2 className="w-4 h-4 text-anthropic-green" />
                  {copy.quickstartTipTitle}
                </p>
                <p className="mt-2">{copy.quickstartTipBody}</p>
              </div>
            </SectionCard>

            <SectionCard id="runtime-matrix" title={copy.sectionLabels.runtime} icon={<Server className="w-5 h-5" />}>
              <p>{copy.runtimeIntro}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {copy.runtimeCards.map((runtime) => (
                  <div key={runtime.title} className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                    <h3 className="text-anthropic-light font-poppins text-base">{runtime.title}</h3>
                    <p className="text-anthropic-orange/90 font-mono text-xs mt-2">{runtime.command}</p>
                    <p className="text-sm text-anthropic-mid-gray mt-3">{runtime.notes}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4 text-sm">
                <p className="text-anthropic-light font-poppins mb-2">{copy.lockfilesTitle}</p>
                <p>`npm` {'->'} `/package-lock.json`</p>
                <p>`pnpm` {'->'} `/pnpm-lock.yaml`</p>
                <p>`yarn` {'->'} `/yarn.lock`</p>
                <p>`bun` {'->'} `/bun.lock`</p>
              </div>
            </SectionCard>

            <SectionCard id="api-reference" title={copy.sectionLabels.api} icon={<Terminal className="w-5 h-5" />}>
              <p>{copy.apiIntro}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {copy.apiGroups.map((group) => (
                  <div key={group.title} className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                    <h3 className="text-anthropic-light font-poppins text-base">{group.title}</h3>
                    <p className="text-sm mt-2">{group.detail}</p>
                    <p className="text-xs font-mono text-anthropic-blue mt-3 leading-relaxed">{group.methods.join(' • ')}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="assistant-skill" title={copy.sectionLabels.assistant} icon={<Bot className="w-5 h-5" />}>
              <p>{copy.assistantIntro}</p>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{aiDispatchCode}</code>
              </pre>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm mb-2">{copy.assistantToolsTitle}</p>
                  <p className="text-xs font-mono leading-relaxed text-anthropic-blue">
                    read_file • write_file • list_dir • exec_command • search_code • get_console_logs • reload_sandbox •
                    install_packages • get_file_tree
                  </p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm mb-2">{copy.assistantLoopTitle}</p>
                  <p className="text-sm">{copy.assistantLoopBody}</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="examples" title={copy.sectionLabels.examples} icon={<Sparkles className="w-5 h-5" />}>
              <p>{copy.examplesIntro}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {copy.templateScenarios.map((scenario) => (
                  <div key={scenario.name} className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                    <p className="text-anthropic-light font-poppins text-sm">{scenario.name}</p>
                    <p className="text-sm mt-2">{scenario.goal}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-anthropic-blue/30 bg-anthropic-blue/10 p-4 text-sm">
                <p className="flex items-center gap-2 text-anthropic-light font-poppins">
                  <FolderTree className="w-4 h-4 text-anthropic-blue" />
                  {copy.regressionTitle}
                </p>
                <p className="mt-2">{copy.regressionBody}</p>
              </div>
            </SectionCard>

            <SectionCard id="troubleshooting" title={copy.sectionLabels.troubleshooting} icon={<AlertTriangle className="w-5 h-5" />}>
              <div className="space-y-4">
                {copy.troubleshootingItems.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                    <p className="text-anthropic-light font-poppins text-sm">{item.title}</p>
                    <p className="text-sm mt-2">{item.body}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-anthropic-orange/30 bg-anthropic-orange/10 p-4 text-sm mt-2">
                <p className="text-anthropic-light font-poppins flex items-center gap-2">
                  <Shield className="w-4 h-4 text-anthropic-orange" />
                  {copy.stabilityTitle}
                </p>
                <p className="mt-2">{copy.stabilityBody}</p>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
