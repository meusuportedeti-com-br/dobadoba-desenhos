import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Heart, Volume2 } from 'lucide-react';
import { AssistantType } from '../types';
import { playPopSound, playPetSound } from '../utils/audio';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssistant: AssistantType;
  onSelectAssistant: (assistant: AssistantType) => void;
}

export const AssistantModal: React.FC<AssistantModalProps> = ({
  isOpen,
  onClose,
  selectedAssistant,
  onSelectAssistant,
}) => {
  if (!isOpen) return null;

  const handleSelect = (type: AssistantType) => {
    playPopSound();
    playPetSound(type);
    onSelectAssistant(type);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border-4 border-amber-300 relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md text-white">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  Escolha seu Assistente
                </h2>
                <p className="text-xs sm:text-sm font-bold text-amber-600">
                  Um amiguinho animado para acompanhar seus desenhos!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cards Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3 overflow-y-auto p-1 max-h-[60vh]">
            {/* 1. Coelho (Rabbit) */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect('rabbit')}
              className={`relative rounded-2xl p-2.5 sm:p-3 border-4 cursor-pointer transition-all flex flex-col items-center text-center shadow-md ${
                selectedAssistant === 'rabbit'
                  ? 'border-indigo-500 bg-indigo-50/90 shadow-indigo-200 ring-2 ring-indigo-400'
                  : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white'
              }`}
            >
              {selectedAssistant === 'rabbit' && (
                <div className="absolute top-1.5 right-1.5 bg-indigo-600 text-white p-1 rounded-full shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Rabbit SVG Graphic */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center my-1">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  <circle cx="82" cy="72" r="9" fill="#111827" />
                  <ellipse cx="40" cy="22" rx="7" ry="20" fill="#111827" transform="rotate(-10 40 22)" />
                  <ellipse cx="40" cy="22" rx="4" ry="15" fill="#F472B6" transform="rotate(-10 40 22)" />
                  <ellipse cx="60" cy="22" rx="7" ry="20" fill="#111827" transform="rotate(10 60 22)" />
                  <ellipse cx="60" cy="22" rx="4" ry="15" fill="#F472B6" transform="rotate(10 60 22)" />
                  <ellipse cx="50" cy="65" rx="28" ry="22" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
                  <circle cx="50" cy="45" r="22" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
                  <circle cx="42" cy="42" r="5" fill="#1E293B" />
                  <circle cx="58" cy="42" r="5" fill="#1E293B" />
                  <circle cx="43.5" cy="40.5" r="2" fill="#FFFFFF" />
                  <circle cx="59.5" cy="40.5" r="2" fill="#FFFFFF" />
                  <circle cx="36" cy="48" r="4" fill="#F472B6" opacity="0.6" />
                  <circle cx="64" cy="48" r="4" fill="#F472B6" opacity="0.6" />
                  <polygon points="50,46 47,50 53,50" fill="#000000" />
                  <circle cx="38" cy="82" r="6" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
                  <circle cx="62" cy="82" r="6" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
                </svg>
              </div>

              <span className="font-black text-slate-800 text-xs sm:text-sm mt-1">
                Coelho Rabicho
              </span>
            </motion.div>

            {/* 2. Gato (Cat) */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect('cat')}
              className={`relative rounded-2xl p-2.5 sm:p-3 border-4 cursor-pointer transition-all flex flex-col items-center text-center shadow-md ${
                selectedAssistant === 'cat'
                  ? 'border-purple-500 bg-purple-50/90 shadow-purple-200 ring-2 ring-purple-400'
                  : 'border-slate-200 bg-slate-50 hover:border-purple-300 hover:bg-white'
              }`}
            >
              {selectedAssistant === 'cat' && (
                <div className="absolute top-1.5 right-1.5 bg-purple-600 text-white p-1 rounded-full shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Cat SVG Graphic */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center my-1">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  <path d="M 72 65 C 88 60, 88 35, 78 30" fill="none" stroke="#18181B" strokeWidth="7" strokeLinecap="round" />
                  <polygon points="32,28 30,12 47,24" fill="#18181B" />
                  <polygon points="53,24 70,12 68,28" fill="#18181B" />
                  <ellipse cx="50" cy="65" rx="25" ry="20" fill="#18181B" />
                  <circle cx="50" cy="42" r="21" fill="#18181B" />
                  <polygon points="35,24 33,16 43,23" fill="#EC4899" />
                  <polygon points="57,23 67,16 65,24" fill="#EC4899" />
                  <ellipse cx="41" cy="40" rx="5" ry="6" fill="#FACC15" />
                  <ellipse cx="59" cy="40" rx="5" ry="6" fill="#FACC15" />
                  <ellipse cx="41" cy="40" rx="2" ry="4" fill="#000000" />
                  <ellipse cx="59" cy="40" rx="2" ry="4" fill="#000000" />
                  <circle cx="42.5" cy="38" r="1.5" fill="#FFFFFF" />
                  <circle cx="60.5" cy="38" r="1.5" fill="#FFFFFF" />
                  <polygon points="50,47 47,50 53,50" fill="#EC4899" />
                  <line x1="28" y1="46" x2="18" y2="44" stroke="#E4E4E7" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="28" y1="49" x2="16" y2="50" stroke="#E4E4E7" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="72" y1="46" x2="82" y2="44" stroke="#E4E4E7" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="72" y1="49" x2="84" y2="50" stroke="#E4E4E7" strokeWidth="1.5" strokeLinecap="round" />
                  <ellipse cx="38" cy="82" rx="6" ry="4" fill="#27272A" />
                  <ellipse cx="62" cy="82" rx="6" ry="4" fill="#27272A" />
                </svg>
              </div>

              <span className="font-black text-slate-800 text-xs sm:text-sm mt-1">
                Gata Mimi
              </span>
            </motion.div>

            {/* 3. Cachorro (Dog) */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect('dog')}
              className={`relative rounded-2xl p-2.5 sm:p-3 border-4 cursor-pointer transition-all flex flex-col items-center text-center shadow-md ${
                selectedAssistant === 'dog'
                  ? 'border-orange-500 bg-orange-50/90 shadow-orange-200 ring-2 ring-orange-400'
                  : 'border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-white'
              }`}
            >
              {selectedAssistant === 'dog' && (
                <div className="absolute top-1.5 right-1.5 bg-orange-600 text-white p-1 rounded-full shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Dog SVG Graphic */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center my-1">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  <path d="M 72 65 C 82 58, 86 42, 80 35" fill="none" stroke="#F97316" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="80" cy="35" r="4" fill="#FFFFFF" />
                  <ellipse cx="26" cy="40" rx="9" ry="18" fill="#C2410C" transform="rotate(20 26 40)" />
                  <ellipse cx="74" cy="40" rx="9" ry="18" fill="#C2410C" transform="rotate(-20 74 40)" />
                  <ellipse cx="50" cy="65" rx="26" ry="20" fill="#F97316" />
                  <ellipse cx="50" cy="68" rx="14" ry="13" fill="#FFEDD5" />
                  <circle cx="50" cy="42" r="22" fill="#F97316" />
                  <ellipse cx="50" cy="48" rx="12" ry="8" fill="#FFEDD5" />
                  <ellipse cx="50" cy="44" rx="4" ry="3" fill="#000000" />
                  <circle cx="41" cy="38" r="4" fill="#1E293B" />
                  <circle cx="59" cy="38" r="4" fill="#1E293B" />
                  <circle cx="42" cy="36.5" r="1.5" fill="#FFFFFF" />
                  <circle cx="60" cy="36.5" r="1.5" fill="#FFFFFF" />
                  <path d="M 47 52 Q 50 58 53 52 Z" fill="#F43F5E" />
                  <ellipse cx="38" cy="82" rx="6" ry="4" fill="#FFEDD5" />
                  <ellipse cx="62" cy="82" rx="6" ry="4" fill="#FFEDD5" />
                </svg>
              </div>

              <span className="font-black text-slate-800 text-xs sm:text-sm mt-1">
                Cachorro Caramelo
              </span>
            </motion.div>

            {/* 4. Cavalo Elegante (Horse) */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect('horse')}
              className={`relative rounded-2xl p-2.5 sm:p-3 border-4 cursor-pointer transition-all flex flex-col items-center text-center shadow-md ${
                selectedAssistant === 'horse'
                  ? 'border-amber-700 bg-amber-50/90 shadow-amber-200 ring-2 ring-amber-500'
                  : 'border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-white'
              }`}
            >
              {selectedAssistant === 'horse' && (
                <div className="absolute top-1.5 right-1.5 bg-amber-800 text-white p-1 rounded-full shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Horse SVG Graphic */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center my-1">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  {/* Tail */}
                  <path d="M 75 62 C 85 68, 88 82, 82 90" fill="none" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
                  {/* Ears */}
                  <polygon points="36,25 42,10 46,26" fill="#854D0E" />
                  <polygon points="54,26 58,10 64,25" fill="#854D0E" />
                  {/* Body & Neck */}
                  <ellipse cx="50" cy="68" rx="26" ry="18" fill="#B45309" />
                  <path d="M 38 45 L 45 28 L 58 28 L 62 48 Z" fill="#B45309" />
                  {/* Mane (Criniera elegante) */}
                  <path d="M 38 22 C 34 26, 32 38, 36 48" fill="none" stroke="#451A03" strokeWidth="5" strokeLinecap="round" />
                  {/* Head */}
                  <ellipse cx="50" cy="38" rx="15" ry="18" fill="#B45309" />
                  {/* Snout */}
                  <ellipse cx="50" cy="46" rx="10" ry="7" fill="#78350F" />
                  <circle cx="46" cy="46" r="2" fill="#1E293B" />
                  <circle cx="54" cy="46" r="2" fill="#1E293B" />
                  {/* Eyes */}
                  <circle cx="43" cy="34" r="3.5" fill="#1E293B" />
                  <circle cx="57" cy="34" r="3.5" fill="#1E293B" />
                  <circle cx="44" cy="33" r="1.2" fill="#FFFFFF" />
                  <circle cx="58" cy="33" r="1.2" fill="#FFFFFF" />
                  {/* Top Hat (Cartola Elegante) */}
                  <rect x="38" y="10" width="24" height="4" rx="2" fill="#0F172A" />
                  <rect x="42" y="1" width="16" height="10" rx="1" fill="#0F172A" />
                  <rect x="42" y="8" width="16" height="2" fill="#DC2626" />
                  {/* Bowtie */}
                  <polygon points="45,55 50,57 45,59" fill="#DC2626" />
                  <polygon points="55,55 50,57 55,59" fill="#DC2626" />
                  <circle cx="50" cy="57" r="2" fill="#991B1B" />
                </svg>
              </div>

              <span className="font-black text-slate-800 text-xs sm:text-sm mt-1">
                Cavalo Elegante
              </span>
            </motion.div>

            {/* 5. Tartaruga Samurai (Turtle) */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect('turtle')}
              className={`relative rounded-2xl p-2.5 sm:p-3 border-4 cursor-pointer transition-all flex flex-col items-center text-center shadow-md ${
                selectedAssistant === 'turtle'
                  ? 'border-emerald-600 bg-emerald-50/90 shadow-emerald-200 ring-2 ring-emerald-500'
                  : 'border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-white'
              }`}
            >
              {selectedAssistant === 'turtle' && (
                <div className="absolute top-1.5 right-1.5 bg-emerald-700 text-white p-1 rounded-full shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Turtle SVG Graphic */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center my-1">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  {/* Feet */}
                  <circle cx="28" cy="72" r="8" fill="#15803D" />
                  <circle cx="72" cy="72" r="8" fill="#15803D" />
                  <circle cx="28" cy="52" r="7" fill="#15803D" />
                  <circle cx="72" cy="52" r="7" fill="#15803D" />
                  {/* Shell (Casco Samurai) */}
                  <ellipse cx="50" cy="62" rx="28" ry="22" fill="#166534" stroke="#052E16" strokeWidth="2.5" />
                  {/* Shell pattern lines */}
                  <polygon points="50,45 62,54 62,68 50,76 38,68 38,54" fill="#22C55E" opacity="0.4" />
                  {/* Head */}
                  <circle cx="50" cy="35" r="18" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
                  {/* Red Samurai Headband (Faixa) */}
                  <rect x="31" y="30" width="38" height="8" rx="3" fill="#DC2626" />
                  <path d="M 68 33 Q 80 30 82 40" fill="none" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 68 35 Q 78 42 75 50" fill="none" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
                  {/* Eyes over headband */}
                  <circle cx="43" cy="34" r="3.5" fill="#FFFFFF" />
                  <circle cx="57" cy="34" r="3.5" fill="#FFFFFF" />
                  <circle cx="43" cy="34" r="2" fill="#000000" />
                  <circle cx="57" cy="34" r="2" fill="#000000" />
                  {/* Cute Smile */}
                  <path d="M 46 44 Q 50 48 54 44" fill="none" stroke="#052E16" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <span className="font-black text-slate-800 text-xs sm:text-sm mt-1">
                Tartaruga Samurai
              </span>
            </motion.div>

            {/* 6. Peixe Nemo (Fish) */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect('fish')}
              className={`relative rounded-2xl p-2.5 sm:p-3 border-4 cursor-pointer transition-all flex flex-col items-center text-center shadow-md ${
                selectedAssistant === 'fish'
                  ? 'border-cyan-500 bg-cyan-50/90 shadow-cyan-200 ring-2 ring-cyan-400'
                  : 'border-slate-200 bg-slate-50 hover:border-cyan-300 hover:bg-white'
              }`}
            >
              {selectedAssistant === 'fish' && (
                <div className="absolute top-1.5 right-1.5 bg-cyan-600 text-white p-1 rounded-full shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Fish SVG Graphic */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center my-1">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  {/* Tail Fin */}
                  <polygon points="70,50 88,32 88,68" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
                  <polygon points="76,50 88,38 88,62" fill="#FFFFFF" opacity="0.6" />
                  {/* Dorsal Fin */}
                  <path d="M 40 32 Q 55 18 65 34" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
                  {/* Main Body */}
                  <ellipse cx="48" cy="50" rx="28" ry="20" fill="#F97316" stroke="#7C2D12" strokeWidth="2" />
                  {/* White Stripes (Nemo Clownfish) */}
                  <path d="M 38 31 Q 35 50 38 69" fill="none" stroke="#FFFFFF" strokeWidth="7" />
                  <path d="M 38 31 Q 35 50 38 69" fill="none" stroke="#000000" strokeWidth="1" />
                  <path d="M 56 31 Q 53 50 56 69" fill="none" stroke="#FFFFFF" strokeWidth="6" />
                  {/* Big Eyes */}
                  <circle cx="32" cy="44" r="6" fill="#FFFFFF" />
                  <circle cx="32" cy="44" r="3.5" fill="#000000" />
                  <circle cx="33.5" cy="42" r="1.5" fill="#FFFFFF" />
                  {/* Pectoral Fin */}
                  <path d="M 44 54 Q 38 64 48 62" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
                  {/* Water Bubbles */}
                  <circle cx="18" cy="35" r="3" fill="#38BDF8" opacity="0.7" />
                  <circle cx="12" cy="24" r="2" fill="#38BDF8" opacity="0.7" />
                </svg>
              </div>

              <span className="font-black text-slate-800 text-xs sm:text-sm mt-1">
                Peixe Nemo
              </span>
            </motion.div>

            {/* 7. Capivara Tranquila (Capybara) */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect('capybara')}
              className={`relative rounded-2xl p-2.5 sm:p-3 border-4 cursor-pointer transition-all flex flex-col items-center text-center shadow-md ${
                selectedAssistant === 'capybara'
                  ? 'border-yellow-600 bg-yellow-50/90 shadow-yellow-200 ring-2 ring-yellow-500'
                  : 'border-slate-200 bg-slate-50 hover:border-yellow-300 hover:bg-white'
              }`}
            >
              {selectedAssistant === 'capybara' && (
                <div className="absolute top-1.5 right-1.5 bg-yellow-700 text-white p-1 rounded-full shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Capybara SVG Graphic */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center my-1">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  {/* Small round ears */}
                  <circle cx="35" cy="30" r="5" fill="#78350F" />
                  <circle cx="65" cy="30" r="5" fill="#78350F" />
                  {/* Body */}
                  <ellipse cx="50" cy="65" rx="30" ry="22" fill="#A16207" />
                  {/* Head (Squarish cute capybara head) */}
                  <rect x="32" y="32" width="36" height="32" rx="14" fill="#A16207" />
                  {/* Snout */}
                  <rect x="36" y="46" width="28" height="16" rx="8" fill="#78350F" />
                  <ellipse cx="44" cy="52" rx="2" ry="3" fill="#1E293B" />
                  <ellipse cx="56" cy="52" rx="2" ry="3" fill="#1E293B" />
                  {/* Calm closed eyes ^ ^ */}
                  <path d="M 40 40 Q 43 36 46 40" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 54 40 Q 57 36 60 40" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Orange on head (Bergamota / Mexerica) */}
                  <circle cx="50" cy="24" r="8" fill="#F97316" stroke="#C2410C" strokeWidth="1" />
                  <path d="M 50 16 Q 54 12 56 16" fill="#22C55E" />
                  {/* Paws */}
                  <ellipse cx="38" cy="84" rx="6" ry="4" fill="#78350F" />
                  <ellipse cx="62" cy="84" rx="6" ry="4" fill="#78350F" />
                </svg>
              </div>

              <span className="font-black text-slate-800 text-xs sm:text-sm mt-1">
                Capivara Tranquila
              </span>
            </motion.div>

            {/* 8. Nenhum (None) */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect('none')}
              className={`relative rounded-2xl p-2.5 sm:p-3 border-4 cursor-pointer transition-all flex flex-col items-center justify-center text-center shadow-md ${
                selectedAssistant === 'none'
                  ? 'border-slate-500 bg-slate-200 shadow-slate-300 ring-2 ring-slate-400'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {selectedAssistant === 'none' && (
                <div className="absolute top-1.5 right-1.5 bg-slate-700 text-white p-1 rounded-full shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200/80 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center my-1 text-slate-500">
                <span className="text-xl font-black">🚫</span>
              </div>

              <span className="font-black text-slate-800 text-xs sm:text-sm mt-1">
                Nenhum
              </span>
            </motion.div>
          </div>

          {/* Footer Action */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 font-extrabold text-sm sm:text-base shadow-lg border-2 border-amber-300 cursor-pointer"
            >
              Confirmar & Voltar
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
