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
  { id: 'overview', label: 'Overview' },
  { id: 'install', label: 'Install + Vite' },
  { id: 'quickstart', label: 'Quick Start' },
  { id: 'runtime-matrix', label: 'Runtime Matrix' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'assistant-skill', label: 'Assistant Skill' },
  { id: 'examples', label: 'Templates & Scenarios' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
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
    title: 'Bun/Node Runtime',
    command: 'bun run, node, nodejs, tsx, ts-node',
    notes: 'Node aliases are routed to the Bun runtime layer for sandbox execution.',
  },
  {
    title: 'Package Managers',
    command: 'npm, npx, pnpm, pnpx, yarn, bun install/add',
    notes: 'Install/add/remove/list/audit/update flows supported with lockfile generation in VFS.',
  },
  {
    title: 'Git Runtime',
    command: 'git init/add/commit/status/branch/checkout/merge/push/pull',
    notes: 'In-memory git workflow with remote helpers and credentials.',
  },
  {
    title: 'Python Runtime',
    command: 'python/python3, pip/pip3',
    notes: 'Browser environments can bridge Pyodide; native targets try system Python first.',
  },
  {
    title: 'Shell Builtins',
    command: 'cd, ls, echo, cat, pwd, mkdir, rm, cp, mv, touch',
    notes: 'Useful for file and workspace orchestration from assistant flows.',
  },
  {
    title: 'Terminal Stream',
    command: 'terminal_input, terminal_drain, terminal_resize',
    notes: 'xterm-style stream model with incremental output polling.',
  },
];

const apiGroups: ApiGroup[] = [
  {
    title: 'Filesystem',
    methods: ['write_file', 'read_file', 'list_dir', 'file_exists', 'remove_file'],
    detail: 'Operate on the in-memory virtual filesystem with binary-safe read/write support.',
  },
  {
    title: 'Execution',
    methods: ['exec'],
    detail: 'Execute commands and receive structured JSON output with stdout, stderr, and exit_code.',
  },
  {
    title: 'Package Tarball Flow',
    methods: ['npm_packages_needed', 'npm_process_tarball'],
    detail: 'WASM-friendly dependency install flow using host-side npm registry fetch and tarball ingestion.',
  },
  {
    title: 'Console + Terminal',
    methods: ['console_push', 'console_all', 'console_since', 'terminal_input', 'terminal_drain'],
    detail: 'Capture logs, stream outputs, and power terminal UIs in the browser.',
  },
  {
    title: 'Hot Reload + Inspector',
    methods: ['hot_tick', 'hot_flush', 'inspector_activate', 'inspector_set_node', 'inspector_overlay'],
    detail: 'Drive UI refresh decisions and DOM inspection overlays from a host app.',
  },
  {
    title: 'AI Tools',
    methods: ['ai_tools', 'ai_dispatch'],
    detail: 'Expose tool schemas for OpenAI/Anthropic/Gemini and execute skill calls in sandbox context.',
  },
  {
    title: 'Sandbox + Network Bridges',
    methods: ['sandbox_command', 'sandbox_event', 'http_handle_request', 'sw_handle_request'],
    detail: 'Bridge preview servers, sandbox events, and service-worker-driven request handling.',
  },
];

const templateScenarios = [
  {
    name: 'React Dashboard',
    goal: 'Load app, install deps, run start script, and expose localhost preview.',
  },
  {
    name: 'Vanilla JS App',
    goal: 'Simple zero-build app with fast startup and browser-native preview.',
  },
  {
    name: 'TypeScript API Playground',
    goal: 'Run TS server-style entry points through runtime script execution.',
  },
  {
    name: 'Python Data Lab',
    goal: 'Validate pip install/list/freeze and python script execution behavior.',
  },
  {
    name: 'Git Workflow Demo',
    goal: 'Validate init/add/status/branch/checkout/commit/remote flows inside VFS.',
  },
  {
    name: 'pnpm Showcase',
    goal: 'Exercise lockfile generation and package command lifecycle with pnpm.',
  },
  {
    name: 'Yarn Showcase',
    goal: 'Exercise lockfile generation and package command lifecycle with yarn.',
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
          <p className="uppercase tracking-[0.22em] text-xs text-anthropic-blue font-poppins">RunboxJS Documentation</p>
          <h1 className="text-4xl md:text-6xl font-poppins font-medium tracking-tight mt-3 text-anthropic-light">
            Complete Docs for /doc
          </h1>
          <p className="max-w-3xl mt-4 text-lg text-anthropic-mid-gray font-lora">
            Architecture, API, runtime behavior, assistant skills, and real integration guidance for building robust browser sandboxes with RunboxJS.
          </p>
        </motion.header>

        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
          <aside className="hidden lg:block sticky top-28 rounded-2xl border border-anthropic-light-gray/10 bg-[#171715] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-anthropic-mid-gray font-poppins mb-4">On this page</p>
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
            <SectionCard id="overview" title="Overview" icon={<BookOpen className="w-5 h-5" />}>
              <p>
                RunboxJS is a WebAssembly-first runtime that lets you execute project workflows directly in-browser: files,
                commands, terminal streams, package installs, git flows, and assistant tool calls.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Core package</p>
                  <p className="text-sm text-anthropic-mid-gray mt-1">`runboxjs` (WASM + JS bindings)</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Execution model</p>
                  <p className="text-sm text-anthropic-mid-gray mt-1">Virtual filesystem + runtime dispatch by command target</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Output contract</p>
                  <p className="text-sm text-anthropic-mid-gray mt-1">`exec()` always returns JSON with `stdout`, `stderr`, `exit_code`</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Best fit</p>
                  <p className="text-sm text-anthropic-mid-gray mt-1">Interactive docs, playgrounds, browser IDEs, AI coding copilots</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="install" title="Install + Vite Setup" icon={<Wrench className="w-5 h-5" />}>
              <p>
                RunboxJS now works in standard Vite apps without additional plugin configuration. Install and initialize directly.
              </p>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{installCode}</code>
              </pre>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{viteConfigCode}</code>
              </pre>
            </SectionCard>

            <SectionCard id="quickstart" title="Quick Start" icon={<Rocket className="w-5 h-5" />}>
              <p>
                Initialize once with `await init()`, then create isolated runtimes by instantiating `RunboxInstance`.
              </p>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{quickStartCode}</code>
              </pre>
              <div className="rounded-2xl border border-anthropic-green/25 bg-anthropic-green/10 p-4 text-sm">
                <p className="text-anthropic-light flex items-center gap-2 font-poppins">
                  <CheckCircle2 className="w-4 h-4 text-anthropic-green" />
                  Production tip
                </p>
                <p className="mt-2">
                  Always parse command results and branch behavior on `exit_code` instead of string matching `stderr`.
                </p>
              </div>
            </SectionCard>

            <SectionCard id="runtime-matrix" title="Runtime Matrix" icon={<Server className="w-5 h-5" />}>
              <p>
                Command dispatch is program-based and routes into dedicated runtime modules. This matrix helps when building
                command UIs or assistant planners.
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
                <p className="text-anthropic-light font-poppins mb-2">Lockfile output paths</p>
                <p>`npm` {'->'} `/package-lock.json`</p>
                <p>`pnpm` {'->'} `/pnpm-lock.yaml`</p>
                <p>`yarn` {'->'} `/yarn.lock`</p>
                <p>`bun` {'->'} `/bun.lock`</p>
              </div>
            </SectionCard>

            <SectionCard id="api-reference" title="API Reference" icon={<Terminal className="w-5 h-5" />}>
              <p>
                The API is designed in groups so you can connect editor state, terminal state, and preview state without custom
                protocols.
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

            <SectionCard id="assistant-skill" title="Assistant Skill Integration" icon={<Bot className="w-5 h-5" />}>
              <p>
                `ai_tools(provider)` exposes schema for OpenAI, Anthropic, and Gemini. `ai_dispatch` executes the requested tool in
                the same sandbox state.
              </p>
              <pre className="p-4 rounded-xl bg-[#11110f] border border-anthropic-light-gray/10 overflow-x-auto text-sm text-anthropic-light-gray">
                <code>{aiDispatchCode}</code>
              </pre>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm mb-2">Available skill names</p>
                  <p className="text-xs font-mono leading-relaxed text-anthropic-blue">
                    read_file • write_file • list_dir • exec_command • search_code • get_console_logs • reload_sandbox •
                    install_packages • get_file_tree
                  </p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm mb-2">Recommended control loop</p>
                  <p className="text-sm">
                    inspect tree {'->'} run command {'->'} parse exit_code {'->'} patch files {'->'} rerun {'->'} report deterministic result
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="examples" title="Templates & Scenarios" icon={<Sparkles className="w-5 h-5" />}>
              <p>
                These scenarios mirror real templates used in the demo environment and are ideal for regression checks when shipping
                runtime updates.
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
                  Regression baseline
                </p>
                <p className="mt-2">
                  Keep scenario logs grouped and exportable so each template can be validated without manual copy-paste from the
                  terminal panel.
                </p>
              </div>
            </SectionCard>

            <SectionCard id="troubleshooting" title="Troubleshooting" icon={<AlertTriangle className="w-5 h-5" />}>
              <div className="space-y-4">
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">WASM import fails in Vite</p>
                  <p className="text-sm mt-2">Clear cache and reinstall dependencies. RunboxJS no longer requires `vite-plugin-wasm`.</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Modules not found after install</p>
                  <p className="text-sm mt-2">Verify both `/package.json` dependency entries and `/node_modules/&lt;name&gt;/package.json` in VFS.</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Python command warns about missing python3</p>
                  <p className="text-sm mt-2">Expected on environments without native Python; browser adapters should provide Pyodide integration.</p>
                </div>
                <div className="rounded-2xl border border-anthropic-light-gray/10 bg-[#141412] p-4">
                  <p className="text-anthropic-light font-poppins text-sm">Lockfile not visible in UI</p>
                  <p className="text-sm mt-2">Runtime creates lockfiles in VFS, so the issue is usually file-tree refresh logic in the frontend.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-anthropic-orange/30 bg-anthropic-orange/10 p-4 text-sm mt-2">
                <p className="text-anthropic-light font-poppins flex items-center gap-2">
                  <Shield className="w-4 h-4 text-anthropic-orange" />
                  Stability recommendation
                </p>
                <p className="mt-2">
                  Add an automated template matrix that runs install + start + smoke assertions per runtime to catch regressions before release.
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
