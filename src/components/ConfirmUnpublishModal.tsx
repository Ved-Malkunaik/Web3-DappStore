import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ConfirmUnpublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  dappName: string;
}

const ConfirmUnpublishModal: React.FC<ConfirmUnpublishModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isPending,
  dappName 
}) => {
  // Use Portal to prevent modal from being clipped by parent overflow-hidden
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl z-10"
          >
            <div className="p-10">
              <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 mb-8 mx-auto border border-red-500/20">
                <AlertTriangle size={40} />
              </div>

              <h2 className="text-3xl font-black text-center mb-3">Remove DApp?</h2>
              <p className="text-white/40 text-center text-sm mb-10 leading-relaxed px-4">
                Are you sure you want to unpublish <span className="text-white font-bold">"{dappName}"</span>? 
                It will be immediately removed from the marketplace.
              </p>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfirm();
                  }}
                  disabled={isPending}
                  className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-red-500/20"
                >
                  {isPending ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <X size={20} strokeWidth={3} />
                      <span>Yes, Unpublish</span>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  disabled={isPending}
                  className="w-full py-5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-bold rounded-2xl transition-all border border-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmUnpublishModal;
