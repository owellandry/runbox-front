import React from 'react';
import { motion } from 'framer-motion';
import _Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

import { FileIcon } from './FileIcon';
import { getLanguage } from '../utils/language';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Editor = (_Editor as any).default ?? _Editor;

interface CodeEditorProps {
  files: Record<string, string>;
  setFiles: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeFile: string;
  setActiveFile: (path: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ files, setFiles, activeFile, setActiveFile }) => {
  return (
    <motion.div
      key="code"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex-1 flex flex-col min-h-0"
    >
      {/* File Tabs */}
      <div className="flex items-end bg-[#141413] overflow-x-auto no-scrollbar">
        {Object.keys(files).filter(f => !f.endsWith('/')).map(path => (
          <button
            key={path}
            onClick={() => setActiveFile(path)}
            className={`relative px-4 py-2.5 text-xs font-mono transition-colors flex items-center gap-2 whitespace-nowrap border-r border-[#b0aea5]/10 ${
              activeFile === path
                ? 'bg-[#0a0a09] text-[#faf9f5]'
                : 'bg-[#141413] text-[#b0aea5] hover:bg-[#1e1e1d]'
            }`}
          >
            {activeFile === path && (
              <motion.span
                layoutId="tab-underline"
                className="absolute top-0 inset-x-0 h-[2px] bg-[#6a9bcc]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <FileIcon path={path} />
            {path.replace(/^\//, '')}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 relative overflow-auto bg-[#0a0a09] no-scrollbar">
        <div className="flex min-h-full">
          <div className="w-12 bg-[#141413] border-r border-[#b0aea5]/10 pt-6 pb-6 text-right pr-3 shrink-0 select-none">
            <div className="text-[13px] text-[#b0aea5]/40 font-mono leading-relaxed">
              {(files[activeFile] ?? '').split('\n').map((_, i) => (
                <div key={i} className="h-[21px]">{i + 1}</div>
              ))}
            </div>
          </div>
          <div className="flex-1 pt-6 pb-6 min-w-0">
            {activeFile && files[activeFile] !== undefined ? (
              <Editor
                value={files[activeFile]}
                onValueChange={(code: string) => setFiles({ ...files, [activeFile]: code })}
                highlight={(code: string) => Prism.highlight(code, Prism.languages[getLanguage(activeFile)], getLanguage(activeFile))}
                padding={{ top: 0, right: 24, bottom: 0, left: 16 }}
                style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: '21px', minHeight: '100%', backgroundColor: 'transparent' }}
                className="w-full text-[#faf9f5] focus:outline-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#b0aea5] font-mono text-sm">
                Selecciona o crea un archivo para editar
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
