import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#141413] backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative flex items-center justify-center w-24 h-24 mb-8">
          {/* Animated rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#d97757] opacity-80"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-b-2 border-l-2 border-[#6a9bcc] opacity-60"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-t-2 border-l-2 border-[#788c5d] opacity-40"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
          
          <Terminal className="w-8 h-8 text-[#faf9f5] relative z-10" />
        </div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-poppins font-medium tracking-tight text-[#faf9f5] mb-2"
        >
          RunboxJS
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-[#b0aea5] font-lora text-sm animate-pulse"
        >
          {t('loading.text')}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
