import React from 'react';
import { motion } from 'motion/react';
import { Plus, Paintbrush, Share2, Trash2, ArrowLeft, LayoutGrid, Heart } from 'lucide-react';
import { SavedArtwork } from '../types';
import { COLORING_THEMES } from '../data/themes';
import { playPopSound } from '../utils/audio';

interface GalleryProps {
  savedArtworks: SavedArtwork[];
  onNewBlankDrawing: () => void;
  onOpenThemeSelector: () => void;
  onOpenSavedArtwork: (artwork: SavedArtwork) => void;
  onShareArtwork: (artwork: SavedArtwork) => void;
  onDeleteArtwork: (id: string) => void;
  onOpenSplash: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  savedArtworks,
  onNewBlankDrawing,
  onOpenThemeSelector,
  onOpenSavedArtwork,
  onShareArtwork,
  onDeleteArtwork,
  onOpenSplash,
}) => {
  return (
    <div className="w-full h-full flex-1 overflow-y-auto bg-gradient-to-br from-amber-50 via-pink-50 to-indigo-50 p-4 sm:p-6 flex flex-col items-center select-none">
      {/* Top Banner Header with Back Button */}
      <header className="w-full max-w-6xl flex items-center justify-between pb-4 border-b-2 border-amber-200 mb-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Back button to Home */}
          <button
            onClick={() => {
              playPopSound();
              onOpenSplash();
            }}
            className="p-2.5 sm:p-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black shadow-md border-2 border-amber-300 cursor-pointer flex items-center justify-center transition-transform active:scale-95"
            title="Voltar para a Tela Inicial"
          >
            <ArrowLeft className="w-6 h-6 stroke-[3]" />
          </button>

          <div className="flex items-center gap-2 ml-1">
            <span className="text-3xl sm:text-4xl">🎨</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Minhas Obras de Arte
            </h1>
          </div>
        </div>

        {/* Action Icon Buttons: New Drawing & Theme Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playPopSound();
              onNewBlankDrawing();
            }}
            className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-md border-2 border-emerald-300 cursor-pointer flex items-center justify-center transition-transform active:scale-95"
            title="Novo Desenho em Branco"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>

          <button
            onClick={() => {
              playPopSound();
              onOpenThemeSelector();
            }}
            className="p-2.5 sm:p-3 rounded-2xl bg-teal-400 hover:bg-teal-500 text-teal-950 font-black shadow-md border-2 border-teal-300 cursor-pointer flex items-center justify-center transition-transform active:scale-95"
            title="Galeria de Telas (100 Temas)"
          >
            <LayoutGrid className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Saved Artworks Grid Section */}
      <div className="w-full max-w-6xl flex-1 flex flex-col">
        {savedArtworks.length === 0 ? (
          <div className="flex-1 bg-white/80 backdrop-blur-md rounded-3xl p-8 border-4 border-dashed border-amber-300 flex flex-col items-center justify-center text-center my-4 min-h-[320px]">
            <div className="text-6xl mb-4 animate-bounce">🎨</div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  playPopSound();
                  onNewBlankDrawing();
                }}
                className="p-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-lg shadow-lg cursor-pointer flex items-center justify-center transition-transform active:scale-95 border-2 border-amber-300"
                title="Criar Novo Desenho em Branco"
              >
                <Plus className="w-8 h-8 stroke-[3]" />
              </button>

              <button
                onClick={() => {
                  playPopSound();
                  onOpenThemeSelector();
                }}
                className="p-4 rounded-2xl bg-teal-400 hover:bg-teal-500 text-teal-950 font-black text-lg shadow-lg cursor-pointer flex items-center justify-center transition-transform active:scale-95 border-2 border-teal-300"
                title="Escolher Tema para Colorir"
              >
                <LayoutGrid className="w-8 h-8 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedArtworks.map((art) => {
              const theme = COLORING_THEMES.find((t) => t.id === art.themeId);
              return (
                <motion.div
                  key={art.id}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl p-4 shadow-lg border-3 border-amber-200 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Artwork Image Card */}
                  <div
                    onClick={() => {
                      playPopSound();
                      onOpenSavedArtwork(art);
                    }}
                    className="w-full h-48 rounded-2xl border-2 border-amber-100 overflow-hidden bg-amber-50 cursor-pointer relative shadow-inner flex items-center justify-center mb-3"
                  >
                    <img
                      src={art.thumbnailDataUrl}
                      alt={art.title}
                      className="w-full h-full object-contain"
                    />

                    {theme && (
                      <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-700 shadow-xs flex items-center gap-1">
                        <span>{theme.iconEmoji}</span>
                        <span>{theme.title}</span>
                      </span>
                    )}
                  </div>

                  {/* Artwork Info & Icon Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <span className="font-extrabold text-slate-800 text-sm line-clamp-1">
                      {art.title}
                    </span>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => {
                          playPopSound();
                          onOpenSavedArtwork(art);
                        }}
                        className="p-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold flex items-center justify-center cursor-pointer shadow-xs transition-transform active:scale-95"
                        title="Editar Desenho"
                      >
                        <Paintbrush className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <button
                        onClick={() => {
                          playPopSound();
                          onShareArtwork(art);
                        }}
                        className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold flex items-center justify-center cursor-pointer shadow-xs transition-transform active:scale-95"
                        title="Compartilhar Desenho"
                      >
                        <Share2 className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <button
                        onClick={() => {
                          playPopSound();
                          if (confirm('Tem certeza que deseja apagar este desenho?')) {
                            onDeleteArtwork(art.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 font-bold cursor-pointer transition-transform active:scale-95 border border-slate-200"
                        title="Excluir Desenho"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
