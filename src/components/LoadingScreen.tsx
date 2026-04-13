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
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#141413] backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <div className="relative flex items-center justify-center w-28 h-28 mb-8">
          <motion.div
            className="absolute inset-0 rounded-full bg-[#d97757]/15 blur-xl"
            animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border border-[#d97757]/40"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <BrandLogo className="w-14 h-14" />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="text-2xl font-poppins font-medium tracking-tight text-[#faf9f5] mb-3"
        >
          Runboxjs
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="flex items-center gap-2 mb-3"
        >
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="w-1.5 h-1.5 rounded-full bg-[#d97757]"
              animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.12, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="text-[#b0aea5] font-lora text-sm"
        >
          {t('loading.text')}
        </motion.p>

        <motion.div
          className="mt-5 h-0.5 w-44 bg-[#1e1e1d] rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <motion.span
            className="block h-full w-1/3 rounded-full bg-[#d97757]"
            animate={{ x: ['-120%', '260%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
