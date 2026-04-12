import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export type ConfirmModalTone = 'default' | 'danger';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  tone?: ConfirmModalTone;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = 'default',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  const confirmButtonTone =
    tone === 'danger'
      ? 'bg-[#d97757] hover:bg-[#c76547] focus-visible:ring-[#d97757]/60'
      : 'bg-[#6a9bcc] hover:bg-[#5a88b6] focus-visible:ring-[#6a9bcc]/60';

  const iconTone = tone === 'danger' ? 'text-[#d97757] bg-[#d97757]/12' : 'text-[#6a9bcc] bg-[#6a9bcc]/12';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] bg-black/65 backdrop-blur-[2px] p-4 flex items-center justify-center"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="w-full max-w-md rounded-2xl border border-[#b0aea5]/15 bg-[#141413] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-5 pb-3 flex items-start gap-3">
              <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconTone}`}>
                <AlertTriangle className="w-4.5 h-4.5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-poppins font-medium text-[#faf9f5] tracking-tight">{title}</h3>
                <p className="mt-1 text-sm text-[#b0aea5] whitespace-pre-line leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="px-6 pb-5 pt-2 flex items-center justify-end gap-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="px-4 py-2 rounded-full border border-[#b0aea5]/20 text-sm font-poppins text-[#b0aea5] hover:text-[#faf9f5] hover:border-[#b0aea5]/35 transition-colors cursor-pointer"
              >
                {cancelLabel}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className={`px-4 py-2 rounded-full text-sm font-poppins font-medium text-[#faf9f5] transition-colors focus:outline-none focus-visible:ring-2 cursor-pointer ${confirmButtonTone}`}
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
