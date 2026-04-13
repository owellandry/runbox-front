import React from 'react';
import { motion } from 'framer-motion';

interface RunboxLogProps {
  className?: string;
}

const ASCII_ART = `  ███████████████████████████████████████████   
███████████████████████████████████████████████ 
████████████████████████████████████████████████
████                                       █████
████                                       █████
████                                       █████
████                                       █████
████                                        ████
████    █████████       ████      █████████
████ ████████████       ████    ████████████
███████████  █████      ████   ██████  ██████
████████    ██████      ████  █████      █████
██████       █████      ████  █████      █████
█████        █████      ████  █████      █████
█████        █████      ████  █████      █████
████         █████      ████  █████      █████
████         █████      ████  █████      █████
████         █████     █████  █████      █████   ████
████         ██████████████   █████      █████  ██████
████           ███████████    █████      █████  ██████
 ██              ███████       ███        ███    ████
                                                
████                                       █████
████                                       █████
████████████████████████████████████████████████
████████████████████████████████████████████████
 ██████████████████████████████████████████████`;

export const RunboxLog: React.FC<RunboxLogProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`font-mono text-[8px] sm:text-[10px] md:text-xs leading-[1.1] whitespace-pre font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#d97757] via-[#d97757] to-[#d97757]/40 ${className}`}
      aria-hidden="true"
    >
      {ASCII_ART}
    </motion.div>
  );
};
