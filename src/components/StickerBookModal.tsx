import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Sparkles, BookOpen, Heart, Plus, Check } from 'lucide-react';
import { STICKER_LIBRARY, STICKER_CATEGORIES, StickerItem } from '../data/stickers';
import { playPopSound } from '../utils/audio';

interface StickerBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSticker: (emoji: string) => void;
}

export const StickerBookModal: React.FC<StickerBookModalProps> = ({
  isOpen,
  onClose,
  onAddSticker,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedStickerId, setAddedStickerId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter stickers by category & search query
  const filteredStickers = STICKER_LIBRARY.filter((item) => {
    const matchesCategory =
      selectedCategory === 'todos' || item.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleStickerClick = (sticker: StickerItem) => {
    playPopSound();
    onAddSticker(sticker.emoji);
    setAddedStickerId(sticker.id);

    // Show temporary checkmark feedback
    setTimeout(() => {
      setAddedStickerId(null);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-900/75 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl w-full max-w-5xl h-full max-h-[95vh] flex flex-col shadow-2xl border-4 border-pink-400 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 p-4 sm:p-6 text-white flex items-center justify-between border-b-4 border-pink-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/40">
                📖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-wide">
                    Livro de Adesivos
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider">
                    500 Adesivos
                  </span>
                </div>
                <p className="text-pink-100 text-xs sm:text-sm font-medium">
                  Escolha um adesivo fofo para colar na sua pintura! ✨
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold cursor-pointer transition-transform active:scale-90"
              title="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="p-4 bg-pink-50/60 border-b border-pink-100 flex flex-col gap-3">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar adesivo..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-slate-700 font-semibold text-sm placeholder-slate-400 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-full p-1"
                  title="Limpar"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {STICKER_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playPopSound();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-2xl font-extrabold text-xs whitespace-nowrap flex items-center gap-1.5 cursor-pointer border-2 transition-all ${
                      isActive
                        ? 'bg-pink-500 text-white border-pink-400 shadow-md scale-105'
                        : 'bg-white text-slate-600 border-pink-200 hover:bg-pink-100'
                    }`}
                    title={cat.label}
                  >
                    <span className="text-base">{cat.icon}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stickers Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-gradient-to-b from-pink-50/30 to-amber-50/30">
            {filteredStickers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <span className="text-5xl mb-3">🔍</span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('todos');
                  }}
                  className="mt-4 p-3 rounded-2xl bg-pink-400 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                  title="Ver Todos"
                >
                  <BookOpen className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                {filteredStickers.map((sticker) => {
                  const isRecentlyAdded = addedStickerId === sticker.id;
                  return (
                    <motion.button
                      key={sticker.id}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleStickerClick(sticker)}
                      className={`relative bg-white rounded-2xl p-2 sm:p-3 shadow-xs hover:shadow-md border-2 transition-all flex flex-col items-center justify-center cursor-pointer aspect-square ${
                        isRecentlyAdded
                          ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300'
                          : 'border-pink-100 hover:border-pink-300'
                      }`}
                      title={sticker.name}
                    >
                      {/* Emoji Display */}
                      <div className="text-4xl sm:text-5xl select-none">
                        {sticker.emoji}
                      </div>

                      {/* Icon overlay badge */}
                      <div className={`absolute bottom-1 right-1 p-1 rounded-full text-white ${
                        isRecentlyAdded ? 'bg-emerald-500' : 'bg-pink-400/80'
                      }`}>
                        {isRecentlyAdded ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="p-3 bg-white border-t border-pink-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-pink-600 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Toque em qualquer adesivo para colar na pintura!</span>
            </div>
            <button
              onClick={() => {
                playPopSound();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black shadow-md cursor-pointer transition-transform active:scale-95"
              title="Concluído / Fechar"
            >
              <Check className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
