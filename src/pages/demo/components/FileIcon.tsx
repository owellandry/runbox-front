import {
  SiJavascript, SiTypescript, SiReact, SiHtml5, SiCss3, SiSass, SiLess,
  SiPython, SiMarkdown, SiRust, SiGnubash, SiYaml, SiDocker, SiCplusplus, 
  SiGo, SiPhp, SiRuby, SiSwift, SiKotlin, SiDart, SiVuedotjs, 
  SiSvelte, SiAngular, SiGraphql, SiPnpm, SiYarn, SiBun, SiNpm, SiVite, 
  SiEslint, SiPrettier, SiGit, SiJson
} from 'react-icons/si';
import { TbBrandCSharp } from 'react-icons/tb';
import { 
  VscJson, VscFile, VscSettingsGear, VscLock, VscDatabase, 
  VscFileMedia, VscFileZip, VscTerminal
} from 'react-icons/vsc';

interface FileIconProps { path: string; className?: string }

export function FileIcon({ path, className = 'w-3.5 h-3.5 shrink-0' }: FileIconProps) {
  const name = path.split('/').pop()?.toLowerCase() ?? '';
  const ext  = name.split('.').pop() ?? '';

  // 1. Specific File Names (Lockfiles, configs, etc.)
  switch (name) {
    case 'package.json': return <SiNpm className={className} style={{ color: '#cb3837' }} />;
    case 'package-lock.json': return <VscLock className={className} style={{ color: '#cb3837' }} />;
    case 'yarn.lock': return <SiYarn className={className} style={{ color: '#2c8ebb' }} />;
    case 'pnpm-lock.yaml': return <SiPnpm className={className} style={{ color: '#f69220' }} />;
    case 'bun.lock':
    case 'bun.lockb': return <SiBun className={className} style={{ color: '#fbf0df' }} />;
    case 'vite.config.ts':
    case 'vite.config.js': return <SiVite className={className} style={{ color: '#646cff' }} />;
    case 'tsconfig.json':
    case 'tsconfig.node.json': return <SiTypescript className={className} style={{ color: '#3178c6' }} />;
    case '.gitignore':
    case '.gitattributes': return <SiGit className={className} style={{ color: '#f14e32' }} />;
    case 'dockerfile':
    case '.dockerignore': return <SiDocker className={className} style={{ color: '#2496ed' }} />;
    case '.eslintrc':
    case '.eslintrc.js':
    case '.eslintrc.json':
    case '.eslintrc.cjs':
    case 'eslint.config.js': return <SiEslint className={className} style={{ color: '#4b32c3' }} />;
    case '.prettierrc':
    case '.prettierrc.json':
    case 'prettier.config.js': return <SiPrettier className={className} style={{ color: '#f7b93e' }} />;
    case '.env':
    case '.env.local':
    case '.env.production':
    case '.env.development': return <VscSettingsGear className={className} style={{ color: '#fac536' }} />;
  }

  // 2. Extensions
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
    case 'ng': return <SiAngular className={className} style={{ color: '#dd0031' }} />;
    
    case 'html':
    case 'htm': return <SiHtml5 className={className} style={{ color: '#e34f26' }} />;
    case 'css': return <SiCss3 className={className} style={{ color: '#1572b6' }} />;
    case 'scss':
    case 'sass': return <SiSass className={className} style={{ color: '#cc6699' }} />;
    case 'less': return <SiLess className={className} style={{ color: '#1d365d' }} />;
    
    case 'json': return <SiJson className={className} style={{ color: '#cbcb41' }} />;
    case 'yaml':
    case 'yml': return <SiYaml className={className} style={{ color: '#cb171e' }} />;
    case 'md':
    case 'mdx': return <SiMarkdown className={className} style={{ color: '#ffffff' }} />;
    case 'txt':
    case 'csv': return <VscFile className={className} style={{ color: '#e3e3e3' }} />;
    
    case 'py': return <SiPython className={className} style={{ color: '#3776ab' }} />;
    case 'rs': return <SiRust className={className} style={{ color: '#ce4a00' }} />;
    case 'go': return <SiGo className={className} style={{ color: '#00add8' }} />;
    case 'rb': return <SiRuby className={className} style={{ color: '#cc342d' }} />;
    case 'php': return <SiPhp className={className} style={{ color: '#777bb4' }} />;
    case 'java':
    case 'jar': return <VscFile className={className} style={{ color: '#b07219' }} />;
    case 'c':
    case 'h': return <SiCplusplus className={className} style={{ color: '#a8b9cc' }} />;
    case 'cpp':
    case 'hpp':
    case 'cc':
    case 'cxx': return <SiCplusplus className={className} style={{ color: '#00599c' }} />;
    case 'cs': return <TbBrandCSharp className={className} style={{ color: '#239120' }} />;
    case 'swift': return <SiSwift className={className} style={{ color: '#fa7343' }} />;
    case 'kt':
    case 'kts': return <SiKotlin className={className} style={{ color: '#0095d5' }} />;
    case 'dart': return <SiDart className={className} style={{ color: '#0175c2' }} />;
    
    case 'sh':
    case 'bash':
    case 'zsh':
    case 'bat':
    case 'ps1': return <VscTerminal className={className} style={{ color: '#4eaa25' }} />;
    
    case 'sql': return <VscDatabase className={className} style={{ color: '#e38c00' }} />;
    case 'graphql':
    case 'gql': return <SiGraphql className={className} style={{ color: '#e10098' }} />;
    
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'ico':
    case 'webp': return <VscFileMedia className={className} style={{ color: '#00bfa5' }} />;
    
    case 'zip':
    case 'tar':
    case 'gz': return <VscFileZip className={className} style={{ color: '#7a7a7a' }} />;
    
    case 'lock': return <VscLock className={className} style={{ color: '#888888' }} />;
  }

  // Fallback
  return <VscFile className={className} style={{ color: '#b0aea5' }} />;
}
