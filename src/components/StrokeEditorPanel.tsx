import React from 'react';
import { AnimatePresence } from 'motion/react';
import { X, Trash2, Layers, SunMedium, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { Stroke, PhotoOverlay, StickerOverlay, ThemeOverlay } from '../types';
import { playEraserSound, playPopSound } from '../utils/audio';

interface StrokeEditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  strokes: Stroke[];
  photos: PhotoOverlay[];
  stickers: StickerOverlay[];
  themeOverlays: ThemeOverlay[];
  selectedStrokeId: string | null;
  selectedPhotoId: string | null;
  selectedStickerId: string | null;
  selectedThemeId: string | null;
  onSelectStroke: (id: string | null) => void;
  onSelectPhoto: (id: string | null) => void;
  onSelectSticker: (id: string | null) => void;
  onSelectTheme: (id: string | null) => void;
  onUpdateStrokeOpacity: (id: string, opacity: number) => void;
  onUpdatePhotoOpacity: (id: string, opacity: number) => void;
  onUpdateThemeOpacity: (id: string, opacity: number) => void;
  onDeleteStroke: (id: string) => void;
  onDeletePhoto: (id: string) => void;
  onDeleteSticker: (id: string) => void;
  onDeleteTheme: (id: string) => void;
  onClearAllStrokes: () => void;
}

export const StrokeEditorPanel: React.FC<StrokeEditorPanelProps> = ({
  isOpen,
  onClose,
  strokes,
  photos,
  stickers,
  themeOverlays,
  selectedStrokeId,
  selectedPhotoId,
  selectedStickerId,
  selectedThemeId,
  onSelectStroke,
  onSelectPhoto,
  onSelectSticker,
  onSelectTheme,
  onUpdateStrokeOpacity,
  onUpdatePhotoOpacity,
  onUpdateThemeOpacity,
  onDeleteStroke,
  onDeletePhoto,
  onDeleteSticker,
  onDeleteTheme,
  onClearAllStrokes,
}) => {
  if (!isOpen) return null;

  const activeStroke = strokes.find((s) => s.id === selectedStrokeId);
  const activePhoto = photos.find((p) => p.id === selectedPhotoId);
  const activeTheme = themeOverlays.find((t) => t.id === selectedThemeId);

  return (
    <AnimatePresence>
      <div className="fixed bottom-20 right-4 z-40 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border-4 border-amber-300 flex flex-col max-h-[75vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>Editar Temas e Camadas</span>
          </div>
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Layer Controls (Opacity & Erase) */}
        {(activeStroke || activePhoto || activeTheme) && (
          <div className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200 mb-3 shadow-inner">
            <div className="text-xs font-bold text-amber-900 mb-2 flex items-center justify-between">
              <span>
                {activeTheme
                  ? `🎨 Tema: ${activeTheme.title}`
                  : activeStroke
                  ? activeStroke.type === 'rainbow'
                    ? '🌈 Traço Arco-Íris Selecionado'
                    : '🎨 Traço de Pincel Selecionado'
                  : '📸 Foto Oval Selecionada'}
              </span>
              <button
                onClick={() => {
                  playEraserSound();
                  if (activeTheme) onDeleteTheme(activeTheme.id);
                  if (activeStroke) onDeleteStroke(activeStroke.id);
                  if (activePhoto) onDeletePhoto(activePhoto.id);
                }}
                className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm cursor-pointer transition-transform active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Apagar</span>
              </button>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                  <SunMedium className="w-3.5 h-3.5 text-amber-600" /> Opacidade:
                </span>
                <span className="font-bold text-amber-800">
                  {Math.round(
                    ((activeTheme ? activeTheme.opacity : activeStroke ? activeStroke.opacity : activePhoto?.opacity || 1) * 100)
                  )}
                  %
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={activeTheme ? activeTheme.opacity : activeStroke ? activeStroke.opacity : activePhoto?.opacity || 1}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (activeTheme) onUpdateThemeOpacity(activeTheme.id, val);
                  if (activeStroke) onUpdateStrokeOpacity(activeStroke.id, val);
                  if (activePhoto) onUpdatePhotoOpacity(activePhoto.id, val);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* List of Layers (Themes, Photos, Stickers, Strokes) */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {themeOverlays.length === 0 && strokes.length === 0 && photos.length === 0 && stickers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              Nenhum elemento adicionado ainda. Escolha um tema ou desenhe! 🎨
            </div>
          ) : (
            <>
              {/* Theme Overlays Layers */}
              {themeOverlays.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 mb-1.5 px-1">
                    Temas Aplicados ({themeOverlays.length})
                  </div>
                  <div className="space-y-1.5">
                    {themeOverlays.map((themeOverlay, index) => {
                      const isSel = selectedThemeId === themeOverlay.id;
                      return (
                        <div
                          key={themeOverlay.id}
                          onClick={() => {
                            playPopSound();
                            onSelectTheme(themeOverlay.id);
                            onSelectStroke(null);
                            onSelectPhoto(null);
                            onSelectSticker(null);
                          }}
                          className={`p-2.5 rounded-xl border-2 flex items-center justify-between text-xs font-bold cursor-pointer transition-all ${
                            isSel
                              ? 'bg-indigo-100 border-indigo-400 text-indigo-950 shadow-sm ring-2 ring-indigo-200'
                              : 'bg-indigo-50/60 border-indigo-200 text-slate-700 hover:bg-indigo-100/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{themeOverlay.iconEmoji}</span>
                            <span>{themeOverlay.title} {index === 0 ? '(Cor Base)' : ''}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                              {Math.round(themeOverlay.scale * 100)}%
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playEraserSound();
                                onDeleteTheme(themeOverlay.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                              title="Apagar Tema"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Photo Layers */}
              {photos.map((photo, index) => {
                const isSel = selectedPhotoId === photo.id;
                return (
                  <div
                    key={photo.id}
                    onClick={() => {
                      playPopSound();
                      onSelectPhoto(photo.id);
                      onSelectTheme(null);
                      onSelectStroke(null);
                      onSelectSticker(null);
                    }}
                    className={`p-2.5 rounded-xl border-2 flex items-center justify-between text-xs font-bold cursor-pointer transition-all ${
                      isSel
                        ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-300 bg-white">
                        <img src={photo.dataUrl} alt="Foto" className="w-full h-full object-cover" />
                      </div>
                      <span>Foto Oval #{index + 1}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playEraserSound();
                        onDeletePhoto(photo.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Strokes Layers */}
              {strokes.map((stroke, index) => {
                const isSel = selectedStrokeId === stroke.id;
                return (
                  <div
                    key={stroke.id}
                    onClick={() => {
                      playPopSound();
                      onSelectStroke(stroke.id);
                      onSelectTheme(null);
                      onSelectPhoto(null);
                      onSelectSticker(null);
                    }}
                    className={`p-2.5 rounded-xl border-2 flex items-center justify-between text-xs font-bold cursor-pointer transition-all ${
                      isSel
                        ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300"
                        style={{
                          background:
                            stroke.type === 'rainbow'
                              ? 'linear-gradient(to right, red, orange, yellow, green, blue, violet)'
                              : stroke.color,
                        }}
                      />
                      <span>
                        {stroke.type === 'rainbow' ? 'Pincel Arco-Íris' : 'Traço Pincel'} #{index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        {Math.round(stroke.opacity * 100)}%
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playEraserSound();
                          onDeleteStroke(stroke.id);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Stickers Layers */}
              {stickers.map((sticker, index) => (
                <div
                  key={sticker.id}
                  onClick={() => {
                    playPopSound();
                    onSelectSticker(sticker.id);
                    onSelectTheme(null);
                    onSelectStroke(null);
                    onSelectPhoto(null);
                  }}
                  className={`p-2.5 rounded-xl border-2 flex items-center justify-between text-xs font-bold cursor-pointer transition-all ${
                    selectedStickerId === sticker.id
                      ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sticker.emoji}</span>
                    <span>Adesivo #{index + 1}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playEraserSound();
                      onDeleteSticker(sticker.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Clear All Button */}
        {(strokes.length > 0 || photos.length > 0 || stickers.length > 0 || themeOverlays.length > 0) && (
          <button
            onClick={() => {
              playEraserSound();
              onClearAllStrokes();
            }}
            className="mt-3 w-full py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center gap-2 border border-red-200 cursor-pointer transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Todos os Desenhos e Temas</span>
          </button>
        )}
      </div>
    </AnimatePresence>
  );
};
