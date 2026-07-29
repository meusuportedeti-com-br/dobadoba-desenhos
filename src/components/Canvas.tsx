import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stroke, Point, PhotoOverlay, StickerOverlay, ThemeOverlay, ToolType } from '../types';
import { drawRainbowStroke } from '../utils/rainbow';
import { playRainbowSound } from '../utils/audio';
import { Move, RotateCw, ZoomIn, ZoomOut, Trash2, Check } from 'lucide-react';

interface CanvasProps {
  themeOverlays: ThemeOverlay[];
  onUpdateTheme: (theme: ThemeOverlay) => void;
  onDeleteTheme: (id: string) => void;
  selectedThemeId: string | null;
  onSelectTheme: (id: string | null) => void;
  firstThemeBg: string | null;
  strokes: Stroke[];
  onAddStroke: (stroke: Stroke) => void;
  activeTool: ToolType;
  currentColor: string;
  brushWidth: number;
  photos: PhotoOverlay[];
  onUpdatePhoto: (photo: PhotoOverlay) => void;
  onDeletePhoto: (id: string) => void;
  selectedPhotoId: string | null;
  onSelectPhoto: (id: string | null) => void;
  stickers: StickerOverlay[];
  onUpdateSticker: (sticker: StickerOverlay) => void;
  onDeleteSticker: (id: string) => void;
  selectedStickerId: string | null;
  onSelectSticker: (id: string | null) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const Canvas: React.FC<CanvasProps> = ({
  themeOverlays,
  onUpdateTheme,
  onDeleteTheme,
  selectedThemeId,
  onSelectTheme,
  firstThemeBg,
  strokes,
  onAddStroke,
  activeTool,
  currentColor,
  brushWidth,
  photos,
  onUpdatePhoto,
  onDeletePhoto,
  selectedPhotoId,
  onSelectPhoto,
  stickers,
  onUpdateSticker,
  onDeleteSticker,
  selectedStickerId,
  onSelectSticker,
  canvasRef,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  // Dragging state for theme / photo / sticker manipulation
  const [dragItem, setDragItem] = useState<{
    id: string;
    type: 'theme' | 'photo' | 'sticker';
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  // Redraw Canvas content
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render strokes
    strokes.forEach((stroke) => {
      ctx.save();
      ctx.globalAlpha = stroke.opacity;

      if (stroke.type === 'rainbow') {
        drawRainbowStroke(ctx, stroke.points, stroke.width, stroke.opacity);
      } else if (stroke.type === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = stroke.width;
        if (stroke.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          stroke.points.forEach((p) => ctx.lineTo(p.x, p.y));
          ctx.stroke();
        }
      } else {
        // Normal Brush
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = stroke.width;
        ctx.strokeStyle = stroke.color;

        if (stroke.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          stroke.points.forEach((p) => ctx.lineTo(p.x, p.y));
          ctx.stroke();
        }
      }

      ctx.restore();
    });

    // Draw active stroke being drawn right now
    if (isDrawing && currentPoints.length > 0) {
      ctx.save();
      if (activeTool === 'rainbow') {
        drawRainbowStroke(ctx, currentPoints, brushWidth, 1);
      } else if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = brushWidth;
        ctx.beginPath();
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        currentPoints.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      } else {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = currentColor;
        ctx.beginPath();
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        currentPoints.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
      ctx.restore();
    }
  }, [canvasRef, strokes, isDrawing, currentPoints, activeTool, brushWidth, currentColor]);

  // Adjust canvas size to parent container
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const canvas = canvasRef.current;
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        redraw();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [redraw, canvasRef]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Get pointer coordinates relative to canvas
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const pt = getCanvasPoint(e);
    setCurrentPoints([pt]);

    if (activeTool === 'rainbow') {
      playRainbowSound();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pt = getCanvasPoint(e);
    setCurrentPoints((prev) => [...prev, pt]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.length > 0) {
      const newStroke: Stroke = {
        id: `stroke_${Date.now()}_${Math.random()}`,
        type: activeTool === 'rainbow' ? 'rainbow' : activeTool === 'eraser' ? 'eraser' : 'brush',
        points: currentPoints,
        color: currentColor,
        width: brushWidth,
        opacity: 1,
        timestamp: Date.now(),
      };
      onAddStroke(newStroke);
    }
    setCurrentPoints([]);
  };

  // Drag handlers for overlay items (Theme / Photo / Sticker)
  const handleItemPointerDown = (
    e: React.PointerEvent,
    id: string,
    type: 'theme' | 'photo' | 'sticker',
    initialX: number,
    initialY: number
  ) => {
    e.stopPropagation();
    if (type === 'theme') {
      onSelectTheme(id);
      onSelectPhoto(null);
      onSelectSticker(null);
    } else if (type === 'photo') {
      onSelectPhoto(id);
      onSelectTheme(null);
      onSelectSticker(null);
    } else {
      onSelectSticker(id);
      onSelectTheme(null);
      onSelectPhoto(null);
    }

    setDragItem({
      id,
      type,
      startX: e.clientX,
      startY: e.clientY,
      initialX,
      initialY,
    });
  };

  const handleContainerPointerMove = (e: React.PointerEvent) => {
    if (!dragItem) return;
    const dx = e.clientX - dragItem.startX;
    const dy = e.clientY - dragItem.startY;

    if (dragItem.type === 'theme') {
      const themeOverlay = themeOverlays.find((t) => t.id === dragItem.id);
      if (themeOverlay) {
        onUpdateTheme({
          ...themeOverlay,
          x: dragItem.initialX + dx,
          y: dragItem.initialY + dy,
        });
      }
    } else if (dragItem.type === 'photo') {
      const photo = photos.find((p) => p.id === dragItem.id);
      if (photo) {
        onUpdatePhoto({
          ...photo,
          x: dragItem.initialX + dx,
          y: dragItem.initialY + dy,
        });
      }
    } else {
      const sticker = stickers.find((s) => s.id === dragItem.id);
      if (sticker) {
        onUpdateSticker({
          ...sticker,
          x: dragItem.initialX + dx,
          y: dragItem.initialY + dy,
        });
      }
    }
  };

  const handleContainerPointerUp = () => {
    setDragItem(null);
  };

  const canvasBgColor = firstThemeBg || (themeOverlays.length > 0 ? themeOverlays[0].pastelBg : '#FFFFFF');

  return (
    <div
      ref={containerRef}
      onPointerMove={handleContainerPointerMove}
      onPointerUp={handleContainerPointerUp}
      style={{
        backgroundColor: canvasBgColor,
      }}
      className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300 flex items-center justify-center select-none touch-none transition-colors duration-300"
    >
      {/* Accumulative Theme Vector SVGs Layer (z-[5]) */}
      {themeOverlays.map((themeOverlay) => {
        const isSelected = selectedThemeId === themeOverlay.id;
        return (
          <div
            key={themeOverlay.id}
            style={{
              transform: `translate(${themeOverlay.x}px, ${themeOverlay.y}px) rotate(${themeOverlay.rotation}deg) scale(${themeOverlay.scale})`,
              opacity: themeOverlay.opacity,
            }}
            className="absolute inset-0 pointer-events-none p-4 flex items-center justify-center z-[5] transition-transform"
          >
            <div className={`w-full h-full max-h-full max-w-full flex items-center justify-center ${
              isSelected ? 'drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]' : ''
            }`}>
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full object-contain"
                dangerouslySetInnerHTML={{ __html: themeOverlay.svgContent }}
              />
            </div>
          </div>
        );
      })}

      {/* Main Drawing Canvas (z-10) */}
      <canvas
        ref={canvasRef as React.RefObject<HTMLCanvasElement>}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
      />

      {/* Theme Control Handle Badges Layer (z-20) */}
      {themeOverlays.map((themeOverlay) => {
        const isSelected = selectedThemeId === themeOverlay.id;
        return (
          <div
            key={`handle_${themeOverlay.id}`}
            onPointerDown={(e) =>
              handleItemPointerDown(e, themeOverlay.id, 'theme', themeOverlay.x, themeOverlay.y)
            }
            style={{
              transform: `translate(${themeOverlay.x}px, ${themeOverlay.y - 170 * themeOverlay.scale}px)`,
            }}
            className={`absolute z-20 cursor-move touch-none flex flex-col items-center select-none transition-transform ${
              isSelected ? 'scale-105' : 'hover:scale-105'
            }`}
          >
            <div className={`px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border-2 flex items-center gap-1.5 text-xs font-black transition-all ${
              isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-950 ring-4 ring-indigo-300' : 'border-indigo-300 text-slate-800 hover:border-indigo-400'
            }`}>
              <span className="text-base sm:text-lg">{themeOverlay.iconEmoji}</span>
              <span>{themeOverlay.title}</span>
              <Move className="w-3.5 h-3.5 text-indigo-600 ml-0.5" />
            </div>

            {/* Selected Theme Manipulation Toolbar */}
            {isSelected && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="mt-2 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border-2 border-indigo-400 flex items-center gap-1.5 z-30"
              >
                {/* Scale Up */}
                <button
                  onClick={() =>
                    onUpdateTheme({
                      ...themeOverlay,
                      scale: Math.min(themeOverlay.scale + 0.15, 3.0),
                    })
                  }
                  className="p-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 cursor-pointer transition-transform active:scale-95"
                  title="Aumentar Tamanho do Tema"
                >
                  <ZoomIn className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Scale Down */}
                <button
                  onClick={() =>
                    onUpdateTheme({
                      ...themeOverlay,
                      scale: Math.max(themeOverlay.scale - 0.15, 0.3),
                    })
                  }
                  className="p-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 cursor-pointer transition-transform active:scale-95"
                  title="Diminuir Tamanho do Tema"
                >
                  <ZoomOut className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Rotate Control */}
                <button
                  onClick={() =>
                    onUpdateTheme({
                      ...themeOverlay,
                      rotation: (themeOverlay.rotation + 15) % 360,
                    })
                  }
                  className="p-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 cursor-pointer transition-transform active:scale-95"
                  title="Girar Tema"
                >
                  <RotateCw className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Delete Control */}
                <button
                  onClick={() => onDeleteTheme(themeOverlay.id)}
                  className="p-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 cursor-pointer transition-transform active:scale-95"
                  title="Apagar Tema"
                >
                  <Trash2 className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Confirm Position */}
                <button
                  onClick={() => onSelectTheme(null)}
                  className="p-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer transition-transform active:scale-95"
                  title="Confirmar Posição"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Photo Overlays Layer */}
      {photos.map((photo) => {
        const isSelected = selectedPhotoId === photo.id;
        return (
          <div
            key={photo.id}
            onPointerDown={(e) =>
              handleItemPointerDown(e, photo.id, 'photo', photo.x, photo.y)
            }
            style={{
              transform: `translate(${photo.x}px, ${photo.y}px) rotate(${photo.rotation}deg) scale(${photo.scale})`,
              opacity: photo.opacity,
            }}
            className={`absolute z-20 cursor-move flex items-center justify-center touch-none group transition-shadow ${
              isSelected ? 'ring-4 ring-amber-400 rounded-3xl shadow-2xl bg-white/20 p-2' : ''
            }`}
          >
            {/* Oval Cropped Photo */}
            <div className="w-36 h-44 sm:w-44 sm:h-52 rounded-[50%] overflow-hidden border-4 border-amber-300 shadow-lg pointer-events-none bg-white">
              <img
                src={photo.dataUrl}
                alt="Foto Oval"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Selected Manipulation Controls (Resize, Rotate, Delete) */}
            {isSelected && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-xl border-2 border-amber-300 flex items-center gap-2 z-30"
              >
                {/* Scale Control */}
                <button
                  onClick={() =>
                    onUpdatePhoto({
                      ...photo,
                      scale: Math.min(photo.scale + 0.15, 2.5),
                    })
                  }
                  className="p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer"
                  title="Aumentar Tamanho"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Rotate Control */}
                <button
                  onClick={() =>
                    onUpdatePhoto({
                      ...photo,
                      rotation: (photo.rotation + 15) % 360,
                    })
                  }
                  className="p-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 cursor-pointer"
                  title="Girar Foto"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Delete Control */}
                <button
                  onClick={() => onDeletePhoto(photo.id)}
                  className="p-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 cursor-pointer"
                  title="Excluir Foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Confirm Control */}
                <button
                  onClick={() => onSelectPhoto(null)}
                  className="p-1.5 rounded-xl bg-emerald-500 text-white cursor-pointer"
                  title="Confirmar Posição"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Stickers Overlays Layer */}
      {stickers.map((st) => {
        const isSelected = selectedStickerId === st.id;
        return (
          <div
            key={st.id}
            onPointerDown={(e) =>
              handleItemPointerDown(e, st.id, 'sticker', st.x, st.y)
            }
            style={{
              transform: `translate(${st.x}px, ${st.y}px) rotate(${st.rotation}deg) scale(${st.size})`,
              opacity: st.opacity,
            }}
            className={`absolute z-20 cursor-move text-5xl sm:text-6xl select-none p-2 ${
              isSelected ? 'ring-4 ring-pink-400 rounded-2xl bg-white/30 shadow-xl' : ''
            }`}
          >
            <span>{st.emoji}</span>

            {isSelected && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-xl border-2 border-pink-300 flex items-center gap-2 z-30"
              >
                {/* Scale Up */}
                <button
                  onClick={() =>
                    onUpdateSticker({
                      ...st,
                      size: Math.min(st.size + 0.25, 3.5),
                    })
                  }
                  className="p-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 cursor-pointer"
                  title="Aumentar Tamanho do Adesivo"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Scale Down */}
                <button
                  onClick={() =>
                    onUpdateSticker({
                      ...st,
                      size: Math.max(st.size - 0.25, 0.4),
                    })
                  }
                  className="p-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 cursor-pointer"
                  title="Diminuir Tamanho do Adesivo"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                {/* Rotate Control */}
                <button
                  onClick={() =>
                    onUpdateSticker({
                      ...st,
                      rotation: (st.rotation + 15) % 360,
                    })
                  }
                  className="p-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 cursor-pointer"
                  title="Girar Adesivo"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Delete Control */}
                <button
                  onClick={() => onDeleteSticker(st.id)}
                  className="p-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 cursor-pointer"
                  title="Apagar Adesivo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Confirm Position */}
                <button
                  onClick={() => onSelectSticker(null)}
                  className="p-1.5 rounded-xl bg-emerald-500 text-white cursor-pointer"
                  title="Confirmar Posição"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
