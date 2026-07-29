import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Download, Copy, Printer, Check, X, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFanfareSound, playPopSound } from '../utils/audio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageDataUrl: string | null;
  artworkTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  imageDataUrl,
  artworkTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen || !imageDataUrl) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleDownload = () => {
    playPopSound();
    triggerConfetti();

    const link = document.createElement('a');
    link.download = `${artworkTitle.replace(/\s+/g, '_')}_DobaDoba.png`;
    link.href = imageDataUrl;
    link.click();
  };

  const handleWebShare = async () => {
    playPopSound();
    try {
      // Convert base64 dataUrl to blob/file for native Web Share API
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${artworkTitle}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Arte de ${artworkTitle} - DobaDoba Desenhos`,
          text: `Olha só a arte incrível criada no DobaDoba Desenhos! 🎨✨`,
          files: [file],
        });
        setShareSuccess(true);
        triggerConfetti();
        playFanfareSound();
      } else if (navigator.share) {
        await navigator.share({
          title: `DobaDoba Desenhos - ${artworkTitle}`,
          text: `Olha só a arte incrível criada no DobaDoba Desenhos! 🎨✨`,
          url: window.location.href,
        });
        setShareSuccess(true);
        triggerConfetti();
      } else {
        handleDownload();
      }
    } catch (err) {
      console.log('Share canceled or error:', err);
    }
  };

  const handleCopy = async () => {
    playPopSound();
    try {
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      triggerConfetti();
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy image:', err);
      // Fallback: copy link or trigger download
      handleDownload();
    }
  };

  const handlePrint = () => {
    playPopSound();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${artworkTitle} - DobaDoba Desenhos</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background: #fff; }
            img { max-width: 95%; max-height: 95vh; object-fit: contain; border: 4px solid #f59e0b; border-radius: 16px; }
          </style>
        </head>
        <body>
          <img src="${imageDataUrl}" />
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-300 flex flex-col items-center relative"
        >
          {/* Close button */}
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-4">
            <span className="text-4xl inline-block mb-1">🎉</span>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Compartilhar Arte!
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold">
              Mostre essa obra-prima para a vovó, vovô, família e amigos!
            </p>
          </div>

          {/* Artwork Preview Card */}
          <div className="w-full max-h-64 rounded-2xl border-4 border-amber-300 bg-amber-50 p-2 shadow-md overflow-hidden flex items-center justify-center my-2">
            <img
              src={imageDataUrl}
              alt={artworkTitle}
              className="max-h-full max-w-full object-contain rounded-xl"
            />
          </div>

          {/* Share Actions */}
          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            <button
              onClick={handleWebShare}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/30 col-span-2"
            >
              <Share2 className="w-5 h-5" />
              <span>COMPARTILHAR COM A FAMÍLIA ✨</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-3 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Foto (PNG)</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Imagem</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-600/20 col-span-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Desenho na Impressora 🖨️</span>
            </button>
          </div>

          {shareSuccess && (
            <div className="mt-3 text-emerald-600 font-bold text-xs flex items-center gap-1">
              <Heart className="w-4 h-4 fill-emerald-500" />
              <span>Arte compartilhada com sucesso!</span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
