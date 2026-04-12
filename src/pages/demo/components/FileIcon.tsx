import React from 'react';
import {
  SiJavascript, SiTypescript, SiReact, SiCss, SiHtml5,
  SiPython, SiMarkdown, SiRust, SiGnubash, SiSass,
} from 'react-icons/si';
import { VscJson, VscFile } from 'react-icons/vsc';

interface FileIconProps { path: string; className?: string }

export function FileIcon({ path, className = 'w-3.5 h-3.5 shrink-0' }: FileIconProps) {
  const ext  = path.split('.').pop()?.toLowerCase() ?? '';
  const name = path.split('/').pop()?.toLowerCase() ?? '';

  if (name === 'package.json')                        return <VscJson   className={className} style={{ color: '#cb3837' }} />;
  if (ext === 'json')                                 return <VscJson   className={className} style={{ color: '#f0db4f' }} />;
  if (ext === 'js' || ext === 'mjs' || ext === 'cjs') return <SiJavascript className={className} style={{ color: '#f0db4f' }} />;
  if (ext === 'jsx')                                  return <SiReact   className={className} style={{ color: '#61dafb' }} />;
  if (ext === 'ts')                                   return <SiTypescript className={className} style={{ color: '#3178c6' }} />;
  if (ext === 'tsx')                                  return <SiReact   className={className} style={{ color: '#61dafb' }} />;
  if (ext === 'css')                                  return <SiCss     className={className} style={{ color: '#1572b6' }} />;
  if (ext === 'scss' || ext === 'sass')               return <SiSass    className={className} style={{ color: '#cc6699' }} />;
  if (ext === 'html' || ext === 'htm')                return <SiHtml5   className={className} style={{ color: '#e34f26' }} />;
  if (ext === 'py')                                   return <SiPython  className={className} style={{ color: '#3776ab' }} />;
  if (ext === 'md' || ext === 'mdx')                  return <SiMarkdown className={className} style={{ color: '#b0aea5' }} />;
  if (ext === 'rs')                                   return <SiRust    className={className} style={{ color: '#ce4a00' }} />;
  if (ext === 'sh' || ext === 'bash' || ext === 'zsh') return <SiGnubash className={className} style={{ color: '#4eaa25' }} />;
  return <VscFile className={className} style={{ color: '#b0aea5' }} />;
}
