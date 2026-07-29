import React, { useState } from 'react';
import { X, ExternalLink, Megaphone } from 'lucide-react';

interface TopAdBannerProps {
  onClose?: () => void;
}

/**
 * Componente de Anúncio / Banner Superior (Top Ad Banner)
 * 
 * PARA INTEGRAÇÃO COM GOOGLE ADSENSE:
 * 1. Substitua o conteúdo deste componente pelo seu código da unidade de anúncios AdSense, por exemplo:
 *    <ins className="adsbygoogle"
 *         style={{ display: 'block' }}
 *         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *         data-ad-slot="1234567890"
 *         data-ad-format="auto"
 *         data-full-width-responsive="true"></ins>
 * 2. No arquivo index.html, inclua a tag do Google AdSense:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
 */
export const TopAdBanner: React.FC<TopAdBannerProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white px-3 py-1.5 flex items-center justify-between text-xs sm:text-sm border-b border-indigo-500/30 shadow-xs flex-shrink-0 z-40 select-none">
      <div className="flex items-center gap-2 overflow-hidden mx-auto">
        <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0">
          Anúncio
        </span>
        <div className="flex items-center gap-1.5 font-semibold text-indigo-100 truncate">
          <Megaphone className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 animate-bounce" />
          <span className="truncate">
            DobaDoba Desenhos - Espaço para Anúncios & Patrocinadores
          </span>
        </div>
      </div>

      <button
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className="p-1 rounded-lg hover:bg-white/10 text-indigo-200 hover:text-white cursor-pointer transition-colors flex-shrink-0 ml-2"
        title="Ocultar anúncio"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
