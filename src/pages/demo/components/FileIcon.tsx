import {
  SiAngular,
  SiApache,
  SiAnsible,
  SiAstro,
  SiBabel,
  SiBun,
  SiCloudflare,
  SiCmake,
  SiCss,
  SiCypress,
  SiDart,
  SiDocker,
  SiDotnet,
  SiElectron,
  SiElixir,
  SiEslint,
  SiFirebase,
  SiGatsby,
  SiGithubactions,
  SiGit,
  SiGo,
  SiGraphql,
  SiGradle,
  SiGnubash,
  SiHaskell,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiJupyter,
  SiKotlin,
  SiKubernetes,
  SiLaravel,
  SiLess,
  SiLua,
  SiMarkdown,
  SiNestjs,
  SiNetlify,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiNpm,
  SiNuxt,
  SiOpenjdk,
  SiPerl,
  SiPhp,
  SiPoetry,
  SiPnpm,
  SiPostcss,
  SiPrettier,
  SiPrisma,
  SiPython,
  SiQt,
  SiR,
  SiRabbitmq,
  SiReact,
  SiRedis,
  SiRemix,
  SiRollupdotjs,
  SiRuby,
  SiRust,
  SiSass,
  SiScala,
  SiSqlite,
  SiStorybook,
  SiStylus,
  SiSupabase,
  SiSvelte,
  SiSwift,
  SiTailwindcss,
  SiTauri,
  SiTerraform,
  SiToml,
  SiTypescript,
  SiUnrealengine,
  SiUnity,
  SiVercel,
  SiVite,
  SiVitest,
  SiVuedotjs,
  SiWebpack,
  SiXml,
  SiYaml,
  SiYarn
} from 'react-icons/si';
import { TbBrandCSharp } from 'react-icons/tb';
import {
  VscDatabase,
  VscFile,
  VscFileMedia,
  VscFileZip,
  VscLock,
  VscSettingsGear,
  VscTerminal
} from 'react-icons/vsc';

interface FileIconProps { path: string; className?: string }

export function FileIcon({ path, className = 'w-3.5 h-3.5 shrink-0' }: FileIconProps) {
  const lowerPath = path.toLowerCase();
  const name = lowerPath.split('/').pop() ?? '';
  const ext = name.includes('.') ? name.split('.').pop() ?? '' : '';

  // Path-based matching
  if ((ext === 'yml' || ext === 'yaml') && lowerPath.includes('/.github/workflows/')) {
    return <SiGithubactions className={className} style={{ color: '#2088ff' }} />;
  }
  if (lowerPath.includes('/.storybook/')) {
    return <SiStorybook className={className} style={{ color: '#ff4785' }} />;
  }
  if (lowerPath.includes('/supabase/')) {
    return <SiSupabase className={className} style={{ color: '#3ecf8e' }} />;
  }
  if ((ext === 'yml' || ext === 'yaml') && (lowerPath.includes('/k8s/') || lowerPath.includes('/kubernetes/'))) {
    return <SiKubernetes className={className} style={{ color: '#326ce5' }} />;
  }

  // File-name matching
  switch (name) {
    case 'package.json': return <SiNpm className={className} style={{ color: '#cb3837' }} />;
    case 'package-lock.json':
    case 'npm-shrinkwrap.json': return <VscLock className={className} style={{ color: '#cb3837' }} />;
    case 'yarn.lock':
    case '.yarnrc':
    case '.yarnrc.yml': return <SiYarn className={className} style={{ color: '#2c8ebb' }} />;
    case 'pnpm-lock.yaml':
    case 'pnpm-workspace.yaml': return <SiPnpm className={className} style={{ color: '#f69220' }} />;
    case 'bun.lock':
    case 'bun.lockb': return <SiBun className={className} style={{ color: '#fbf0df' }} />;

    case 'vite.config.ts':
    case 'vite.config.js':
    case 'vite.config.mjs':
    case 'vite.config.cjs': return <SiVite className={className} style={{ color: '#646cff' }} />;
    case 'webpack.config.ts':
    case 'webpack.config.js':
    case 'webpack.config.mjs':
    case 'webpack.config.cjs': return <SiWebpack className={className} style={{ color: '#8dd6f9' }} />;
    case 'rollup.config.ts':
    case 'rollup.config.js':
    case 'rollup.config.mjs':
    case 'rollup.config.cjs': return <SiRollupdotjs className={className} style={{ color: '#ec4a3f' }} />;
    case 'postcss.config.ts':
    case 'postcss.config.js':
    case 'postcss.config.mjs':
    case 'postcss.config.cjs': return <SiPostcss className={className} style={{ color: '#dd3a0a' }} />;
    case 'tailwind.config.ts':
    case 'tailwind.config.js':
    case 'tailwind.config.cjs':
    case 'tailwind.config.mjs': return <SiTailwindcss className={className} style={{ color: '#06b6d4' }} />;
    case 'babel.config.ts':
    case 'babel.config.js':
    case 'babel.config.cjs':
    case '.babelrc':
    case '.babelrc.json': return <SiBabel className={className} style={{ color: '#f9dc3e' }} />;
    case 'vitest.config.ts':
    case 'vitest.config.js':
    case 'vitest.config.mts':
    case 'vitest.config.mjs': return <SiVitest className={className} style={{ color: '#729b1b' }} />;
    case 'cypress.config.ts':
    case 'cypress.config.js': return <SiCypress className={className} style={{ color: '#69d3a7' }} />;

    case 'next.config.js':
    case 'next.config.mjs':
    case 'next.config.ts': return <SiNextdotjs className={className} style={{ color: '#ffffff' }} />;
    case 'nuxt.config.js':
    case 'nuxt.config.ts': return <SiNuxt className={className} style={{ color: '#00dc82' }} />;
    case 'astro.config.mjs':
    case 'astro.config.ts':
    case 'astro.config.js': return <SiAstro className={className} style={{ color: '#ff5d01' }} />;
    case 'remix.config.js':
    case 'remix.config.ts': return <SiRemix className={className} style={{ color: '#6a5af9' }} />;
    case 'svelte.config.js':
    case 'svelte.config.ts': return <SiSvelte className={className} style={{ color: '#ff3e00' }} />;
    case 'angular.json': return <SiAngular className={className} style={{ color: '#dd0031' }} />;
    case 'nest-cli.json': return <SiNestjs className={className} style={{ color: '#e0234e' }} />;
    case 'gatsby-config.js':
    case 'gatsby-node.js': return <SiGatsby className={className} style={{ color: '#663399' }} />;

    case 'tsconfig.json':
    case 'tsconfig.node.json': return <SiTypescript className={className} style={{ color: '#3178c6' }} />;
    case '.eslintrc':
    case '.eslintrc.js':
    case '.eslintrc.json':
    case '.eslintrc.cjs':
    case 'eslint.config.js': return <SiEslint className={className} style={{ color: '#4b32c3' }} />;
    case '.prettierrc':
    case '.prettierrc.json':
    case 'prettier.config.js': return <SiPrettier className={className} style={{ color: '#f7b93e' }} />;
    case '.gitignore':
    case '.gitattributes':
    case '.gitmodules': return <SiGit className={className} style={{ color: '#f14e32' }} />;
    case '.npmrc':
    case '.nvmrc': return <SiNodedotjs className={className} style={{ color: '#5fa04e' }} />;
    case '.env':
    case '.env.local':
    case '.env.production':
    case '.env.development': return <VscSettingsGear className={className} style={{ color: '#fac536' }} />;

    case 'dockerfile':
    case '.dockerignore': return <SiDocker className={className} style={{ color: '#2496ed' }} />;
    case 'docker-compose.yml':
    case 'docker-compose.yaml':
    case 'compose.yml':
    case 'compose.yaml': return <SiDocker className={className} style={{ color: '#2496ed' }} />;
    case 'kustomization.yaml':
    case 'kustomization.yml': return <SiKubernetes className={className} style={{ color: '#326ce5' }} />;
    case 'wrangler.toml': return <SiCloudflare className={className} style={{ color: '#f48120' }} />;
    case 'vercel.json': return <SiVercel className={className} style={{ color: '#ffffff' }} />;
    case 'netlify.toml': return <SiNetlify className={className} style={{ color: '#00ad9f' }} />;
    case 'firebase.json': return <SiFirebase className={className} style={{ color: '#ffca28' }} />;
    case 'nginx.conf': return <SiNginx className={className} style={{ color: '#009639' }} />;
    case 'apache.conf':
    case 'httpd.conf': return <SiApache className={className} style={{ color: '#d22128' }} />;
    case 'ansible.cfg': return <SiAnsible className={className} style={{ color: '#ee0000' }} />;
    case 'redis.conf': return <SiRedis className={className} style={{ color: '#dc382d' }} />;
    case 'rabbitmq.conf': return <SiRabbitmq className={className} style={{ color: '#ff6600' }} />;

    case 'requirements.txt': return <SiPython className={className} style={{ color: '#3776ab' }} />;
    case 'pyproject.toml':
    case 'poetry.lock': return <SiPoetry className={className} style={{ color: '#60a5fa' }} />;
    case 'cargo.toml':
    case 'cargo.lock': return <SiRust className={className} style={{ color: '#ce4a00' }} />;
    case 'go.mod':
    case 'go.sum': return <SiGo className={className} style={{ color: '#00add8' }} />;
    case 'gemfile':
    case 'gemfile.lock': return <SiRuby className={className} style={{ color: '#cc342d' }} />;
    case 'composer.json':
    case 'composer.lock': return <SiPhp className={className} style={{ color: '#777bb4' }} />;
    case 'pom.xml': return <SiOpenjdk className={className} style={{ color: '#e76f00' }} />;
    case 'build.gradle':
    case 'settings.gradle':
    case 'gradle.properties':
    case 'gradlew':
    case 'gradlew.bat': return <SiGradle className={className} style={{ color: '#02303a' }} />;
    case 'cmakelists.txt': return <SiCmake className={className} style={{ color: '#064f8c' }} />;
    case 'schema.prisma': return <SiPrisma className={className} style={{ color: '#2d3748' }} />;
    case 'tauri.conf.json': return <SiTauri className={className} style={{ color: '#24c8db' }} />;
    case 'artisan': return <SiLaravel className={className} style={{ color: '#ff2d20' }} />;
    case 'makefile': return <SiGnubash className={className} style={{ color: '#4eaa25' }} />;
  }

  if (name.endsWith('.csproj') || name.endsWith('.sln') || name.endsWith('.fsproj')) {
    return <SiDotnet className={className} style={{ color: '#512bd4' }} />;
  }
  if (name.endsWith('.uproject')) {
    return <SiUnrealengine className={className} style={{ color: '#ffffff' }} />;
  }
  if (name.endsWith('.unity')) {
    return <SiUnity className={className} style={{ color: '#ffffff' }} />;
  }
  if (name.endsWith('.pro')) {
    return <SiQt className={className} style={{ color: '#41cd52' }} />;
  }

  // Extension matching
  switch (ext) {
    case 'js':
    case 'mjs':
    case 'cjs': return <SiJavascript className={className} style={{ color: '#f0db4f' }} />;
    case 'ts':
    case 'mts':
    case 'cts': return <SiTypescript className={className} style={{ color: '#3178c6' }} />;
    case 'jsx':
    case 'tsx': return <SiReact className={className} style={{ color: '#61dafb' }} />;
    case 'vue': return <SiVuedotjs className={className} style={{ color: '#4fc08d' }} />;
    case 'svelte': return <SiSvelte className={className} style={{ color: '#ff3e00' }} />;
    case 'astro': return <SiAstro className={className} style={{ color: '#ff5d01' }} />;

    case 'html':
    case 'htm': return <SiHtml5 className={className} style={{ color: '#e34f26' }} />;
    case 'css': return <SiCss className={className} style={{ color: '#1572b6' }} />;
    case 'scss':
    case 'sass': return <SiSass className={className} style={{ color: '#cc6699' }} />;
    case 'less': return <SiLess className={className} style={{ color: '#1d365d' }} />;
    case 'styl': return <SiStylus className={className} style={{ color: '#ff6347' }} />;

    case 'json': return <SiJson className={className} style={{ color: '#cbcb41' }} />;
    case 'yaml':
    case 'yml': return <SiYaml className={className} style={{ color: '#cb171e' }} />;
    case 'toml': return <SiToml className={className} style={{ color: '#9c4221' }} />;
    case 'xml': return <SiXml className={className} style={{ color: '#f97316' }} />;
    case 'md':
    case 'mdx': return <SiMarkdown className={className} style={{ color: '#ffffff' }} />;
    case 'txt':
    case 'log': return <VscFile className={className} style={{ color: '#e3e3e3' }} />;

    case 'py': return <SiPython className={className} style={{ color: '#3776ab' }} />;
    case 'rs': return <SiRust className={className} style={{ color: '#ce4a00' }} />;
    case 'go': return <SiGo className={className} style={{ color: '#00add8' }} />;
    case 'rb': return <SiRuby className={className} style={{ color: '#cc342d' }} />;
    case 'php': return <SiPhp className={className} style={{ color: '#777bb4' }} />;
    case 'java':
    case 'jar': return <SiOpenjdk className={className} style={{ color: '#e76f00' }} />;
    case 'c':
    case 'h':
    case 'cpp':
    case 'hpp':
    case 'cc':
    case 'cxx': return <SiCmake className={className} style={{ color: '#8aa4c8' }} />;
    case 'cs': return <TbBrandCSharp className={className} style={{ color: '#239120' }} />;
    case 'swift': return <SiSwift className={className} style={{ color: '#fa7343' }} />;
    case 'kt':
    case 'kts': return <SiKotlin className={className} style={{ color: '#0095d5' }} />;
    case 'dart': return <SiDart className={className} style={{ color: '#0175c2' }} />;
    case 'scala':
    case 'sc': return <SiScala className={className} style={{ color: '#dc322f' }} />;
    case 'hs': return <SiHaskell className={className} style={{ color: '#5e5086' }} />;
    case 'ex':
    case 'exs': return <SiElixir className={className} style={{ color: '#4b275f' }} />;
    case 'lua': return <SiLua className={className} style={{ color: '#2c2d72' }} />;
    case 'r':
    case 'rmd': return <SiR className={className} style={{ color: '#276dc3' }} />;
    case 'pl':
    case 'pm': return <SiPerl className={className} style={{ color: '#39457e' }} />;

    case 'sh':
    case 'bash':
    case 'zsh':
    case 'fish':
    case 'bat':
    case 'cmd':
    case 'ps1': return <VscTerminal className={className} style={{ color: '#4eaa25' }} />;

    case 'sql': return <VscDatabase className={className} style={{ color: '#e38c00' }} />;
    case 'sqlite':
    case 'db':
    case 'db3': return <SiSqlite className={className} style={{ color: '#003b57' }} />;
    case 'graphql':
    case 'gql': return <SiGraphql className={className} style={{ color: '#e10098' }} />;
    case 'prisma': return <SiPrisma className={className} style={{ color: '#2d3748' }} />;
    case 'tf':
    case 'tfvars':
    case 'hcl': return <SiTerraform className={className} style={{ color: '#7b42bc' }} />;
    case 'ipynb': return <SiJupyter className={className} style={{ color: '#f37626' }} />;

    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'ico':
    case 'webp':
    case 'avif': return <VscFileMedia className={className} style={{ color: '#00bfa5' }} />;

    case 'zip':
    case 'tar':
    case 'gz':
    case 'rar':
    case '7z': return <VscFileZip className={className} style={{ color: '#7a7a7a' }} />;

    case 'lock': return <VscLock className={className} style={{ color: '#888888' }} />;
    case 'ini':
    case 'cfg':
    case 'conf':
    case 'properties': return <VscSettingsGear className={className} style={{ color: '#fac536' }} />;
  }

  if (name.startsWith('readme') || name.startsWith('changelog') || name === 'license' || name === 'license.md') {
    return <SiMarkdown className={className} style={{ color: '#ffffff' }} />;
  }
  if (name.startsWith('main') && (ext === 'py' || ext === 'js' || ext === 'ts')) {
    return <SiNodedotjs className={className} style={{ color: '#5fa04e' }} />;
  }
  if (name.includes('electron')) {
    return <SiElectron className={className} style={{ color: '#47848f' }} />;
  }

  return <VscFile className={className} style={{ color: '#b0aea5' }} />;
}

