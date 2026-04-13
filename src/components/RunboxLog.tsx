import React, { useEffect } from 'react';

interface RunboxLogProps {
  onceKey?: string;
}

const ASCII_LOGO = String.raw`
██████╗ ██╗   ██╗███╗   ██╗██████╗  ██████╗ ██╗  ██╗     ██╗███████╗
██╔══██╗██║   ██║████╗  ██║██╔══██╗██╔═══██╗╚██╗██╔╝     ██║██╔════╝
██████╔╝██║   ██║██╔██╗ ██║██████╔╝██║   ██║ ╚███╔╝      ██║███████╗
██╔══██╗██║   ██║██║╚██╗██║██╔══██╗██║   ██║ ██╔██╗ ██   ██║╚════██║
██║  ██║╚██████╔╝██║ ╚████║██████╔╝╚██████╔╝██╔╝ ██╗╚█████╔╝███████║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚════╝ ╚══════╝
`;

export const RunboxLog: React.FC<RunboxLogProps> = ({ onceKey = '__runboxjs_browser_console_ascii__' }) => {
  useEffect(() => {
    const flags = window as unknown as Record<string, boolean | undefined>;
    if (flags[onceKey]) return;
    flags[onceKey] = true;

    const asciiStyle = [
      'color: #d97757',
      'font-weight: 700',
      'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      'line-height: 1.1',
    ].join(';');

    console.log('%c' + ASCII_LOGO, asciiStyle);
    console.log('%cRunboxJS ready in browser console.', 'color: #d97757; font-weight: 600');
    console.log(
      '%cSecurity notice:%c never paste code in this console unless you fully trust and understand it.',
      'color: #d97757; font-weight: 700',
      'color: #faf9f5; font-weight: 500'
    );
  }, [onceKey]);

  return null;
};
