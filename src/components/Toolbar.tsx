import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Paintbrush,
  Eraser,
  Sparkles,
  Camera,
  RotateCcw,
  RotateCw,
  Layers,
  Volume2,
  VolumeX,
  Smile,
  Shapes,
  LayoutGrid,
} from 'lucide-react';
import { ToolType } from '../types';
import { VIBRANT_COLORS } from '../data/themes';
import { playPopSound, isSoundEnabled, setSoundEnabled } from '../utils/audio';

interface ToolbarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  currentColor: string;
  onSelectColor: (color: string) => void;
  brushWidth: number;
  onChangeBrushWidth: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenCameraModal: () => void;
  onToggleLayersPanel: () => void;
  isLayersPanelOpen: boolean;
  onAddSticker: (emoji: string) => void;
  onOpenStickerBookModal: () => void;
  onOpenShapesModal: () => void;
  onOpenThemesModal: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onSelectTool,
  currentColor,
  onSelectColor,
  brushWidth,
  onChangeBrushWidth,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenCameraModal,
  onToggleLayersPanel,
  isLayersPanelOpen,
  onAddSticker,
  onOpenStickerBookModal,
  onOpenShapesModal,
  onOpenThemesModal,
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const brushSizes = [
    { label: 'Muito Fino', value: 5, iconSize: 'w-1.5 h-1.5' },
    { label: 'Pequeno', value: 8, iconSize: 'w-2 h-2' },
    { label: 'Médio', value: 18, iconSize: 'w-3.5 h-3.5' },
    { label: 'Grande', value: 30, iconSize: 'w-5 h-5' },
    { label: 'Gigante', value: 50, iconSize: 'w-7 h-7' },
  ];

  const handleToolClick = (tool: ToolType) => {
    playPopSound();
    onSelectTool(tool);
  };

  const handleSoundToggle = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) playPopSound();
  };

  return (
    <div className="w-full max-h-[30vh] sm:max-h-[28vh] flex-shrink-0 bg-white/95 backdrop-blur-md border-t-3 border-amber-300 p-1.5 sm:p-2 shadow-2xl flex flex-col justify-between gap-1.5 select-none z-30 overflow-y-auto">
      {/* Upper Tools Row */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        {/* LEFT: Pincel + Tamanhos do Pincel */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Pincel Normal */}
          <button
            onClick={() => handleToolClick('brush')}
            className={`p-1.5 sm:p-2 rounded-xl font-black flex items-center justify-center cursor-pointer border-2 transition-all ${
              activeTool === 'brush'
                ? 'bg-rose-500 text-white border-rose-300 shadow-sm scale-105 ring-2 ring-rose-200'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Pincel Normal"
          >
            <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Tamanho do Pincel - Ao lado do pincel */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200">
            {brushSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => {
                  playPopSound();
                  onChangeBrushWidth(size.value);
                }}
                className={`p-1 sm:p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                  brushWidth === size.value
                    ? 'bg-amber-400 text-amber-950 font-bold shadow-xs'
                    : 'hover:bg-slate-200 text-slate-600'
                }`}
                title={`${size.label} (${size.value}px)`}
              >
                <div
                  className={`rounded-full bg-current ${size.iconSize}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* CENTER / CREATIVE TOOLS: Arco-Íris, Câmera, Borracha, Adesivos, Formas, Temas */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Pincel Mágico Arco-Íris */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleToolClick('rainbow')}
            className={`p-1.5 sm:p-2 rounded-xl font-black flex items-center justify-center cursor-pointer border-2 transition-all bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-600 text-white ${
              activeTool === 'rainbow'
                ? 'border-white shadow-md scale-105 ring-2 ring-amber-300 animate-pulse'
                : 'border-amber-200/80 shadow-xs opacity-90 hover:opacity-100'
            }`}
            title="Pincel Mágico Arco-Íris 🌈"
          >
            <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-md" />
          </motion.button>

          {/* Camera Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              playPopSound();
              onOpenCameraModal();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black shadow-sm border border-purple-300 cursor-pointer flex items-center justify-center"
            title="Tirar Foto / Moldura Oval"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Borracha (à direita da câmera) */}
          <button
            onClick={() => handleToolClick('eraser')}
            className={`p-1.5 sm:p-2 rounded-xl font-black flex items-center justify-center cursor-pointer border-2 transition-all ${
              activeTool === 'eraser'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm scale-105 ring-2 ring-slate-400'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Borracha"
          >
            <Eraser className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Adesivos */}
          <button
            onClick={() => {
              playPopSound();
              onOpenStickerBookModal();
            }}
            className="p-1.5 sm:p-2 rounded-xl font-black bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white border-2 border-pink-300 flex items-center justify-center cursor-pointer shadow-sm shadow-pink-500/20 active:scale-95 transition-transform"
            title="Abrir Livro de Adesivos 📖"
          >
            <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-200" />
          </button>

          {/* Formas Geométricas */}
          <button
            onClick={() => {
              playPopSound();
              onOpenShapesModal();
            }}
            className="p-1.5 sm:p-2 rounded-xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-2 border-indigo-300 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-transform"
            title="Formas Geométricas 📐"
          >
            <Shapes className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-100" />
          </button>

          {/* Escolher Tema */}
          <button
            onClick={() => {
              playPopSound();
              onOpenThemesModal();
            }}
            className="p-1.5 sm:p-2 rounded-xl font-black bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-teal-950 border-2 border-teal-300 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-transform"
            title="Escolher Tema para Colorir 🎨"
          >
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-teal-950" />
          </button>
        </div>

        {/* RIGHT (Alinhados à Direita): Camadas, Desfazer, Refazer, Volume/Som */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
          {/* Stroke Editor Layers Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              playPopSound();
              onToggleLayersPanel();
            }}
            className={`p-1.5 sm:p-2 rounded-xl font-black shadow-sm border transition-all cursor-pointer flex items-center justify-center ${
              isLayersPanelOpen
                ? 'bg-amber-500 text-white border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title="Gerenciador de Camadas e Traços"
          >
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Desfazer */}
          <button
            disabled={!canUndo}
            onClick={() => {
              playPopSound();
              onUndo();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-100 text-slate-700 font-bold cursor-pointer flex items-center justify-center border border-slate-200"
            title="Desfazer"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Refazer */}
          <button
            disabled={!canRedo}
            onClick={() => {
              playPopSound();
              onRedo();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-100 text-slate-700 font-bold cursor-pointer flex items-center justify-center border border-slate-200"
            title="Refazer"
          >
            <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Som */}
          <button
            onClick={handleSoundToggle}
            className={`p-1.5 sm:p-2 rounded-xl font-bold cursor-pointer transition-colors flex items-center justify-center border ${
              soundOn
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={soundOn ? 'Som Ativado' : 'Som Desativado'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* BOTTOM LINE: Color Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 px-1 scrollbar-thin">
        {VIBRANT_COLORS.map((c) => {
          const isSel = currentColor === c.hex && activeTool !== 'rainbow';
          return (
            <button
              key={c.hex}
              onClick={() => {
                playPopSound();
                onSelectColor(c.hex);
                if (activeTool === 'eraser' || activeTool === 'rainbow') {
                  onSelectTool('brush');
                }
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex-shrink-0 cursor-pointer transition-transform ${
                isSel
                  ? 'border-slate-900 scale-125 ring-2 ring-amber-400 shadow-md'
                  : 'border-white hover:scale-110 shadow-xs'
              }`}
              title={c.name}
            />
          );
        })}

        {/* Custom Color Input */}
        <label
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-dashed border-slate-400 flex items-center justify-center cursor-pointer hover:border-amber-500 relative flex-shrink-0 bg-gradient-to-br from-red-400 via-green-400 to-blue-400"
          title="Escolher Cor Personalizada"
        >
          <input
            type="color"
            value={currentColor}
            onChange={(e) => {
              onSelectColor(e.target.value);
              if (activeTool === 'eraser' || activeTool === 'rainbow') {
                onSelectTool('brush');
              }
            }}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
