import React, { useState, useEffect, useRef } from 'react';
import {
  Stroke,
  PhotoOverlay,
  StickerOverlay,
  ColoringTheme,
  ThemeOverlay,
  SavedArtwork,
  ToolType,
  AssistantType
} from './types';
import { COLORING_THEMES, VIBRANT_COLORS } from './data/themes';
import { SplashScreen } from './components/SplashScreen';
import { Gallery } from './components/Gallery';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { CameraModal } from './components/CameraModal';
import { ShareModal } from './components/ShareModal';
import { StickerBookModal } from './components/StickerBookModal';
import { GeometricShapesModal } from './components/GeometricShapesModal';
import { AssistantModal } from './components/AssistantModal';
import { AssistantPet } from './components/AssistantPet';
import { TopAdBanner } from './components/TopAdBanner';
import { StrokeEditorPanel } from './components/StrokeEditorPanel';
import { playFanfareSound, playPopSound, playEraserSound } from './utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, Share2, Save, LayoutGrid, Camera, Layers, Smile, Plus } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dobadoba_saved_artworks';

export default function App() {
  const [view, setView] = useState<'splash' | 'gallery' | 'canvas'>('splash');
  
  // Active Canvas Drawing State
  const [themeOverlays, setThemeOverlays] = useState<ThemeOverlay[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [firstThemeBg, setFirstThemeBg] = useState<string | null>(null);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
  
  const [photos, setPhotos] = useState<PhotoOverlay[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  
  const [stickers, setStickers] = useState<StickerOverlay[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const [selectedStrokeId, setSelectedStrokeId] = useState<string | null>(null);

  // Active Tool state
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [currentColor, setCurrentColor] = useState<string>(VIBRANT_COLORS[0].hex);
  const [brushWidth, setBrushWidth] = useState<number>(18);

  // Modals state
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [isStickerBookOpen, setIsStickerBookOpen] = useState(false);
  const [isShapesModalOpen, setIsShapesModalOpen] = useState(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);

  // Assistant Mascot State
  const [selectedAssistant, setSelectedAssistant] = useState<AssistantType>(() => {
    try {
      return (localStorage.getItem('dobadoba_assistant') as AssistantType) || 'rabbit';
    } catch (e) {
      return 'rabbit';
    }
  });
  const [isDrawing, setIsDrawing] = useState(false);

  const handleSelectAssistant = (assistant: AssistantType) => {
    setSelectedAssistant(assistant);
    try {
      localStorage.setItem('dobadoba_assistant', assistant);
    } catch (e) {
      console.error('Failed to save assistant preference', e);
    }
  };

  // Share Modal Preview Data
  const [shareImageDataUrl, setShareImageDataUrl] = useState<string | null>(null);
  const [shareArtworkTitle, setShareArtworkTitle] = useState<string>('Minha Arte DobaDoba');

  // Local Storage Saved Artworks
  const [savedArtworks, setSavedArtworks] = useState<SavedArtwork[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load saved artworks from localStorage on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('artekids_saved_artworks');
      if (data) {
        setSavedArtworks(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load saved artworks:', e);
    }
  }, []);

  // Save to localStorage helper
  const saveToLocalStorage = (artworks: SavedArtwork[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(artworks));
      setSavedArtworks(artworks);
    } catch (e) {
      console.error('Failed to save artworks:', e);
    }
  };

  // Start new blank drawing
  const handleNewBlankDrawing = () => {
    setThemeOverlays([]);
    setSelectedThemeId(null);
    setFirstThemeBg(null);
    setStrokes([]);
    setUndoStack([]);
    setRedoStack([]);
    setPhotos([]);
    setStickers([]);
    setSelectedPhotoId(null);
    setSelectedStickerId(null);
    setSelectedStrokeId(null);
    setView('canvas');
  };

  // Accumulate / Add theme to active drawing
  const handleSelectTheme = (theme: ColoringTheme | null) => {
    if (!theme) return;

    let currentFirstBg = firstThemeBg;
    if (!currentFirstBg && themeOverlays.length === 0) {
      currentFirstBg = theme.pastelBg;
      setFirstThemeBg(theme.pastelBg);
    }

    const offset = (themeOverlays.length % 5) * 15;

    const newOverlay: ThemeOverlay = {
      id: `theme_overlay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      themeId: theme.id,
      title: theme.title,
      iconEmoji: theme.iconEmoji,
      svgContent: theme.svgContent,
      pastelBg: theme.pastelBg,
      pastelBorder: theme.pastelBorder,
      pastelFill: theme.pastelFill,
      x: offset,
      y: offset,
      scale: 1,
      rotation: 0,
      opacity: 1,
    };

    setThemeOverlays((prev) => [...prev, newOverlay]);
    setSelectedThemeId(newOverlay.id);

    if (view !== 'canvas') {
      setView('canvas');
    }
  };

  // Update a theme overlay
  const handleUpdateTheme = (updated: ThemeOverlay) => {
    setThemeOverlays((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  // Delete a theme overlay
  const handleDeleteTheme = (id: string) => {
    playEraserSound();
    setThemeOverlays((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      if (filtered.length === 0) {
        setFirstThemeBg(null);
      }
      return filtered;
    });
    if (selectedThemeId === id) {
      setSelectedThemeId(null);
    }
  };

  // Open existing saved artwork
  const handleOpenSavedArtwork = (art: SavedArtwork) => {
    if (art.themeOverlays && art.themeOverlays.length > 0) {
      setThemeOverlays(art.themeOverlays);
      setFirstThemeBg(art.bgColor || art.themeOverlays[0].pastelBg);
    } else if (art.themeId) {
      const theme = COLORING_THEMES.find((t) => t.id === art.themeId);
      if (theme) {
        setThemeOverlays([
          {
            id: `theme_overlay_${Date.now()}`,
            themeId: theme.id,
            title: theme.title,
            iconEmoji: theme.iconEmoji,
            svgContent: theme.svgContent,
            pastelBg: theme.pastelBg,
            pastelBorder: theme.pastelBorder,
            pastelFill: theme.pastelFill,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
          },
        ]);
        setFirstThemeBg(theme.pastelBg);
      } else {
        setThemeOverlays([]);
        setFirstThemeBg(null);
      }
    } else {
      setThemeOverlays([]);
      setFirstThemeBg(null);
    }

    setStrokes(art.strokes || []);
    setPhotos(art.photoOverlays || []);
    setStickers(art.stickers || []);
    setUndoStack([]);
    setRedoStack([]);
    setView('canvas');
  };

  // Add stroke with undo support
  const handleAddStroke = (newStroke: Stroke) => {
    setUndoStack((prev) => [...prev, strokes]);
    setRedoStack([]);
    setStrokes((prev) => [...prev, newStroke]);
    setIsDrawing(true);
    setTimeout(() => setIsDrawing(false), 800);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, strokes]);
    setStrokes(previous);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, strokes]);
    setStrokes(next);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
  };

  // Add photo overlay from camera capture
  const handleCapturePhoto = (photoDataUrl: string) => {
    if (view !== 'canvas') {
      setView('canvas');
    }

    const canvasEl = canvasRef.current;
    let canvasW = 700;
    let canvasH = 500;

    if (canvasEl) {
      const rect = canvasEl.getBoundingClientRect();
      if (rect.width > 0) canvasW = rect.width;
      else if (canvasEl.width > 0) canvasW = canvasEl.width;

      if (rect.height > 0) canvasH = rect.height;
      else if (canvasEl.height > 0) canvasH = canvasEl.height;
    } else {
      canvasW = Math.min(window.innerWidth - 32, 900);
      canvasH = Math.min(window.innerHeight - 180, 600);
    }

    const photoWidth = 180;
    const photoHeight = 220;
    const centerX = canvasW / 2 - photoWidth / 2 + (Math.random() * 20 - 10);
    const centerY = canvasH / 2 - photoHeight / 2 + (Math.random() * 20 - 10);

    const newPhoto: PhotoOverlay = {
      id: `photo_${Date.now()}`,
      dataUrl: photoDataUrl,
      x: Math.max(10, centerX),
      y: Math.max(10, centerY),
      width: photoWidth,
      height: photoHeight,
      rotation: 0,
      scale: 1,
      opacity: 1,
    };
    setPhotos((prev) => [...prev, newPhoto]);
    setSelectedPhotoId(newPhoto.id);
  };

  // Add sticker or geometric shape
  const handleAddSticker = (emoji: string) => {
    if (view !== 'canvas') {
      setView('canvas');
    }

    const canvasEl = canvasRef.current;
    let canvasW = 700;
    let canvasH = 500;

    if (canvasEl) {
      const rect = canvasEl.getBoundingClientRect();
      if (rect.width > 0) canvasW = rect.width;
      else if (canvasEl.width > 0) canvasW = canvasEl.width;

      if (rect.height > 0) canvasH = rect.height;
      else if (canvasEl.height > 0) canvasH = canvasEl.height;
    } else {
      canvasW = Math.min(window.innerWidth - 32, 900);
      canvasH = Math.min(window.innerHeight - 180, 600);
    }

    const stickerBoxSize = 65;
    const centerX = canvasW / 2 - stickerBoxSize / 2 + (Math.random() * 30 - 15);
    const centerY = canvasH / 2 - stickerBoxSize / 2 + (Math.random() * 30 - 15);

    const newSticker: StickerOverlay = {
      id: `sticker_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      emoji,
      x: Math.max(10, centerX),
      y: Math.max(10, centerY),
      size: 1.2,
      rotation: 0,
      opacity: 1,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  // Combine canvas elements into high-res composite PNG data URL
  const getCombinedCanvasDataUrl = async (): Promise<string> => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1200;
    exportCanvas.height = 800;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return '';

    // 1. Fill Background (retains background color of first applied theme!)
    const activeBgColor = firstThemeBg || (themeOverlays.length > 0 ? themeOverlays[0].pastelBg : '#FFFFFF');
    ctx.fillStyle = activeBgColor;
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // 2. Render all accumulated Theme SVGs in order
    for (const themeOverlay of themeOverlays) {
      const svgBlob = new Blob([themeOverlay.svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.save();
          ctx.globalAlpha = themeOverlay.opacity;

          const scaleRatioX = 1200 / (canvasRef.current?.width || 1200);
          const scaleRatioY = 800 / (canvasRef.current?.height || 800);

          const cx = (canvasRef.current?.width || 800) / 2 + themeOverlay.x;
          const cy = (canvasRef.current?.height || 500) / 2 + themeOverlay.y;

          ctx.translate(cx * scaleRatioX, cy * scaleRatioY);
          ctx.rotate((themeOverlay.rotation * Math.PI) / 180);

          const w = 800 * themeOverlay.scale * scaleRatioX;
          const h = 500 * themeOverlay.scale * scaleRatioY;
          ctx.drawImage(img, -w / 2, -h / 2, w, h);
          ctx.restore();
          URL.revokeObjectURL(url);
          resolve(true);
        };
        img.onerror = () => resolve(false);
        img.src = url;
      });
    }

    // 3. Draw main canvas strokes
    if (canvasRef.current) {
      ctx.drawImage(canvasRef.current, 0, 0, exportCanvas.width, exportCanvas.height);
    }

    // 4. Draw Photo Overlays
    for (const photo of photos) {
      const photoImg = new Image();
      await new Promise((resolve) => {
        photoImg.onload = () => {
          ctx.save();
          ctx.globalAlpha = photo.opacity;

          const scaleRatioX = 1200 / (canvasRef.current?.width || 1200);
          const scaleRatioY = 800 / (canvasRef.current?.height || 800);

          const cx = photo.x * scaleRatioX;
          const cy = photo.y * scaleRatioY;
          const w = photo.width * photo.scale * scaleRatioX;
          const h = photo.height * photo.scale * scaleRatioY;

          ctx.translate(cx, cy);
          ctx.rotate((photo.rotation * Math.PI) / 180);
          ctx.drawImage(photoImg, -w / 2, -h / 2, w, h);
          ctx.restore();
          resolve(true);
        };
        photoImg.onerror = () => resolve(false);
        photoImg.src = photo.dataUrl;
      });
    }

    // 5. Draw Stickers
    for (const st of stickers) {
      ctx.save();
      ctx.globalAlpha = st.opacity;
      const scaleRatioX = 1200 / (canvasRef.current?.width || 1200);
      const scaleRatioY = 800 / (canvasRef.current?.height || 800);

      ctx.font = `${60 * st.size * scaleRatioX}px sans-serif`;
      ctx.translate(st.x * scaleRatioX, st.y * scaleRatioY);
      ctx.rotate((st.rotation * Math.PI) / 180);
      ctx.fillText(st.emoji, 0, 0);
      ctx.restore();
    }

    return exportCanvas.toDataURL('image/png');
  };

  // Save drawing to gallery
  const handleSaveDrawing = async () => {
    playFanfareSound();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    const thumbnailDataUrl = await getCombinedCanvasDataUrl();
    const title = themeOverlays.length > 0
      ? `Arte: ${themeOverlays.map((t) => t.title).join(' + ')}`
      : `Desenho Mágico #${savedArtworks.length + 1}`;

    const newArtwork: SavedArtwork = {
      id: `art_${Date.now()}`,
      title,
      createdAt: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      thumbnailDataUrl,
      strokes,
      photoOverlays: photos,
      stickers,
      themeOverlays,
      bgColor: firstThemeBg || (themeOverlays.length > 0 ? themeOverlays[0].pastelBg : '#FFFFFF'),
    };

    const updated = [newArtwork, ...savedArtworks];
    saveToLocalStorage(updated);

    // Open share modal
    setShareImageDataUrl(thumbnailDataUrl);
    setShareArtworkTitle(title);
    setIsShareModalOpen(true);
  };

  // Open share modal directly
  const handleTriggerShare = async () => {
    const dataUrl = await getCombinedCanvasDataUrl();
    setShareImageDataUrl(dataUrl);
    const title = themeOverlays.length > 0
      ? `Arte: ${themeOverlays.map((t) => t.title).join(' + ')}`
      : 'Minha Arte DobaDoba';
    setShareArtworkTitle(title);
    setIsShareModalOpen(true);
  };

  // Delete saved artwork
  const handleDeleteArtwork = (id: string) => {
    playEraserSound();
    const updated = savedArtworks.filter((a) => a.id !== id);
    saveToLocalStorage(updated);
  };

  return (
    <div className="w-screen h-screen h-[100dvh] overflow-hidden flex flex-col bg-slate-900 p-1.5 sm:p-2.5 box-border">
      <div className="w-full h-full flex flex-col relative overflow-hidden bg-slate-100 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-amber-300 shadow-2xl">
        {/* Top Ad Banner Space */}
        <TopAdBanner />

        {/* 1. Splash Screen View */}
      {view === 'splash' && (
        <SplashScreen
          onNewBlankDrawing={handleNewBlankDrawing}
          onOpenThemeSelector={() => setIsThemeModalOpen(true)}
          onOpenSavedArtworks={() => setView('gallery')}
          onOpenAssistantSelector={() => setIsAssistantModalOpen(true)}
          selectedAssistant={selectedAssistant}
        />
      )}

      {/* 2. Opening Gallery Screen View */}
      {view === 'gallery' && (
        <Gallery
          savedArtworks={savedArtworks}
          onNewBlankDrawing={handleNewBlankDrawing}
          onOpenThemeSelector={() => setIsThemeModalOpen(true)}
          onOpenSavedArtwork={handleOpenSavedArtwork}
          onShareArtwork={(art) => {
            setShareImageDataUrl(art.thumbnailDataUrl);
            setShareArtworkTitle(art.title);
            setIsShareModalOpen(true);
          }}
          onDeleteArtwork={handleDeleteArtwork}
          onOpenSplash={() => setView('splash')}
        />
      )}

      {/* 3. Interactive Painting Canvas View */}
      {view === 'canvas' && (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-200">
          {/* Top Canvas Header Bar */}
          <header className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 border-b-2 border-amber-300 flex items-center justify-between z-20 shadow-xs flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  playPopSound();
                  setView('splash');
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold flex items-center justify-center cursor-pointer transition-transform active:scale-95 border border-amber-300 shadow-xs"
                title="Voltar para a Tela Inicial"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center gap-1.5 ml-1">
                <span className="text-lg sm:text-xl">
                  {themeOverlays.length === 1
                    ? themeOverlays[0].iconEmoji
                    : themeOverlays.length > 1
                    ? '🎨'
                    : '✏️'}
                </span>
                <span className="font-extrabold text-slate-800 text-xs sm:text-sm line-clamp-1">
                  {themeOverlays.length === 0
                    ? 'Desenho Livre'
                    : themeOverlays.length === 1
                    ? themeOverlays[0].title
                    : `${themeOverlays.length} Temas Juntos (${themeOverlays.map((t) => t.title).join(' + ')})`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Novo Desenho */}
              <button
                onClick={() => {
                  playPopSound();
                  handleNewBlankDrawing();
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black shadow-xs border border-amber-300 cursor-pointer flex items-center justify-center transition-transform active:scale-95"
                title="Novo Desenho em Branco"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Assistente */}
              <button
                onClick={() => {
                  playPopSound();
                  setIsAssistantModalOpen(true);
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-transform active:scale-95 text-xs"
                title="Trocar Assistente"
              >
                <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline font-extrabold capitalize">
                  {selectedAssistant === 'rabbit' ? 'Coelho Rabicho' : selectedAssistant === 'cat' ? 'Gata Mimi' : selectedAssistant === 'dog' ? 'Cachorro Caramelo' : 'Assistente'}
                </span>
              </button>

              {/* Compartilhar */}
              <button
                onClick={handleTriggerShare}
                className="p-1.5 sm:p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold flex items-center justify-center cursor-pointer shadow-xs transition-transform active:scale-95"
                title="Compartilhar Arte"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Salvar Arte (À direita do botão Compartilhar) */}
              <button
                onClick={handleSaveDrawing}
                className="p-1.5 sm:p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold flex items-center justify-center cursor-pointer shadow-xs shadow-emerald-500/20 transition-transform active:scale-95"
                title="Salvar Arte"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </header>

          {/* Main Drawing Area */}
          <main className="flex-1 p-1 sm:p-2 relative overflow-hidden flex items-center justify-center min-h-0">
            <Canvas
              themeOverlays={themeOverlays}
              onUpdateTheme={handleUpdateTheme}
              onDeleteTheme={handleDeleteTheme}
              selectedThemeId={selectedThemeId}
              onSelectTheme={setSelectedThemeId}
              firstThemeBg={firstThemeBg}
              strokes={strokes}
              onAddStroke={handleAddStroke}
              activeTool={activeTool}
              currentColor={currentColor}
              brushWidth={brushWidth}
              photos={photos}
              onUpdatePhoto={(updated) =>
                setPhotos((prev) =>
                  prev.map((p) => (p.id === updated.id ? updated : p))
                )
              }
              onDeletePhoto={(id) =>
                setPhotos((prev) => prev.filter((p) => p.id !== id))
              }
              selectedPhotoId={selectedPhotoId}
              onSelectPhoto={setSelectedPhotoId}
              stickers={stickers}
              onUpdateSticker={(updated) =>
                setStickers((prev) =>
                  prev.map((s) => (s.id === updated.id ? updated : s))
                )
              }
              onDeleteSticker={(id) =>
                setStickers((prev) => prev.filter((s) => s.id !== id))
              }
              selectedStickerId={selectedStickerId}
              onSelectSticker={setSelectedStickerId}
              canvasRef={canvasRef}
            />
          </main>

          {/* Bottom Kids Toolbar */}
          <Toolbar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            currentColor={currentColor}
            onSelectColor={setCurrentColor}
            brushWidth={brushWidth}
            onChangeBrushWidth={setBrushWidth}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            onOpenCameraModal={() => setIsCameraModalOpen(true)}
            onToggleLayersPanel={() => setIsLayersPanelOpen((prev) => !prev)}
            isLayersPanelOpen={isLayersPanelOpen}
            onAddSticker={handleAddSticker}
            onOpenStickerBookModal={() => setIsStickerBookOpen(true)}
            onOpenShapesModal={() => setIsShapesModalOpen(true)}
            onOpenThemesModal={() => setIsThemeModalOpen(true)}
          />

          {/* Individual Stroke & Layers Editor Panel */}
          <StrokeEditorPanel
            isOpen={isLayersPanelOpen}
            onClose={() => setIsLayersPanelOpen(false)}
            strokes={strokes}
            photos={photos}
            stickers={stickers}
            themeOverlays={themeOverlays}
            selectedStrokeId={selectedStrokeId}
            selectedPhotoId={selectedPhotoId}
            selectedStickerId={selectedStickerId}
            selectedThemeId={selectedThemeId}
            onSelectStroke={setSelectedStrokeId}
            onSelectPhoto={setSelectedPhotoId}
            onSelectSticker={setSelectedStickerId}
            onSelectTheme={setSelectedThemeId}
            onUpdateStrokeOpacity={(id, opacity) =>
              setStrokes((prev) =>
                prev.map((s) => (s.id === id ? { ...s, opacity } : s))
              )
            }
            onUpdatePhotoOpacity={(id, opacity) =>
              setPhotos((prev) =>
                prev.map((p) => (p.id === id ? { ...p, opacity } : p))
              )
            }
            onUpdateThemeOpacity={(id, opacity) =>
              setThemeOverlays((prev) =>
                prev.map((t) => (t.id === id ? { ...t, opacity } : t))
              )
            }
            onDeleteStroke={(id) =>
              setStrokes((prev) => prev.filter((s) => s.id !== id))
            }
            onDeletePhoto={(id) =>
              setPhotos((prev) => prev.filter((p) => p.id !== id))
            }
            onDeleteSticker={(id) =>
              setStickers((prev) => prev.filter((s) => s.id !== id))
            }
            onDeleteTheme={handleDeleteTheme}
            onClearAllStrokes={() => {
              setStrokes([]);
              setPhotos([]);
              setStickers([]);
              setThemeOverlays([]);
              setFirstThemeBg(null);
            }}
          />
        </div>
      )}

      {/* Global Modals */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        onSelectTheme={handleSelectTheme}
        currentThemeId={selectedThemeId ? themeOverlays.find(t => t.id === selectedThemeId)?.themeId : undefined}
      />

      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapturePhoto={handleCapturePhoto}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        imageDataUrl={shareImageDataUrl}
        artworkTitle={shareArtworkTitle}
      />

      <StickerBookModal
        isOpen={isStickerBookOpen}
        onClose={() => setIsStickerBookOpen(false)}
        onAddSticker={handleAddSticker}
      />

      <GeometricShapesModal
        isOpen={isShapesModalOpen}
        onClose={() => setIsShapesModalOpen(false)}
        onAddShape={handleAddSticker}
      />

      {/* Assistant Selection Modal */}
      <AssistantModal
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
        selectedAssistant={selectedAssistant}
        onSelectAssistant={handleSelectAssistant}
      />

      {/* Animated Assistant Mascot Component */}
      <AssistantPet
        assistant={selectedAssistant}
        isDrawing={isDrawing}
        currentColor={currentColor}
        onChangeAssistantClick={() => setIsAssistantModalOpen(true)}
      />
      </div>
    </div>
  );
}
