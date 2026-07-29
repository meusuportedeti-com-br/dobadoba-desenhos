import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Paintbrush, Check } from 'lucide-react';
import { COLORING_THEMES } from '../data/themes';
import { ColoringTheme } from '../types';
import { playPopSound } from '../utils/audio';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (theme: ColoringTheme | null) => void;
  currentThemeId?: string;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectTheme,
  currentThemeId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  if (!isOpen) return null;

  const categories = [
    { id: 'Todas', label: 'Todas', icon: '✨' },
    { id: 'Festas', label: 'Festas', icon: '🎆' },
    { id: 'Natureza', label: 'Natureza', icon: '☀️' },
    { id: 'Animais', label: 'Animais', icon: '🐶' },
    { id: 'Aventura', label: 'Aventura', icon: '🚀' },
    { id: 'Fantasia', label: 'Fantasia', icon: '🦄' },
    { id: 'Diversão', label: 'Diversão', icon: '🎡' },
    { id: 'Pessoas', label: 'Pessoas', icon: '👧' },
    { id: 'Escola', label: 'Escola', icon: '🏫' },
    { id: 'Comida', label: 'Comida', icon: '🍦' },
    { id: 'Arte', label: 'Arte', icon: '🎨' },
  ];

  const filteredThemes = selectedCategory === 'Todas'
    ? COLORING_THEMES
    : COLORING_THEMES.filter(t => t.category === selectedCategory);

  const handleSelect = (theme: ColoringTheme | null) => {
    playPopSound();
    onSelectTheme(theme);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-5 bg-slate-900/80 backdrop-blur-md overflow-hidden select-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-6xl w-full h-full max-h-[96vh] p-3 sm:p-6 shadow-2xl border-4 border-amber-400 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl">🎨</span>
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                Temas
              </h2>
            </div>

            <button
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 flex items-center justify-center cursor-pointer transition-transform active:scale-95 border border-amber-300 shadow-xs"
              title="Fechar"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Top Options: Blank Canvas & Horizontally Scrollable Larger Category Icons */}
          <div className="my-3 flex items-center gap-3 overflow-x-auto py-2 px-1 scrollbar-thin flex-nowrap flex-shrink-0">
            {/* Blank Canvas Button */}
            <button
              onClick={() => handleSelect(null)}
              className={`p-3 sm:p-3.5 rounded-2xl border-2 font-black text-sm flex items-center gap-2.5 transition-all cursor-pointer flex-shrink-0 min-w-[56px] min-h-[56px] justify-center ${
                !currentThemeId
                  ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-lg ring-2 ring-amber-300 scale-105'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-amber-100 hover:border-amber-300'
              }`}
              title="Desenho Livre em Branco"
            >
              <Paintbrush className="w-6 h-6 sm:w-7 sm:h-7 text-amber-950 stroke-[3]" />
            </button>

            <div className="h-8 w-0.5 bg-slate-200 flex-shrink-0 my-auto" />

            {/* Category Chips with Icon & Label */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playPopSound();
                  setSelectedCategory(cat.id);
                }}
                className={`py-2 px-3.5 rounded-2xl font-extrabold text-sm whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 flex-shrink-0 border-2 shadow-xs ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md scale-105 ring-2 ring-indigo-300'
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 hover:scale-102'
                }`}
                title={cat.label}
              >
                <span className="text-xl sm:text-2xl drop-shadow-xs">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Theme Thumbnail Grid with Smooth Scrollable Viewport */}
          <div className="flex-1 overflow-y-auto pr-1 my-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 align-start auto-rows-max">
            {filteredThemes.map((theme) => {
              const isSelected = currentThemeId === theme.id;
              return (
                <motion.div
                  key={theme.id}
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(theme)}
                  style={{ backgroundColor: theme.pastelBg }}
                  className={`rounded-3xl p-3 sm:p-4 border-3 cursor-pointer shadow-md relative flex flex-col gap-2 transition-all group overflow-hidden ${
                    isSelected
                      ? 'border-indigo-600 ring-4 ring-indigo-300 shadow-xl'
                      : 'border-slate-200 hover:border-amber-400 hover:shadow-lg'
                  }`}
                  title={theme.title}
                >
                  {/* Emoji Badge Header */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-2xl sm:text-3xl drop-shadow-xs">{theme.iconEmoji}</span>
                    <span
                      className="text-xs font-black px-2.5 py-1 rounded-full border shadow-2xs truncate max-w-[140px]"
                      style={{
                        backgroundColor: theme.pastelFill,
                        borderColor: theme.pastelBorder,
                        color: '#374151',
                      }}
                    >
                      {theme.title}
                    </span>
                  </div>

                  {/* SVG Drawing Thumbnail Preview Box - Compact, zero gap above */}
                  <div
                    className="w-full h-44 sm:h-48 rounded-2xl border-2 overflow-hidden flex items-center justify-center p-2 bg-white relative shadow-inner group-hover:scale-[1.01] transition-transform"
                    style={{ borderColor: theme.pastelBorder }}
                  >
                    <svg
                      viewBox="0 0 800 500"
                      className="w-full h-full pointer-events-none object-contain"
                      dangerouslySetInnerHTML={{ __html: theme.svgContent }}
                    />

                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-2 shadow-lg">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
