import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import BrandLogo from './BrandLogo';

const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#141413] backdrop-blur-md"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <div className="relative flex items-center justify-center mb-10">
          {/* Subtle pulse behind the logo */}
          <motion.div
            className="absolute inset-[-30px] rounded-full bg-[#d97757]/10 blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-15px] rounded-full border border-dashed border-[#b0aea5]/20"
          />
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-25px] rounded-full border border-[#d97757]/20"
          />

          <motion.div
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 p-4 bg-[#1e1e1d]/80 rounded-2xl border border-[#b0aea5]/10 shadow-[0_0_30px_rgba(217,119,87,0.15)] backdrop-blur-xl"
          >
            <BrandLogo className="w-12 h-12 text-[#d97757]" />
          </motion.div>
        </div>

        <motion.div className="flex flex-col items-center gap-3">
          <motion.h2
            className="text-2xl md:text-3xl font-poppins font-medium tracking-tight text-[#faf9f5]"
          >
            Runboxjs
          </motion.h2>

          <div className="flex items-center gap-3">
            <motion.div
              className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#d97757]/50"
            />
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#b0aea5] font-lora text-sm tracking-wide uppercase"
            >
              {t('loading.text')}
            </motion.p>
            <motion.div
              className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#d97757]/50"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
