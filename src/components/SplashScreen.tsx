import React from 'react';
import { motion } from 'motion/react';
import { Plus, LayoutGrid, Heart, Sparkles, Paintbrush, Images, Bot, Smile } from 'lucide-react';
import { playPopSound } from '../utils/audio';
import { AppLogo } from './AppLogo';
import { AssistantType } from '../types';
import { SaoPauloWeatherBackground } from './SaoPauloWeatherBackground';

interface SplashScreenProps {
  onNewBlankDrawing: () => void;
  onOpenThemeSelector: () => void;
  onOpenSavedArtworks: () => void;
  onOpenAssistantSelector: () => void;
  selectedAssistant?: AssistantType;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onNewBlankDrawing,
  onOpenThemeSelector,
  onOpenSavedArtworks,
  onOpenAssistantSelector,
  selectedAssistant = 'none',
}) => {
  const getAssistantBadge = () => {
    switch (selectedAssistant) {
      case 'rabbit':
        return '🐰 Coelho Rabicho';
      case 'cat':
        return '🐱 Gata Mimi';
      case 'dog':
        return '🐶 Cachorro Caramelo';
      default:
        return 'Nenhum';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Dynamic blurred weather illustration background of São Paulo */}
      <SaoPauloWeatherBackground />

      <div className="max-w-lg w-full bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-amber-300 text-center relative flex flex-col items-center z-10">
        {/* App Logo */}
        <div className="mb-4">
          <AppLogo size="lg" showSubtitle={true} />
        </div>

        {/* 4 Main Action Icon Buttons: Novo Desenho, Colorir, Minhas Obras, Assistente */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 my-3">
          {/* 1. Novo Desenho */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playPopSound();
                onNewBlankDrawing();
              }}
              className="aspect-square w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-amber-950 p-2.5 sm:p-3 shadow-xl border-4 border-amber-300 cursor-pointer flex flex-col items-center justify-center relative group transition-transform"
              title="Novo Desenho"
            >
              <div className="relative flex items-center justify-center">
                <Plus className="w-9 h-9 sm:w-11 sm:h-11 stroke-[3] text-amber-950 drop-shadow-xs" />
                <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5 absolute -bottom-1 -right-1 text-white fill-amber-950 drop-shadow-md" />
              </div>
            </motion.button>
            <span className="text-[11px] sm:text-xs font-black text-slate-700 tracking-tight">
              Novo Desenho
            </span>
          </div>

          {/* 2. Galeria para Colorir */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playPopSound();
                onOpenThemeSelector();
              }}
              className="aspect-square w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 text-white p-2.5 sm:p-3 shadow-xl border-4 border-teal-300 cursor-pointer flex flex-col items-center justify-center relative group transition-transform"
              title="Colorir Desenhos"
            >
              <div className="relative flex items-center justify-center">
                <LayoutGrid className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.5] text-white drop-shadow-xs" />
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 absolute -top-1 -right-1 text-yellow-300 fill-yellow-300 animate-pulse" />
              </div>
            </motion.button>
            <span className="text-[11px] sm:text-xs font-black text-slate-700 tracking-tight">
              Colorir
            </span>
          </div>

          {/* 3. Minhas Obras de Arte */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playPopSound();
                onOpenSavedArtworks();
              }}
              className="aspect-square w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white p-2.5 sm:p-3 shadow-xl border-4 border-pink-300 cursor-pointer flex flex-col items-center justify-center relative group transition-transform"
              title="Minhas Obras de Arte"
            >
              <div className="relative flex items-center justify-center">
                <Images className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.5] text-white drop-shadow-xs" />
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 absolute -bottom-1 -right-1 text-rose-300 fill-rose-300 drop-shadow-md" />
              </div>
            </motion.button>
            <span className="text-[11px] sm:text-xs font-black text-slate-700 tracking-tight">
              Minhas Artes
            </span>
          </div>

          {/* 4. Assistente (Novo Botão!) */}
          <div className="flex flex-col items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playPopSound();
                onOpenAssistantSelector();
              }}
              className="aspect-square w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 text-white p-2.5 sm:p-3 shadow-xl border-4 border-indigo-300 cursor-pointer flex flex-col items-center justify-center relative group transition-transform"
              title="Escolher Assistente"
            >
              <div className="relative flex items-center justify-center">
                <Smile className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.5] text-yellow-300 drop-shadow-xs" />
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 absolute -top-1 -right-1 text-amber-300 fill-amber-300 animate-bounce" />
              </div>
            </motion.button>
            <span className="text-[11px] sm:text-xs font-black text-indigo-700 tracking-tight flex items-center gap-1">
              Assistente
            </span>
          </div>
        </div>

        {/* Active Assistant Status Banner */}
        <div
          onClick={onOpenAssistantSelector}
          className="mt-2 py-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl cursor-pointer transition-colors flex items-center gap-2 text-xs font-bold text-amber-900 w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Mascote atual: <strong className="text-amber-950 font-black">{getAssistantBadge()}</strong></span>
          </div>
          <span className="text-[10px] text-amber-600 underline">alterar</span>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 w-full text-center text-xs text-slate-500 flex flex-col items-center gap-1.5">
          <p className="font-medium text-slate-600">
            Desenvolvido por{' '}
            <a
              href="https://meusuportedeti.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-800 hover:text-amber-600 underline"
            >
              meusuportedeti.com.br
            </a>
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=5511969264607&text=Oi,%20eu%20estou%20no%20app%20DobaDoba%20Desenhos,%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition-colors shadow-2xs"
          >
            <span>WhatsApp +55 (11) 969-264-607</span>
          </a>
        </div>
      </div>
    </div>
  );
};

