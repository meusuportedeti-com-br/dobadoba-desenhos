import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shapes, Check, Search } from 'lucide-react';
import { playPopSound } from '../utils/audio';

export interface GeometricShapeItem {
  id: string;
  name: string;
  emoji: string;
  category: 'circulos' | 'quadrados' | 'triangulos' | 'estrelas' | 'poligonos';
  categoryLabel: string;
}

export const GEOMETRIC_SHAPES_LIBRARY: GeometricShapeItem[] = [
  // Círculos
  { id: 'c1', name: 'Círculo Vermelho', emoji: '🔴', category: 'circulos', categoryLabel: 'Círculos' },
  { id: 'c2', name: 'Círculo Azul', emoji: '🔵', category: 'circulos', categoryLabel: 'Círculos' },
  { id: 'c3', name: 'Círculo Amarelo', emoji: '🟡', category: 'circulos', categoryLabel: 'Círculos' },
  { id: 'c4', name: 'Círculo Verde', emoji: '🟢', category: 'circulos', categoryLabel: 'Círculos' },
  { id: 'c5', name: 'Círculo Roxo', emoji: '🟣', category: 'circulos', categoryLabel: 'Círculos' },
  { id: 'c6', name: 'Círculo Laranja', emoji: '🟠', category: 'circulos', categoryLabel: 'Círculos' },
  { id: 'c7', name: 'Círculo Branco', emoji: '⚪️', category: 'circulos', categoryLabel: 'Círculos' },
  { id: 'c8', name: 'Círculo Preto', emoji: '⚫️', category: 'circulos', categoryLabel: 'Círculos' },
  { id: 'c9', name: 'Anel Círculo', emoji: '⭕️', category: 'circulos', categoryLabel: 'Círculos' },
  { id: 'c10', name: 'Botão Redondo', emoji: '🔘', category: 'circulos', categoryLabel: 'Círculos' },

  // Quadrados & Retângulos
  { id: 'q1', name: 'Quadrado Laranja', emoji: '🟧', category: 'quadrados', categoryLabel: 'Quadrados' },
  { id: 'q2', name: 'Quadrado Azul', emoji: '🟦', category: 'quadrados', categoryLabel: 'Quadrados' },
  { id: 'q3', name: 'Quadrado Verde', emoji: '🟩', category: 'quadrados', categoryLabel: 'Quadrados' },
  { id: 'q4', name: 'Quadrado Roxo', emoji: '🟪', category: 'quadrados', categoryLabel: 'Quadrados' },
  { id: 'q5', name: 'Quadrado Vermelho', emoji: '🟥', category: 'quadrados', categoryLabel: 'Quadrados' },
  { id: 'q6', name: 'Quadrado Amarelo', emoji: '🟨', category: 'quadrados', categoryLabel: 'Quadrados' },
  { id: 'q7', name: 'Quadrado Branco', emoji: '⬜️', category: 'quadrados', categoryLabel: 'Quadrados' },
  { id: 'q8', name: 'Quadrado Preto', emoji: '⬛️', category: 'quadrados', categoryLabel: 'Quadrados' },
  { id: 'q9', name: 'Quadrado com Borda', emoji: '🔲', category: 'quadrados', categoryLabel: 'Quadrados' },
  { id: 'q10', name: 'Retângulo', emoji: '▭', category: 'quadrados', categoryLabel: 'Quadrados' },

  // Triângulos
  { id: 't1', name: 'Triângulo Vermelho', emoji: '🔺', category: 'triangulos', categoryLabel: 'Triângulos' },
  { id: 't2', name: 'Triângulo Invertido', emoji: '🔻', category: 'triangulos', categoryLabel: 'Triângulos' },
  { id: 't3', name: 'Esquadro', emoji: '📐', category: 'triangulos', categoryLabel: 'Triângulos' },
  { id: 't4', name: 'Triângulo Cima', emoji: '🔼', category: 'triangulos', categoryLabel: 'Triângulos' },
  { id: 't5', name: 'Triângulo Baixo', emoji: '🔽', category: 'triangulos', categoryLabel: 'Triângulos' },

  // Estrelas & Corações
  { id: 'e1', name: 'Estrela Dourada', emoji: '⭐️', category: 'estrelas', categoryLabel: 'Estrelas' },
  { id: 'e2', name: 'Estrela Brilhante', emoji: '🌟', category: 'estrelas', categoryLabel: 'Estrelas' },
  { id: 'e3', name: 'Brilhos Mágicos', emoji: '✨', category: 'estrelas', categoryLabel: 'Estrelas' },
  { id: 'e4', name: 'Estrela Cadente', emoji: '💫', category: 'estrelas', categoryLabel: 'Estrelas' },
  { id: 'e5', name: 'Coração Rosa', emoji: '💖', category: 'estrelas', categoryLabel: 'Estrelas' },
  { id: 'e6', name: 'Coração Vermelho', emoji: '❤️', category: 'estrelas', categoryLabel: 'Estrelas' },
  { id: 'e7', name: 'Coração Azul', emoji: '💙', category: 'estrelas', categoryLabel: 'Estrelas' },
  { id: 'e8', name: 'Coração Amarelo', emoji: '💛', category: 'estrelas', categoryLabel: 'Estrelas' },
  { id: 'e9', name: 'Coração Verde', emoji: '🟢', category: 'estrelas', categoryLabel: 'Estrelas' },
  { id: 'e10', name: 'Coração Roxo', emoji: '💜', category: 'estrelas', categoryLabel: 'Estrelas' },

  // Polígonos & Símbolos
  { id: 'p1', name: 'Losango Azul', emoji: '🔷', category: 'poligonos', categoryLabel: 'Polígonos' },
  { id: 'p2', name: 'Losango Laranja', emoji: '🔶', category: 'poligonos', categoryLabel: 'Polígonos' },
  { id: 'p3', name: 'Diamante', emoji: '💠', category: 'poligonos', categoryLabel: 'Polígonos' },
  { id: 'p4', name: 'Pentágono', emoji: '⬟', category: 'poligonos', categoryLabel: 'Polígonos' },
  { id: 'p5', name: 'Hexágono', emoji: '⬢', category: 'poligonos', categoryLabel: 'Polígonos' },
  { id: 'p6', name: 'Octógono Pare', emoji: '🛑', category: 'poligonos', categoryLabel: 'Polígonos' },
  { id: 'p7', name: 'Sinal Mais / Cruz', emoji: '➕', category: 'poligonos', categoryLabel: 'Polígonos' },
  { id: 'p8', name: 'Espiral', emoji: '🌀', category: 'poligonos', categoryLabel: 'Polígonos' },
];

interface GeometricShapesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShape: (emoji: string) => void;
}

export const GeometricShapesModal: React.FC<GeometricShapesModalProps> = ({
  isOpen,
  onClose,
  onAddShape,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedShapeId, setAddedShapeId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'todos', label: 'Todas', icon: '✨' },
    { id: 'circulos', label: 'Círculos', icon: '🔴' },
    { id: 'quadrados', label: 'Quadrados', icon: '🟧' },
    { id: 'triangulos', label: 'Triângulos', icon: '🔺' },
    { id: 'estrelas', label: 'Estrelas & Corações', icon: '⭐️' },
    { id: 'poligonos', label: 'Polígonos', icon: '🔷' },
  ];

  const filteredShapes = GEOMETRIC_SHAPES_LIBRARY.filter((item) => {
    const matchesCategory =
      selectedCategory === 'todos' || item.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleShapeClick = (shape: GeometricShapeItem) => {
    playPopSound();
    onAddShape(shape.emoji);
    setAddedShapeId(shape.id);

    setTimeout(() => {
      setAddedShapeId(null);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-hidden select-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl w-full max-w-4xl h-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-indigo-400 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-5 text-white flex items-center justify-between border-b-4 border-indigo-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl shadow-inner border border-white/40">
                📐
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-wide flex items-center gap-2">
                  Formas Geométricas
                </h2>
                <p className="text-indigo-100 text-xs sm:text-sm font-medium">
                  Toque em uma forma para colocar no seu desenho! ✨
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
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="p-3 bg-indigo-50/70 border-b border-indigo-100 flex flex-col gap-2.5 flex-shrink-0">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar forma..."
                className="w-full pl-11 pr-4 py-2 rounded-2xl bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none text-slate-700 font-semibold text-sm placeholder-slate-400 shadow-xs"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin flex-nowrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playPopSound();
                    setSelectedCategory(cat.id);
                  }}
                  className={`py-1.5 px-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 flex-shrink-0 border ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-105 ring-2 ring-indigo-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-100'
                  }`}
                  title={cat.label}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Shapes */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
            {filteredShapes.map((shape) => {
              const isJustAdded = addedShapeId === shape.id;
              return (
                <motion.button
                  key={shape.id}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleShapeClick(shape)}
                  className={`p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 border-2 cursor-pointer shadow-sm flex flex-col items-center justify-center gap-1.5 relative group transition-all ${
                    isJustAdded
                      ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-105'
                      : 'border-slate-200 hover:border-indigo-400 hover:shadow-md'
                  }`}
                  title={shape.name}
                >
                  <span className="text-4xl sm:text-5xl drop-shadow-xs group-hover:scale-110 transition-transform">
                    {shape.emoji}
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-600 line-clamp-1 text-center">
                    {shape.name}
                  </span>

                  {isJustAdded && (
                    <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md animate-bounce">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
